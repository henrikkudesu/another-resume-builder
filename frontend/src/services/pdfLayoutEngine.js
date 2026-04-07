export function createPdfLayoutEngine(doc) {
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

    function measureParagraph(text, fontSize = 10.5, extraBottom = 6, indent = 0) {
        if (!text) return 0;
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, contentWidth - indent);
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
            extraBottom = 6,
        } = options;

        const paragraphHeight = measureParagraph(text, fontSize, extraBottom, indent);
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

    function drawBlock(title, subtitle, content = {}) {
        const mode = content.mode || "bullet";
        const safeLines = (content.bullets || []).filter(Boolean);
        const paragraph = content.paragraph || "";
        const paragraphFallback = content.paragraphFallback || "-";

        const titleHeight = measureParagraph(title, 11, 2);
        const subtitleHeight = subtitle ? measureParagraph(subtitle, 10, 4) : 0;
        const contentHeight = mode === "paragraph"
            ? measureParagraph(paragraph || paragraphFallback, 10.5, 2)
            : safeLines.reduce((acc, item) => acc + measureParagraph(`- ${item}`, 10.5, 2), 0);
        const blockHeight = titleHeight + subtitleHeight + contentHeight + 8;

        ensureSpace(blockHeight);
        drawParagraph(title, { font: "bold", family: "times", fontSize: 11, color: [20, 20, 20], extraBottom: 2 });

        if (subtitle) {
            drawParagraph(subtitle, { family: "times", fontSize: 10, color: [80, 80, 80], extraBottom: 4 });
        }

        if (mode === "paragraph") {
            drawParagraph(paragraph || paragraphFallback, {
                fontSize: 10.5,
                color: [30, 30, 30],
                extraBottom: 2,
            });
        } else {
            safeLines.forEach((item) => {
                drawParagraph(`- ${item}`, { family: "times", fontSize: 10.5, color: [30, 30, 30], extraBottom: 2 });
            });
        }

        y += 6;
    }

    return {
        drawParagraph,
        drawSectionTitle,
        drawBlock,
    };
}
