import os
from dataclasses import dataclass


@dataclass(frozen=True)
class CorsSettings:
    allowed_origins: list[str]
    allowed_origin_regex: str | None


def get_cors_settings() -> CorsSettings:
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

    allowed_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", "").strip()

    # Fallback for Vercel previews when ALLOWED_ORIGINS is not explicitly configured.
    if not allowed_origin_regex and app_env == "production":
        allowed_origin_regex = r"^https://.*\.vercel\.app$"

    return CorsSettings(
        allowed_origins=allowed_origins,
        allowed_origin_regex=allowed_origin_regex or None,
    )
