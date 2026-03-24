from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json

from app.ai import call_gemini
from app.prompts import build_resume_prompt
from app.schemas import ResumeRequest, ResumeResponse
from app.settings import get_cors_settings
from app.services.resume_response import parse_json_from_ai_response, normalize_resume_response

app = FastAPI()

cors_settings = get_cors_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_settings.allowed_origins,
    allow_origin_regex=cors_settings.allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        parsed = parse_json_from_ai_response(ai_response)
        normalized = normalize_resume_response(parsed, payload)
        return ResumeResponse.model_validate(normalized)

    except json.JSONDecodeError:
        print("Resposta invalida da IA:")
        print(ai_response)

        raise HTTPException(
            status_code=502,
            detail="Erro ao processar resposta da IA"
        )