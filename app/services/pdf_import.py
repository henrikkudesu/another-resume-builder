from io import BytesIO

from pypdf import PdfReader


def extract_text_from_pdf_bytes(data: bytes, max_chars: int = 20000) -> str:
    if not data:
        return ""

    reader = PdfReader(BytesIO(data))
    pages = []

    for page in reader.pages:
        text = (page.extract_text() or "").strip()
        if text:
            pages.append(text)

    raw_text = "\n\n".join(pages).strip()
    if not raw_text:
        return ""

    cleaned = _normalize_whitespace(raw_text)
    if max_chars and len(cleaned) > max_chars:
        cleaned = cleaned[:max_chars]

    return cleaned


def _normalize_whitespace(text: str) -> str:
    lines = [line.strip() for line in text.splitlines()]
    cleaned_lines = []

    for line in lines:
        if line:
            cleaned_lines.append(line)
        elif cleaned_lines and cleaned_lines[-1] != "":
            cleaned_lines.append("")

    return "\n".join(cleaned_lines).strip()
