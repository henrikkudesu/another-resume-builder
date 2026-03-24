import { useEffect, useRef, useState } from "react";
import "./App.css";

import PersonalForm from "./components/PersonalForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ExtrasForm from "./components/ExtrasForm";
import Preview from "./components/Preview";

import { improveResume } from "./api";

const STORAGE_KEY = "resume_studio_data_v1";

const EMPTY_RESUME = {
  personal: {
    name: "",
    city: "",
    country: "",
    phone: "",
    links: ""
  },
  experiences: [
    { role: "", company: "", city: "", period: "", description: "", style: "bullet" }
  ],
  education: [
    { school: "", course: "", city: "", period: "", description: "" }
  ],
  extras: {
    skills: "",
    certifications: "",
    interests: ""
  },
  summary: ""
};

const JOHN_DOE_RESUME = {
  personal: {
    name: "John Doe",
    city: "Sao Paulo",
    country: "Brasil",
    phone: "+55 11 99999-9999",
    links: "linkedin.com/in/johndoe | github.com/johndoe"
  },
  summary: "Desenvolvedor de software com experiencia em aplicacoes web, APIs e melhoria continua de produtos digitais.",
  experiences: [
    {
      role: "Desenvolvedor Full Stack",
      company: "Acme Tech",
      city: "Sao Paulo",
      period: "2022 - Atual",
      description: "Desenvolvimento de funcionalidades em React e FastAPI, com foco em performance e experiencia do usuario.",
      style: "bullet"
    },
    {
      role: "Analista de Sistemas",
      company: "Nova Systems",
      city: "Sao Paulo",
      period: "2020 - 2022",
      description: "Levantamento de requisitos, criacao de documentacao tecnica e suporte a integracoes entre sistemas.",
      style: "bullet"
    }
  ],
  education: [
    {
      school: "Universidade Exemplo",
      course: "Bacharelado em Ciencia da Computacao",
      city: "Sao Paulo",
      period: "2018 - 2022",
      description: "Formacao com enfase em engenharia de software e arquitetura de sistemas."
    }
  ],
  extras: {
    skills: "React, FastAPI, Python, JavaScript, PostgreSQL",
    certifications: "AWS Cloud Practitioner",
    interests: "Produtos digitais, UX, automacao"
  }
};

function isValidResume(value) {
  return Boolean(
    value
    && value.personal
    && Array.isArray(value.experiences)
    && Array.isArray(value.education)
    && value.extras
  );
}

function getInitialResume() {
  function normalizeResumeShape(rawResume) {
    return {
      ...rawResume,
      summary: rawResume?.summary || "",
      experiences: Array.isArray(rawResume?.experiences) && rawResume.experiences.length
        ? rawResume.experiences.map((exp) => ({
          role: exp?.role || "",
          company: exp?.company || "",
          city: exp?.city || "",
          period: exp?.period || "",
          description: exp?.description || "",
          style: exp?.style === "paragraph" ? "paragraph" : "bullet"
        }))
        : JSON.parse(JSON.stringify(EMPTY_RESUME.experiences)),
      education: Array.isArray(rawResume?.education) && rawResume.education.length
        ? rawResume.education.map((edu) => ({
          school: edu?.school || "",
          course: edu?.course || "",
          city: edu?.city || "",
          period: edu?.period || "",
          description: edu?.description || ""
        }))
        : JSON.parse(JSON.stringify(EMPTY_RESUME.education))
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeResumeShape(JOHN_DOE_RESUME);

    const parsed = JSON.parse(raw);
    return isValidResume(parsed) ? normalizeResumeShape(parsed) : normalizeResumeShape(JOHN_DOE_RESUME);
  } catch {
    return normalizeResumeShape(JOHN_DOE_RESUME);
  }
}

function normalizeExperienceDescription(exp) {
  const raw = exp?.description;

  const bullets = Array.isArray(raw)
    ? raw.map((item) => String(item).trim()).filter(Boolean)
    : String(raw || "")
      .split("\n")
      .map((item) => item.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);

  const paragraph = Array.isArray(raw)
    ? raw.join(" ").replace(/\s+/g, " ").trim()
    : String(raw || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

  return { bullets, paragraph };
}

function App() {
  const [resume, setResume] = useState(getInitialResume);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [saveState, setSaveState] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState(() => new Date());
  const [undoResetVisible, setUndoResetVisible] = useState(false);
  const toastTimerRef = useRef(null);
  const resetUndoTimerRef = useRef(null);
  const lastResumeSnapshotRef = useRef(null);

  useEffect(() => {
    setSaveState("saving");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));

    const timer = setTimeout(() => {
      setSaveState("saved");
      setLastSavedAt(new Date());
    }, 250);

    return () => clearTimeout(timer);
  }, [resume]);

  useEffect(() => () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    if (resetUndoTimerRef.current) {
      clearTimeout(resetUndoTimerRef.current);
    }
  }, []);

  function clearResetUndoTimer() {
    if (resetUndoTimerRef.current) {
      clearTimeout(resetUndoTimerRef.current);
      resetUndoTimerRef.current = null;
    }
  }

  function showToast(message, type = "info") {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ message, type });

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  }

  async function handleImprove() {
    setLoading(true);

    try {
      const data = await improveResume(resume);

      if (isValidResume(data)) {
        setResume(data);
        showToast("Curriculo aprimorado com sucesso.", "success");
      } else {
        throw new Error("Resposta inválida da API");
      }
    } catch (err) {
      console.error(err);
      showToast(`Erro ao melhorar curriculo: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    setSaveState("saved");
    setLastSavedAt(new Date());
    showToast("Curriculo salvo localmente.", "success");
  }

  function handleReset() {
    if (!window.confirm("Deseja resetar todos os campos?")) {
      return;
    }

    lastResumeSnapshotRef.current = resume;
    setResume(JSON.parse(JSON.stringify(EMPTY_RESUME)));
    localStorage.removeItem(STORAGE_KEY);
    setUndoResetVisible(true);
    clearResetUndoTimer();
    resetUndoTimerRef.current = setTimeout(() => {
      setUndoResetVisible(false);
      lastResumeSnapshotRef.current = null;
    }, 12000);
    showToast("Campos resetados. Clique em Desfazer para restaurar.", "info");
  }

  function handleUndoReset() {
    if (!lastResumeSnapshotRef.current) {
      return;
    }

    setResume(lastResumeSnapshotRef.current);
    lastResumeSnapshotRef.current = null;
    setUndoResetVisible(false);
    clearResetUndoTimer();
    showToast("Versao anterior restaurada.", "success");
  }

  function getSaveStatusText() {
    if (saveState === "saving") {
      return "Salvando...";
    }

    return `Salvo localmente as ${lastSavedAt.toLocaleTimeString()}`;
  }

  function handleExportMarkdown() {
    try {
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

      const a = document.createElement("a");
      a.href = url;
      a.download = `${(resume.personal.name || "curriculo").replace(/\s+/g, "-").toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("Markdown exportado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao exportar Markdown: ${err.message}`, "error");
    }
  }

  async function handleExportPdf() {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      showToast("Gerando PDF com texto selecionavel...", "info");

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
          ? measureParagraph(paragraph || "Descricao nao preenchida.", 10.5, 2)
          : safeLines.reduce((acc, item) => acc + measureParagraph(`- ${item}`, 10.5, 2), 0);
        const blockHeight = titleHeight + subtitleHeight + contentHeight + 8;

        ensureSpace(blockHeight);
        drawParagraph(title, { font: "bold", family: "times", fontSize: 11, color: [20, 20, 20], extraBottom: 2 });

        if (subtitle) {
          drawParagraph(subtitle, { family: "times", fontSize: 10, color: [80, 80, 80], extraBottom: 4 });
        }

        if (mode === "paragraph") {
          drawParagraph(paragraph || "Descricao nao preenchida.", {
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

      drawParagraph(resume.personal.name || "Curriculo", {
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
      drawParagraph(resume.summary || "Resumo ainda nao preenchido.", {
        family: "times",
        fontSize: 10.5,
        color: [30, 30, 30],
        extraBottom: 12
      });

      drawSectionTitle("Experiencia");
      resume.experiences.forEach((exp) => {
        const { bullets, paragraph } = normalizeExperienceDescription(exp);
        const mode = exp.style === "paragraph" ? "paragraph" : "bullet";
        const subtitle = [exp.period, exp.city].filter(Boolean).join(" | ");

        drawBlock(
          `${exp.role || "Cargo"} - ${exp.company || "Empresa"}`,
          subtitle || null,
          {
            mode,
            bullets: bullets.length ? bullets : ["Descricao nao preenchida."],
            paragraph
          }
        );
      });

      drawSectionTitle("Educacao");
      resume.education.forEach((edu) => {
        const details = [edu.period, edu.city, edu.description].filter(Boolean);
        drawBlock(
          `${edu.course || "Curso"} - ${edu.school || "Instituicao"}`,
          details.length ? details.join(" | ") : null,
          {
            mode: "paragraph",
            paragraph: ""
          }
        );
      });

      drawSectionTitle("Extras");
      drawParagraph(`Habilidades: ${resume.extras.skills || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 3 });
      drawParagraph(`Certificacoes: ${resume.extras.certifications || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 3 });
      drawParagraph(`Interesses: ${resume.extras.interests || "-"}`, { family: "times", fontSize: 10.5, extraBottom: 6 });

      const filename = `${(resume.personal.name || "curriculo").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      doc.save(filename);
      showToast("PDF exportado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao exportar PDF: ${err.message}`, "error");
    }
  }

  return (
    <div className="app-shell">
      <header className="app-hero">
        <div>
          <p className="eyebrow">Montador de Curriculo</p>
          <h1>Apenas mais um criador de curriculo</h1>
          <p className="hero-copy">
            Preencha os dados, revise no preview e use IA no momento final para transformar rascunho
            em curriculo apresentavel, sem drama e sem floreio. Minimalista, do jeito que o ATS gosta.
          </p>
          <p className="save-status">{getSaveStatusText()}</p>
        </div>
      </header>

      <main className="app-grid">
        <section className="editor-panel">
          <PersonalForm data={resume.personal} setResume={setResume} />

          <ExperienceForm
            experiences={resume.experiences}
            setResume={setResume}
          />

          <EducationForm
            education={resume.education}
            setResume={setResume}
          />

          <ExtrasForm extras={resume.extras} setResume={setResume} />
        </section>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <h2>Preview</h2>
            <div className="toolbar-actions">
              <button className="secondary-btn" onClick={handleSave}>Salvar</button>
              <button className="secondary-btn" onClick={handleExportPdf}>Exportar PDF</button>
              <button className="secondary-btn" onClick={handleExportMarkdown}>Exportar Markdown</button>
              <button className="secondary-btn danger-btn" onClick={handleReset}>Resetar</button>
              {undoResetVisible && (
                <button className="secondary-btn" onClick={handleUndoReset}>Desfazer reset</button>
              )}
              <button className="primary-btn" onClick={handleImprove} disabled={loading}>
                {loading ? "Gerando..." : "Aprimorar com IA"}
              </button>
            </div>
          </div>

          <Preview data={resume} />
        </section>
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;