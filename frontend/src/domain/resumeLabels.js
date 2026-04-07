export const LANGUAGE_OPTIONS = [
    { value: "pt-br", label: "Portugues (pt-br)" },
    { value: "en-us", label: "English (en-us)" },
    { value: "es", label: "Espanol (es)" },
];

export const LANGUAGE_BADGE_LABELS = {
    "pt-br": "PT-BR",
    "en-us": "EN-US",
    es: "ES",
};

const RESUME_LABELS = {
    "pt-br": {
        preview: {
            fallbackName: "Seu Nome",
            fallbackLocation: "Cidade - Pais",
            summary: "Resumo",
            experience: "Experiencia",
            education: "Educacao",
            extras: "Extras",
            missingDescription: "Descricao nao preenchida.",
            skills: "Habilidades",
            certifications: "Certificacoes",
            interests: "Interesses",
        },
        export: {
            fallbackTitle: "Curriculo",
            summary: "Resumo",
            summaryFallback: "Resumo ainda nao preenchido.",
            experience: "Experiencia",
            education: "Educacao",
            extras: "Extras",
            roleFallback: "Cargo",
            companyFallback: "Empresa",
            experienceFallback: "Descricao nao preenchida.",
            courseFallback: "Curso",
            schoolFallback: "Instituicao",
            educationFallback: "Informacoes nao preenchidas.",
            skills: "Habilidades",
            certifications: "Certificacoes",
            interests: "Interesses",
            filenameFallback: "curriculo",
        },
    },
    "en-us": {
        preview: {
            fallbackName: "Your Name",
            fallbackLocation: "City - Country",
            summary: "Summary",
            experience: "Experience",
            education: "Education",
            extras: "Extras",
            missingDescription: "Description not provided.",
            skills: "Skills",
            certifications: "Certifications",
            interests: "Interests",
        },
        export: {
            fallbackTitle: "Resume",
            summary: "Summary",
            summaryFallback: "Summary not provided yet.",
            experience: "Experience",
            education: "Education",
            extras: "Extras",
            roleFallback: "Role",
            companyFallback: "Company",
            experienceFallback: "Description not provided.",
            courseFallback: "Course",
            schoolFallback: "Institution",
            educationFallback: "Information not provided.",
            skills: "Skills",
            certifications: "Certifications",
            interests: "Interests",
            filenameFallback: "resume",
        },
    },
    es: {
        preview: {
            fallbackName: "Tu Nombre",
            fallbackLocation: "Ciudad - Pais",
            summary: "Resumen",
            experience: "Experiencia",
            education: "Educacion",
            extras: "Extras",
            missingDescription: "Descripcion no completada.",
            skills: "Habilidades",
            certifications: "Certificaciones",
            interests: "Intereses",
        },
        export: {
            fallbackTitle: "Curriculum",
            summary: "Resumen",
            summaryFallback: "Resumen aun no completado.",
            experience: "Experiencia",
            education: "Educacion",
            extras: "Extras",
            roleFallback: "Rol",
            companyFallback: "Empresa",
            experienceFallback: "Descripcion no completada.",
            courseFallback: "Curso",
            schoolFallback: "Institucion",
            educationFallback: "Informacion no completada.",
            skills: "Habilidades",
            certifications: "Certificaciones",
            interests: "Intereses",
            filenameFallback: "curriculum",
        },
    },
};

export function getPreviewLabels(language = "pt-br") {
    return RESUME_LABELS[language]?.preview || RESUME_LABELS["pt-br"].preview;
}

export function getExportLabels(language = "pt-br") {
    return RESUME_LABELS[language]?.export || RESUME_LABELS["pt-br"].export;
}

export function getLanguageLabel(language) {
    const option = LANGUAGE_OPTIONS.find((item) => item.value === language);
    return option?.label || language;
}
