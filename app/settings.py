import os
from dataclasses import dataclass


@dataclass(frozen=True)
class CorsSettings:
    allowed_origins: list[str]
    allowed_origin_regex: str | None


@dataclass(frozen=True)
class SecuritySettings:
    api_access_key: str | None
    rate_limit_requests: int
    rate_limit_window_seconds: int


def get_cors_settings() -> CorsSettings:
    app_env = os.getenv("APP_ENV", "development").strip().lower()
    configured_origins_env = os.getenv("ALLOWED_ORIGINS", "").strip()
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

    allowed_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", "").strip()

    if app_env == "production":
        if not configured_origins_env:
            raise RuntimeError("ALLOWED_ORIGINS deve ser configurado explicitamente em producao")

        if allowed_origin_regex:
            raise RuntimeError("ALLOWED_ORIGIN_REGEX nao e permitido em producao")

        if any("*" in origin for origin in allowed_origins):
            raise RuntimeError("Wildcard em ALLOWED_ORIGINS nao e permitido em producao")

    return CorsSettings(
        allowed_origins=allowed_origins,
        allowed_origin_regex=allowed_origin_regex or None,
    )


def _get_int_env(name: str, default: int) -> int:
    raw = os.getenv(name, str(default)).strip()

    try:
        value = int(raw)
    except ValueError:
        return default

    return value if value > 0 else default


def get_security_settings() -> SecuritySettings:
    return SecuritySettings(
        api_access_key=os.getenv("API_ACCESS_KEY", "").strip() or None,
        rate_limit_requests=_get_int_env("AI_RATE_LIMIT_REQUESTS", 30),
        rate_limit_window_seconds=_get_int_env("AI_RATE_LIMIT_WINDOW_SECONDS", 60),
    )
