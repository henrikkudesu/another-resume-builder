import { normalizeExperienceDescription } from "../domain/resumeNormalization";

export function exportResumeAsMarkdown(resume) {
    const contact = [resume.personal.city, resume.personal.country, resume.personal.phone, resume.personal.links]
        .filter(Boolean)
        .join(" | ");

    const lines = [];

    lines.push(`# ${resume.personal.name || "Curriculo"}`);
    lines.push("");

    if (contact) {
        lines.push(contact);
        lines.push("");
    }

    lines.push("## Resumo");
    lines.push("");
    lines.push(resume.summary || "Resumo ainda nao preenchido.");
    lines.push("");

    lines.push("## Experiencia");
    lines.push("");

    resume.experiences.forEach((exp) => {
        lines.push(`### ${exp.role || "Cargo"} - ${exp.company || "Empresa"}`);

        const expMeta = [exp.period, exp.city].filter(Boolean).join(" | ");
        if (expMeta) {
            lines.push(expMeta);
        }

        const { bullets, paragraph } = normalizeExperienceDescription(exp);
        const mode = exp.style === "paragraph" ? "paragraph" : "bullet";

        if (mode === "paragraph") {
            lines.push(paragraph || "Descricao nao preenchida.");
        } else {
            const safeBullets = bullets.length ? bullets : ["Descricao nao preenchida."];
            safeBullets.forEach((item) => lines.push(`- ${item}`));
        }

        lines.push("");
    });

    lines.push("## Educacao");
    lines.push("");

    resume.education.forEach((edu) => {
        lines.push(`### ${edu.course || "Curso"} - ${edu.school || "Instituicao"}`);

        const details = [edu.period, edu.city, edu.description].filter(Boolean);
        lines.push(details.length ? details.join(" | ") : "Informacoes nao preenchidas.");
        lines.push("");
    });

    lines.push("## Extras");
    lines.push("");
    lines.push(`- Habilidades: ${resume.extras.skills || "-"}`);
    lines.push(`- Certificacoes: ${resume.extras.certifications || "-"}`);
    lines.push(`- Interesses: ${resume.extras.interests || "-"}`);

    const markdown = lines.join("\n");
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const filename = `${(resume.personal.name || "curriculo").replace(/\s+/g, "-").toLowerCase()}.md`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
}
