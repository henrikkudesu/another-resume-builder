import { normalizeExperienceDescription } from "../domain/resumeNormalization";

const EXPORT_LABELS = {
    "pt-br": {
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
        filenameFallback: "curriculo"
    },
    "en-us": {
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
        filenameFallback: "resume"
    },
    "es": {
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
        filenameFallback: "curriculum"
    }
};

export function exportResumeAsMarkdown(resume, language = "pt-br") {
    const labels = EXPORT_LABELS[language] || EXPORT_LABELS["pt-br"];
    const contact = [resume.personal.city, resume.personal.country, resume.personal.phone, resume.personal.links]
        .filter(Boolean)
        .join(" | ");

    const lines = [];

    lines.push(`# ${resume.personal.name || labels.fallbackTitle}`);
    lines.push("");

    if (contact) {
        lines.push(contact);
        lines.push("");
    }

    lines.push(`## ${labels.summary}`);
    lines.push("");
    lines.push(resume.summary || labels.summaryFallback);
    lines.push("");

    lines.push(`## ${labels.experience}`);
    lines.push("");

    resume.experiences.forEach((exp) => {
        lines.push(`### ${exp.role || labels.roleFallback} - ${exp.company || labels.companyFallback}`);

        const expMeta = [exp.period, exp.city].filter(Boolean).join(" | ");
        if (expMeta) {
            lines.push(expMeta);
        }

        const { bullets, paragraph } = normalizeExperienceDescription(exp);
        const mode = exp.style === "paragraph" ? "paragraph" : "bullet";

        if (mode === "paragraph") {
            lines.push(paragraph || labels.experienceFallback);
        } else {
            const safeBullets = bullets.length ? bullets : [labels.experienceFallback];
            safeBullets.forEach((item) => lines.push(`- ${item}`));
        }

        lines.push("");
    });

    lines.push(`## ${labels.education}`);
    lines.push("");

    resume.education.forEach((edu) => {
        lines.push(`### ${edu.course || labels.courseFallback} - ${edu.school || labels.schoolFallback}`);

        const details = [edu.period, edu.city, edu.description].filter(Boolean);
        lines.push(details.length ? details.join(" | ") : labels.educationFallback);
        lines.push("");
    });

    lines.push(`## ${labels.extras}`);
    lines.push("");
    lines.push(`- ${labels.skills}: ${resume.extras.skills || "-"}`);
    lines.push(`- ${labels.certifications}: ${resume.extras.certifications || "-"}`);
    lines.push(`- ${labels.interests}: ${resume.extras.interests || "-"}`);

    const markdown = lines.join("\n");
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const filename = `${(resume.personal.name || labels.filenameFallback).replace(/\s+/g, "-").toLowerCase()}.md`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
}
