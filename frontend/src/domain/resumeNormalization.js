function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

export function isValidResume(value) {
    return Boolean(
        value
        && value.personal
        && Array.isArray(value.experiences)
        && Array.isArray(value.education)
        && value.extras
    );
}

export function normalizeResumeShape(rawResume, emptyResume) {
    return {
        ...rawResume,
        summary: rawResume?.summary || "",
        experiences: Array.isArray(rawResume?.experiences) && rawResume.experiences.length
            ? rawResume.experiences.map((exp) => ({
                role: exp?.role || "",
                company: exp?.company || "",
                city: exp?.city || "",
                period: exp?.period || "",
                description: exp?.description || "",
                style: exp?.style === "paragraph" ? "paragraph" : "bullet"
            }))
            : clone(emptyResume.experiences),
        education: Array.isArray(rawResume?.education) && rawResume.education.length
            ? rawResume.education.map((edu) => ({
                school: edu?.school || "",
                course: edu?.course || "",
                city: edu?.city || "",
                period: edu?.period || "",
                description: edu?.description || ""
            }))
            : clone(emptyResume.education)
    };
}

export function getInitialResume(storageKey, fallbackResume, emptyResume) {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return normalizeResumeShape(fallbackResume, emptyResume);

        const parsed = JSON.parse(raw);
        return isValidResume(parsed)
            ? normalizeResumeShape(parsed, emptyResume)
            : normalizeResumeShape(fallbackResume, emptyResume);
    } catch {
        return normalizeResumeShape(fallbackResume, emptyResume);
    }
}

export function normalizeExperienceDescription(exp) {
    const raw = exp?.description;

    const bullets = Array.isArray(raw)
        ? raw.map((item) => String(item).trim()).filter(Boolean)
        : String(raw || "")
            .split("\n")
            .map((item) => item.replace(/^[-*]\s*/, "").trim())
            .filter(Boolean);

    const paragraph = Array.isArray(raw)
        ? raw.join(" ").replace(/\s+/g, " ").trim()
        : String(raw || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

    return { bullets, paragraph };
}
