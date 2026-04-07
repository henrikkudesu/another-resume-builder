import { LANGUAGE_OPTIONS } from "./resumeLabels";

export const TRANSLATION_CACHE_STORAGE_KEY = "resume_studio_translation_cache_v1";

function isValidTranslationEntry(entry) {
    return Boolean(
        entry
        && typeof entry === "object"
        && !Array.isArray(entry)
        && entry.resume
        && typeof entry.fingerprint === "string"
    );
}

export function loadTranslationCache() {
    try {
        const raw = localStorage.getItem(TRANSLATION_CACHE_STORAGE_KEY);
        if (!raw) {
            return {};
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return {};
        }

        const allowedLanguages = new Set(LANGUAGE_OPTIONS.map((option) => option.value));
        const normalized = {};

        Object.entries(parsed).forEach(([language, entry]) => {
            if (!allowedLanguages.has(language)) {
                return;
            }

            if (!isValidTranslationEntry(entry)) {
                return;
            }

            normalized[language] = {
                resume: entry.resume,
                fingerprint: entry.fingerprint,
                generatedAt: Number(entry.generatedAt || Date.now()),
            };
        });

        return normalized;
    } catch {
        return {};
    }
}

export function persistTranslationCache(cacheByLanguage) {
    try {
        localStorage.setItem(TRANSLATION_CACHE_STORAGE_KEY, JSON.stringify(cacheByLanguage));
    } catch {
        // Ignore storage errors (quota/privacy mode) and keep in-memory cache working.
    }
}
