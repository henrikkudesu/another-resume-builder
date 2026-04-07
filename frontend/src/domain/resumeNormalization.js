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

export function normalizeResumeShape(rawResume, emptyResume, fallbackResume = null) {
    const fallbackExperiences = Array.isArray(fallbackResume?.experiences) ? fallbackResume.experiences : [];
    const fallbackEducation = Array.isArray(fallbackResume?.education) ? fallbackResume.education : [];

    return {
        ...rawResume,
        summary: rawResume?.summary || "",
        experiences: Array.isArray(rawResume?.experiences) && rawResume.experiences.length
            ? rawResume.experiences.map((exp, index) => ({
                role: exp?.role || "",
                company: exp?.company || "",
                city: exp?.city || fallbackExperiences[index]?.city || "",
                period: exp?.period || fallbackExperiences[index]?.period || "",
                description: exp?.description || "",
                style: exp?.style === "bullet" ? "bullet" : "paragraph"
            }))
            : clone(emptyResume.experiences),
        education: Array.isArray(rawResume?.education) && rawResume.education.length
            ? rawResume.education.map((edu, index) => ({
                school: edu?.school || "",
                course: edu?.course || "",
                city: edu?.city || fallbackEducation[index]?.city || "",
                period: edu?.period || fallbackEducation[index]?.period || "",
                description: edu?.description || ""
            }))
            : clone(emptyResume.education)
    };
}

export function getInitialResume(storageKey, fallbackResume, emptyResume) {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return normalizeResumeShape(fallbackResume, emptyResume, fallbackResume);

        const parsed = JSON.parse(raw);
        return isValidResume(parsed)
            ? normalizeResumeShape(parsed, emptyResume, fallbackResume)
            : normalizeResumeShape(fallbackResume, emptyResume, fallbackResume);
    } catch {
        return normalizeResumeShape(fallbackResume, emptyResume, fallbackResume);
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
