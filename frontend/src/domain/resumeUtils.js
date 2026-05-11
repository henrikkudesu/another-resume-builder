export function isBlank(value) {
    return !String(value || "").trim();
}

export function isEmptyExperience(exp) {
    const description = Array.isArray(exp?.description)
        ? exp.description.join(" ")
        : String(exp?.description || "");

    return [exp?.role, exp?.company, exp?.city, exp?.period, description]
        .every(isBlank);
}

export function isEmptyEducation(edu) {
    return [edu?.school, edu?.course, edu?.city, edu?.period, edu?.description]
        .every(isBlank);
}

function shouldReplaceList(list, isEmptyItem) {
    if (!Array.isArray(list) || list.length === 0) {
        return true;
    }

    return list.every(isEmptyItem);
}

export function mergeResume(base, incoming) {
    return {
        personal: {
            name: base.personal.name || incoming.personal?.name || "",
            city: base.personal.city || incoming.personal?.city || "",
            country: base.personal.country || incoming.personal?.country || "",
            phone: base.personal.phone || incoming.personal?.phone || "",
            links: base.personal.links || incoming.personal?.links || "",
        },
        summary: base.summary || incoming.summary || "",
        experiences: shouldReplaceList(base.experiences, isEmptyExperience)
            ? incoming.experiences || []
            : base.experiences,
        education: shouldReplaceList(base.education, isEmptyEducation)
            ? incoming.education || []
            : base.education,
        extras: {
            skills: base.extras.skills || incoming.extras?.skills || "",
            certifications: base.extras.certifications || incoming.extras?.certifications || "",
            interests: base.extras.interests || incoming.extras?.interests || "",
        },
    };
}

export function isResumeEmpty(resume) {
    const personalEmpty = [
        resume.personal?.name,
        resume.personal?.city,
        resume.personal?.country,
        resume.personal?.phone,
        resume.personal?.links,
    ].every(isBlank);

    const summaryEmpty = isBlank(resume.summary);
    const extrasEmpty = [
        resume.extras?.skills,
        resume.extras?.certifications,
        resume.extras?.interests,
    ].every(isBlank);

    const experiencesEmpty = Array.isArray(resume.experiences)
        ? resume.experiences.every(isEmptyExperience)
        : true;

    const educationEmpty = Array.isArray(resume.education)
        ? resume.education.every(isEmptyEducation)
        : true;

    return personalEmpty && summaryEmpty && extrasEmpty && experiencesEmpty && educationEmpty;
}

export function truncateText(text, maxLength = 180) {
    const raw = String(text || "").trim();
    if (!raw) return "Nao informado";
    if (raw.length <= maxLength) return raw;
    return `${raw.slice(0, maxLength)}...`;
}
