from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

from app.ai import call_gemini
from app.prompts import build_resume_prompt
from app.schemas import ResumeRequest, ResumeResponse

app = FastAPI()

app_env = os.getenv("APP_ENV", "development").strip().lower()
default_allowed_origins = {
    "production": "https://example.com",
    "staging": "https://staging.example.com,http://localhost:5173,http://127.0.0.1:5173",
    "development": "http://localhost:5173,http://127.0.0.1:5173",
}.get(app_env, "http://localhost:5173,http://127.0.0.1:5173")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        default_allowed_origins,
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _parse_json_from_ai_response(raw_text: str):
    # Accepts plain JSON or JSON wrapped by markdown fences.
    cleaned = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and start < end:
            return json.loads(cleaned[start:end + 1])
        raise


def _normalize_resume_response(parsed: dict, fallback_payload: dict):
    # Fills missing sections with user input and normalizes experience description by style.
    response = {
        "personal": parsed.get("personal") or fallback_payload.get("personal", {}),
        "summary": parsed.get("summary") or fallback_payload.get("summary", ""),
        "experiences": parsed.get("experiences") or fallback_payload.get("experiences", []),
        "education": parsed.get("education") or fallback_payload.get("education", []),
        "extras": parsed.get("extras") or fallback_payload.get("extras", {}),
    }

    fallback_experiences = fallback_payload.get("experiences", [])
    normalized_experiences = []

    for index, exp in enumerate(response["experiences"]):
        if not isinstance(exp, dict):
            continue

        fallback_exp = fallback_experiences[index] if index < len(fallback_experiences) else {}
        style = exp.get("style") or fallback_exp.get("style") or "bullet"
        description = exp.get("description", "")

        if style == "paragraph":
            if isinstance(description, list):
                description = " ".join(str(item).strip() for item in description if str(item).strip())
            else:
                description = " ".join(str(description).replace("\n", " ").split())
        else:
            if isinstance(description, str):
                lines = [line.replace("-", "", 1).strip() for line in description.split("\n") if line.strip()]
                description = lines or [description.strip()] if description.strip() else []
            else:
                description = [str(item).strip() for item in description if str(item).strip()]

        normalized_experiences.append(
            {
                "role": exp.get("role") or fallback_exp.get("role", ""),
                "company": exp.get("company") or fallback_exp.get("company", ""),
                "description": description,
                "style": style,
            }
        )

    response["experiences"] = normalized_experiences
    return response

@app.get("/")
def root():
    return {"message": "API rodando"}


@app.post("/improve/resume", response_model=ResumeResponse)
async def improve_resume(data: ResumeRequest):
    payload = data.model_dump() if hasattr(data, "model_dump") else data.dict()
    prompt = build_resume_prompt(payload)

    try:
        ai_response = await call_gemini(prompt)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

    if not ai_response.strip():
        raise HTTPException(
            status_code=502,
            detail="Resposta vazia da IA"
        )

    try:
        parsed = _parse_json_from_ai_response(ai_response)
        normalized = _normalize_resume_response(parsed, payload)
        return ResumeResponse.model_validate(normalized)

    except json.JSONDecodeError:
        print("Resposta invalida da IA:")
        print(ai_response)

        raise HTTPException(
            status_code=502,
            detail="Erro ao processar resposta da IA"
        )