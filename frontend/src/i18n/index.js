import { enUs } from "./locales/en-us";
import { es } from "./locales/es";
import { ptBr } from "./locales/pt-br";

const LOCALES = {
    "pt-br": ptBr,
    "en-us": enUs,
    es,
};

export const LANGUAGE_OPTIONS = Object.values(LOCALES).map(({ code, label }) => ({
    value: code,
    label,
}));

export const LANGUAGE_BADGE_LABELS = Object.fromEntries(
    Object.values(LOCALES).map(({ code, badge }) => [code, badge])
);

export function getLocale(language = "pt-br") {
    return LOCALES[language] || LOCALES["pt-br"];
}

export function getLanguageLabel(language = "pt-br") {
    return getLocale(language).label;
}
