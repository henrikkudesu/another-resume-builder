from google import genai
import os
from dotenv import load_dotenv

from app.services.logger import get_logger

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")
logger = get_logger(__name__)


def _get_client():
    if not API_KEY:
        logger.error("GEMINI_API_KEY nao configurada")
        raise RuntimeError("GEMINI_API_KEY nao configurada")

    try:
        return genai.Client(api_key=API_KEY)
    except Exception as e:
        logger.exception("Falha ao inicializar cliente Gemini")
        raise RuntimeError(f"Falha ao inicializar cliente Gemini: {e}") from e


async def call_gemini(prompt: str) -> str:
    client = _get_client()

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

        text = (response.text or "").strip()
        if not text:
            logger.warning("Gemini retornou resposta vazia")
            raise RuntimeError("Gemini retornou resposta vazia")

        return text
    except Exception as e:
        logger.exception("Erro Gemini")
        raise RuntimeError(f"Erro Gemini: {e}") from e