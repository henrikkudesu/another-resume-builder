import logging
import os

_LOGGER_CONFIGURED = False


def _configure_logging():
    global _LOGGER_CONFIGURED
    if _LOGGER_CONFIGURED:
        return

    level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    level = logging._nameToLevel.get(level_name, logging.INFO)

    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )
    _LOGGER_CONFIGURED = True


def get_logger(name: str | None = None) -> logging.Logger:
    _configure_logging()
    return logging.getLogger(name or "app")


def _ai_debug_enabled() -> bool:
    return os.getenv("LOG_AI_DEBUG", "").strip().lower() in {"1", "true", "yes", "on"}


def log_ai_parse_error(logger: logging.Logger, context: str, raw_response: str | None) -> None:
    if _ai_debug_enabled():
        logger.warning("AI response invalid (%s). response=%s", context, raw_response)
        return

    response_size = len(raw_response or "")
    logger.warning("AI response invalid (%s). response_size=%s", context, response_size)
