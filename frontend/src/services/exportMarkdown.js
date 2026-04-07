import { normalizeExperienceDescription } from "../domain/resumeNormalization";
import { getExportLabels } from "../domain/resumeLabels";

export function exportResumeAsMarkdown(resume, language = "pt-br") {
    const labels = getExportLabels(language);
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
