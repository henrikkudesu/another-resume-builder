import { normalizeExperienceDescription } from "../domain/resumeNormalization";
import { getExportLabels } from "../domain/resumeLabels";
import { createPdfLayoutEngine } from "./pdfLayoutEngine";

export async function exportResumeAsPdf(resume, language = "pt-br") {
    const labels = getExportLabels(language);
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const { drawParagraph, drawSectionTitle, drawBlock } = createPdfLayoutEngine(doc);

    drawParagraph(resume.personal.name || labels.fallbackTitle, {
        font: "bold",
        family: "times",
        fontSize: 20,
        color: [10, 10, 10],
        extraBottom: 4
    });

    const contact = [resume.personal.city, resume.personal.country, resume.personal.phone, resume.personal.links]
        .filter(Boolean)
        .join(" | ");
    drawParagraph(contact, { family: "times", fontSize: 10, color: [80, 80, 80], extraBottom: 10 });

    drawSectionTitle(labels.summary);
    drawParagraph(resume.summary || labels.summaryFallback, {
        family: "times",
        fontSize: 10.5,
        color: [30, 30, 30],
        extraBottom: 12
    });

    drawSectionTitle(labels.experience);
    resume.experiences.forEach((exp) => {
        const { bullets, paragraph } = normalizeExperienceDescription(exp);
        const mode = exp.style === "paragraph" ? "paragraph" : "bullet";
        const subtitle = [exp.period, exp.city].filter(Boolean).join(" | ");

        drawBlock(
            `${exp.role || labels.roleFallback} - ${exp.company || labels.companyFallback}`,
            subtitle || null,
            {
                mode,
                bullets: bullets.length ? bullets : [labels.experienceFallback],
                paragraph,
                paragraphFallback: labels.experienceFallback,
            }
        );
    });

    drawSectionTitle(labels.education);
    resume.education.forEach((edu) => {
        const details = [edu.period, edu.city].filter(Boolean);
        drawBlock(
            `${edu.course || labels.courseFallback} - ${edu.school || labels.schoolFallback}`,
            details.length ? details.join(" | ") : null,
            {
                mode: "paragraph",
                paragraph: edu.description || "",
                paragraphFallback: "",
            }
        );
    });

    drawSectionTitle(labels.extras);
    drawParagraph(`${labels.skills}: ${resume.extras.skills || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 3 });
    drawParagraph(`${labels.certifications}: ${resume.extras.certifications || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 3 });
    drawParagraph(`${labels.interests}: ${resume.extras.interests || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 6 });

    const filename = `${(resume.personal.name || labels.filenameFallback).replace(/\s+/g, "-").toLowerCase()}.pdf`;
    doc.save(filename);
    return filename;
}
