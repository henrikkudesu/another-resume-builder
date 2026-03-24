import { useState } from "react";
import "./App.css";

import PersonalForm from "./components/PersonalForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ExtrasForm from "./components/ExtrasForm";
import Preview from "./components/Preview";

import { EMPTY_RESUME, STORAGE_KEY } from "./domain/resumeDefaults";
import { exportResumeAsMarkdown } from "./services/exportMarkdown";
import { exportResumeAsPdf } from "./services/exportPdf";
import { improveResumeWithValidation } from "./services/improveResumeFlow";
import { useResumeState } from "./hooks/useResumeState";
import { useResettableResume } from "./hooks/useResettableResume";
import { useToast } from "./hooks/useToast";

function App() {
  const { resume, setResume, markSaved, getSaveStatusText } = useResumeState();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { undoResetVisible, resetResume, undoReset } = useResettableResume({
    setResume,
    emptyResume: EMPTY_RESUME,
    storageKey: STORAGE_KEY,
  });

  async function handleImprove() {
    setLoading(true);

    try {
      const data = await improveResumeWithValidation(resume);
      setResume(data);
      showToast("Curriculo aprimorado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao melhorar curriculo: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    markSaved();
    showToast("Curriculo salvo localmente.", "success");
  }

  function handleReset() {
    if (!window.confirm("Deseja resetar todos os campos?")) {
      return;
    }

    resetResume(resume);
    showToast("Campos resetados. Clique em Desfazer para restaurar.", "info");
  }

  function handleUndoReset() {
    if (undoReset()) {
      showToast("Versao anterior restaurada.", "success");
    }
  }

  function handleExportMarkdown() {
    try {
      exportResumeAsMarkdown(resume);

      showToast("Markdown exportado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao exportar Markdown: ${err.message}`, "error");
    }
  }

  async function handleExportPdf() {
    try {
      showToast("Gerando PDF com texto selecionavel...", "info");
      await exportResumeAsPdf(resume);
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