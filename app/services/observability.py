import os

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

from app.services.logger import get_logger


logger = get_logger(__name__)


def _get_float_env(name: str, default: float) -> float:
    raw = os.getenv(name, str(default)).strip()
    try:
        return float(raw)
    except ValueError:
        return default


def init_observability() -> None:
    dsn = os.getenv("SENTRY_DSN", "").strip()
    if not dsn:
        return

    environment = os.getenv("APP_ENV", "development").strip().lower()
    traces_sample_rate = _get_float_env("SENTRY_TRACES_SAMPLE_RATE", 0.0)

    sentry_sdk.init(
        dsn=dsn,
        environment=environment,
        traces_sample_rate=traces_sample_rate,
        integrations=[FastApiIntegration()],
    )

    logger.info("Sentry initialized")
