from collections import deque
from threading import Lock

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import hashlib
import time

from app.ai import call_gemini
from app.prompts import build_resume_prompt, build_translate_prompt
from app.schemas import ResumeRequest, ResumeResponse, TranslateResumeRequest
from app.settings import get_cors_settings, get_security_settings
from app.services.resume_response import parse_json_from_ai_response, normalize_resume_response

app = FastAPI()

TRANSLATION_CACHE: dict[str, dict] = {}
TRANSLATION_CACHE_TTL_SECONDS = 60 * 60 * 6
TRANSLATION_CACHE_MAX_ENTRIES = 500
RATE_LIMIT_BUCKETS: dict[str, deque[float]] = {}
RATE_LIMIT_LOCK = Lock()

cors_settings = get_cors_settings()
security_settings = get_security_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_settings.allowed_origins,
    allow_origin_regex=cors_settings.allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _enforce_rate_limit(client_key: str):
    now = time.time()
    window_start = now - security_settings.rate_limit_window_seconds

    with RATE_LIMIT_LOCK:
        bucket = RATE_LIMIT_BUCKETS.get(client_key)
        if bucket is None:
            bucket = deque()
            RATE_LIMIT_BUCKETS[client_key] = bucket

        while bucket and bucket[0] < window_start:
            bucket.popleft()

        if len(bucket) >= security_settings.rate_limit_requests:
            raise HTTPException(status_code=429, detail="Muitas requisicoes. Tente novamente em instantes.")

        bucket.append(now)


def _get_cached_translation(cache_key: str):
    cached = TRANSLATION_CACHE.get(cache_key)
    if not cached:
        return None

    expires_at = float(cached.get("expires_at", 0))
    if expires_at <= time.time():
        TRANSLATION_CACHE.pop(cache_key, None)
        return None

    return cached.get("payload")


def _set_cached_translation(cache_key: str, payload: dict):
    if len(TRANSLATION_CACHE) >= TRANSLATION_CACHE_MAX_ENTRIES:
        oldest_key = min(
            TRANSLATION_CACHE,
            key=lambda key: float(TRANSLATION_CACHE[key].get("created_at", 0))
        )
        TRANSLATION_CACHE.pop(oldest_key, None)

    now = time.time()
    TRANSLATION_CACHE[cache_key] = {
        "payload": payload,
        "created_at": now,
        "expires_at": now + TRANSLATION_CACHE_TTL_SECONDS,
    }


def _require_api_auth_and_rate_limit(request: Request, x_api_key: str | None = Header(default=None)):
    client_ip = request.client.host if request.client else "unknown"
    _enforce_rate_limit(client_ip)

    if security_settings.api_access_key and x_api_key != security_settings.api_access_key:
        raise HTTPException(status_code=401, detail="Nao autorizado.")

@app.get("/")
def root():
    return {"message": "API rodando"}


@app.post("/improve/resume", response_model=ResumeResponse)
async def improve_resume(data: ResumeRequest, _security=Depends(_require_api_auth_and_rate_limit)):
    payload = data.model_dump() if hasattr(data, "model_dump") else data.dict()
    prompt = build_resume_prompt(payload)

    try:
        ai_response = await call_gemini(prompt)
    except RuntimeError as e:
        print(f"Erro interno improve_resume: {e}")
        raise HTTPException(status_code=502, detail="Falha ao acionar servico de IA.") from e

    if not ai_response.strip():
        raise HTTPException(
            status_code=502,
            detail="Falha ao processar resposta da IA."
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
            detail="Falha ao processar resposta da IA."
        )


def _build_translation_cache_key(payload: dict, source_language: str, target_language: str) -> str:
    raw = json.dumps(
        {
            "payload": payload,
            "source_language": source_language,
            "target_language": target_language,
        },
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


@app.post("/translate/resume", response_model=ResumeResponse)
async def translate_resume(data: TranslateResumeRequest, _security=Depends(_require_api_auth_and_rate_limit)):
    model_data = data.model_dump() if hasattr(data, "model_dump") else data.dict()
    source_language = model_data.get("source_language", "pt-br")
    target_language = model_data.get("target_language")

    payload = {
        "personal": model_data.get("personal", {}),
        "summary": model_data.get("summary", ""),
        "experiences": model_data.get("experiences", []),
        "education": model_data.get("education", []),
        "extras": model_data.get("extras", {}),
    }

    cache_key = _build_translation_cache_key(payload, source_language, target_language)
    cached_payload = _get_cached_translation(cache_key)
    if cached_payload:
        return ResumeResponse.model_validate(cached_payload)

    prompt = build_translate_prompt(payload, target_language=target_language, source_language=source_language)

    try:
        ai_response = await call_gemini(prompt)
    except RuntimeError as e:
        print(f"Erro interno translate_resume: {e}")
        raise HTTPException(status_code=502, detail="Falha ao acionar servico de IA.") from e

    if not ai_response.strip():
        raise HTTPException(
            status_code=502,
            detail="Falha ao processar resposta da IA."
        )

    try:
        parsed = parse_json_from_ai_response(ai_response)
        normalized = normalize_resume_response(parsed, payload)
        response = ResumeResponse.model_validate(normalized)
        response_payload = response.model_dump() if hasattr(response, "model_dump") else response.dict()
        _set_cached_translation(cache_key, response_payload)
        return response

    except json.JSONDecodeError:
        print("Resposta invalida da IA:")
        print(ai_response)

        raise HTTPException(
            status_code=502,
            detail="Falha ao processar resposta da IA."
        )