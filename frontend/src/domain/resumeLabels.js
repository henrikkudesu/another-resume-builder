import {
    getLocale,
    getLanguageLabel,
    LANGUAGE_BADGE_LABELS,
    LANGUAGE_OPTIONS,
} from "../i18n";

export function getPreviewLabels(language = "pt-br") {
    return getLocale(language).preview;
}

export function getExportLabels(language = "pt-br") {
    return getLocale(language).export;
}

export { LANGUAGE_OPTIONS, LANGUAGE_BADGE_LABELS, getLanguageLabel };
