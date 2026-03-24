import json


def parse_json_from_ai_response(raw_text: str):
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


def normalize_resume_response(parsed: dict, fallback_payload: dict):
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
                "city": exp.get("city") or fallback_exp.get("city", ""),
                "period": exp.get("period") or fallback_exp.get("period", ""),
                "description": description,
                "style": style,
            }
        )

    response["experiences"] = normalized_experiences

    fallback_education = fallback_payload.get("education", [])
    normalized_education = []

    for index, edu in enumerate(response["education"]):
        if not isinstance(edu, dict):
            continue

        fallback_edu = fallback_education[index] if index < len(fallback_education) else {}
        normalized_education.append(
            {
                "school": edu.get("school") or fallback_edu.get("school", ""),
                "course": edu.get("course") or fallback_edu.get("course", ""),
                "city": edu.get("city") or fallback_edu.get("city", ""),
                "period": edu.get("period") or fallback_edu.get("period", ""),
                "description": edu.get("description") or fallback_edu.get("description", ""),
            }
        )

    response["education"] = normalized_education
    return response
