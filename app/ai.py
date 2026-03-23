from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")


def _get_client():
    if not API_KEY:
        raise RuntimeError("GEMINI_API_KEY não configurada")

    try:
        return genai.Client(api_key=API_KEY)
    except Exception as e:
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
            raise RuntimeError("Gemini retornou resposta vazia")

        return text
    except Exception as e:
        raise RuntimeError(f"Erro Gemini: {e}") from e