import { normalizeExperienceDescription } from "../domain/resumeNormalization";

export async function exportResumeAsPdf(resume) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginLeft = 44;
    const marginRight = 44;
    const marginTop = 44;
    const marginBottom = 40;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const pageBottom = pageHeight - marginBottom;

    let y = marginTop;

    function addPage() {
        doc.addPage();
        y = marginTop;
    }

    function ensureSpace(requiredHeight) {
        if (y + requiredHeight > pageBottom) {
            addPage();
        }
    }

    function drawSectionTitle(title) {
        ensureSpace(30);

        if (y > marginTop + 8) {
            doc.setDrawColor(185, 185, 185);
            doc.setLineWidth(0.7);
            doc.line(marginLeft, y, pageWidth - marginRight, y);
            y += 12;
        }

        doc.setTextColor(28, 28, 28);
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), marginLeft, y);
        y += 14;
    }

    function measureParagraph(text, fontSize = 10.5, extraBottom = 6) {
        if (!text) return 0;
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 1.35;
        return lines.length * lineHeight + extraBottom;
    }

    function drawParagraph(text, options = {}) {
        if (!text) return;

        const {
            font = "normal",
            family = "times",
            fontSize = 10.5,
            color = [30, 30, 30],
            indent = 0,
            extraBottom = 6
        } = options;

        const paragraphHeight = measureParagraph(text, fontSize, extraBottom);
        ensureSpace(paragraphHeight);

        doc.setTextColor(...color);
        doc.setFont(family, font);
        doc.setFontSize(fontSize);

        const lines = doc.splitTextToSize(text, contentWidth - indent);
        const lineHeight = fontSize * 1.35;

        lines.forEach((line) => {
            doc.text(line, marginLeft + indent, y);
            y += lineHeight;
        });

        y += extraBottom;
    }

    function drawBlock(title, subtitle, content = {}) {
        const mode = content.mode || "bullet";
        const safeLines = (content.bullets || []).filter(Boolean);
        const paragraph = content.paragraph || "";

        const titleHeight = measureParagraph(title, 11, 2);
        const subtitleHeight = subtitle ? measureParagraph(subtitle, 10, 4) : 0;
        const contentHeight = mode === "paragraph"
            ? measureParagraph(paragraph || "Descrição não preenchida.", 10.5, 2)
            : safeLines.reduce((acc, item) => acc + measureParagraph(`- ${item}`, 10.5, 2), 0);
        const blockHeight = titleHeight + subtitleHeight + contentHeight + 8;

        ensureSpace(blockHeight);
        drawParagraph(title, { font: "bold", family: "times", fontSize: 11, color: [20, 20, 20], extraBottom: 2 });

        if (subtitle) {
            drawParagraph(subtitle, { family: "times", fontSize: 10, color: [80, 80, 80], extraBottom: 4 });
        }

        if (mode === "paragraph") {
            drawParagraph(paragraph || "Descrição não preenchida.", {
                fontSize: 10.5,
                color: [30, 30, 30],
                extraBottom: 2
            });
        } else {
            safeLines.forEach((item) => {
                drawParagraph(`- ${item}`, { family: "times", fontSize: 10.5, color: [30, 30, 30], extraBottom: 2 });
            });
        }

        y += 6;
    }

    drawParagraph(resume.personal.name || "Currículo", {
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

    drawSectionTitle("Resumo");
    drawParagraph(resume.summary || "Resumo ainda não preenchido.", {
        family: "times",
        fontSize: 10.5,
        color: [30, 30, 30],
        extraBottom: 12
    });

    drawSectionTitle("Experiência");
    resume.experiences.forEach((exp) => {
        const { bullets, paragraph } = normalizeExperienceDescription(exp);
        const mode = exp.style === "paragraph" ? "paragraph" : "bullet";
        const subtitle = [exp.period, exp.city].filter(Boolean).join(" | ");

        drawBlock(
            `${exp.role || "Cargo"} - ${exp.company || "Empresa"}`,
            subtitle || null,
            {
                mode,
                bullets: bullets.length ? bullets : ["Descrição não preenchida."],
                paragraph
            }
        );
    });

    drawSectionTitle("Educação");
    resume.education.forEach((edu) => {
        const details = [edu.period, edu.city].filter(Boolean);
        drawBlock(
            `${edu.course || "Curso"} - ${edu.school || "Instituição"}`,
            details.length ? details.join(" | ") : null,
            {
                mode: "paragraph",
                paragraph: edu.description || ""
            }
        );
    });

    drawSectionTitle("Extras");
    drawParagraph(`Habilidades: ${resume.extras.skills || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 3 });
    drawParagraph(`Certificações: ${resume.extras.certifications || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 3 });
    drawParagraph(`Interesses: ${resume.extras.interests || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 6 });

    const filename = `${(resume.personal.name || "curriculo").replace(/\s+/g, "-").toLowerCase()}.pdf`;
    doc.save(filename);
    return filename;
}
