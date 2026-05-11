import { useEffect, useMemo, useState } from "react";

import { getLocale, getLanguageLabel } from "../i18n";
import { getResumeFingerprint } from "../domain/resumeFingerprint";
import { loadTranslationCache, persistTranslationCache } from "../domain/translationCache";

function formatRelativeMinutes(timestamp, nowMs, meta) {
    if (!timestamp) {
        return null;
    }

    const diffMinutes = Math.max(0, Math.floor((nowMs - Number(timestamp)) / 60000));

    if (diffMinutes < 1) {
        return meta.updatedNow;
    }

    if (diffMinutes === 1) {
        return meta.updatedMinute;
    }

    return meta.updatedMinutes.replace("{n}", String(diffMinutes));
}

export function usePreviewLanguage(resume) {
    const [previewLanguage, setPreviewLanguage] = useState("pt-br");
    const [nowMs, setNowMs] = useState(() => Date.now());
    const [translationsByLanguage, setTranslationsByLanguage] = useState(loadTranslationCache);

    const resumeFingerprint = useMemo(() => getResumeFingerprint(resume), [resume]);
    const selectedTranslation = translationsByLanguage[previewLanguage] || null;
    const hasTranslation = previewLanguage !== "pt-br" && Boolean(selectedTranslation?.resume);
    const isTranslationStale = hasTranslation
        ? selectedTranslation.fingerprint !== resumeFingerprint
        : false;

    const previewData = useMemo(() => {
        if (previewLanguage === "pt-br") {
            return resume;
        }

        if (selectedTranslation?.resume) {
            return selectedTranslation.resume;
        }

        return resume;
    }, [previewLanguage, resume, selectedTranslation]);

    const previewLanguageLabel = useMemo(
        () => getLanguageLabel(previewLanguage),
        [previewLanguage]
    );

    const translationUpdatedText = useMemo(() => {
        const baseMeta = getLocale("pt-br").meta;
        const localeMeta = getLocale(previewLanguage).meta;

        if (previewLanguage === "pt-br") {
            return baseMeta.original;
        }

        return formatRelativeMinutes(selectedTranslation?.generatedAt, nowMs, localeMeta) || localeMeta.notGenerated;
    }, [nowMs, previewLanguage, selectedTranslation]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNowMs(Date.now());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        persistTranslationCache(translationsByLanguage);
    }, [translationsByLanguage]);

    function storeTranslation(language, translatedResume) {
        setTranslationsByLanguage((previous) => ({
            ...previous,
            [language]: {
                resume: translatedResume,
                fingerprint: resumeFingerprint,
                generatedAt: Date.now(),
            },
        }));
    }

    return {
        previewLanguage,
        setPreviewLanguage,
        previewData,
        previewLanguageLabel,
        translationUpdatedText,
        resumeFingerprint,
        selectedTranslation,
        hasTranslation,
        isTranslationStale,
        storeTranslation,
    };
}
