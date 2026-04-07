import { useState } from "react";
import "./App.css";

import PersonalForm from "./components/PersonalForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ExtrasForm from "./components/ExtrasForm";
import Preview from "./components/Preview";
import PreviewToolbar from "./components/PreviewToolbar";
import AppFooter from "./components/AppFooter";

import { EMPTY_RESUME, STORAGE_KEY } from "./domain/resumeDefaults";
import { exportResumeAsMarkdown } from "./services/exportMarkdown";
import { exportResumeAsPdf } from "./services/exportPdf";
import {
  improveResumeWithValidation,
  translateResumeWithValidation,
} from "./services/improveResumeFlow";
import { useResumeState } from "./hooks/useResumeState";
import { useResettableResume } from "./hooks/useResettableResume";
import { useToast } from "./hooks/useToast";
import { usePreviewLanguage } from "./hooks/usePreviewLanguage";

function App() {
  const { resume, setResume, markSaved, getSaveStatusText } = useResumeState();
  const { toast, showToast } = useToast();
  const [loadingAction, setLoadingAction] = useState(null);
  const {
    previewLanguage,
    setPreviewLanguage,
    previewData,
    previewLanguageLabel,
    translationUpdatedText,
    resumeFingerprint,
    selectedTranslation,
    hasTranslation,
    isTranslationStale,
    storeTranslation,
  } = usePreviewLanguage(resume);
  const { undoResetVisible, resetResume, undoReset } = useResettableResume({
    setResume,
    emptyResume: EMPTY_RESUME,
    storageKey: STORAGE_KEY,
  });

  async function handleImprove() {
    setLoadingAction("improve");

    try {
      const data = await improveResumeWithValidation(resume);
      setResume(data);
      showToast("Curriculo aprimorado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao melhorar curriculo: ${err.message}`, "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleTranslateSelectedLanguage() {
    if (previewLanguage === "pt-br") {
      showToast("Selecione en-us ou es para traduzir.", "info");
      return;
    }

    if (selectedTranslation?.fingerprint === resumeFingerprint && selectedTranslation?.resume) {
      showToast("Reutilizando traducao ja gerada. Nenhuma nova chamada foi feita.", "info");
      return;
    }

    setLoadingAction("translate");

    try {
      const translated = await translateResumeWithValidation(resume, previewLanguage, "pt-br");
      storeTranslation(previewLanguage, translated);

      showToast(`Traducao para ${previewLanguage} pronta.`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao traduzir curriculo: ${err.message}`, "error");
    } finally {
      setLoadingAction(null);
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
      exportResumeAsMarkdown(previewData, previewLanguage);

      showToast("Markdown exportado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao exportar Markdown: ${err.message}`, "error");
    }
  }

  async function handleExportPdf() {
    try {
      showToast("Gerando PDF com texto selecionavel...", "info");
      await exportResumeAsPdf(previewData, previewLanguage);
      showToast("PDF exportado com sucesso.", "success");
    } catch (err) {
      console.error(err);
      showToast(`Erro ao exportar PDF: ${err.message}`, "error");
    }
  }

  return (
    <div className="app-shell">
      <header className="app-hero">
        <div className="hero-main">
          <h1>Apenas mais um gerador de currículo</h1>
          <p className="hero-copy">
            Escreva uma vez, refine com IA quando quiser e exporte em PDF ou Markdown com estrutura limpa
            para recrutadores e sistemas de triagem.
          </p>
        </div>

        <aside className="hero-meta" aria-label="Resumo da sessao">
          <p className="save-status">{getSaveStatusText()}</p>
          <div className="hero-chips" aria-hidden="true">
            <span className="hero-chip">PDF</span>
            <span className="hero-chip">Markdown</span>
            <span className="hero-chip">IA assistida</span>
          </div>
        </aside>

        <div className="hero-accent" aria-hidden="true">
          <span className="hero-accent-dot" />
          <span className="hero-accent-dot" />
          <span className="hero-accent-dot" />
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
          <PreviewToolbar
            previewLanguage={previewLanguage}
            onPreviewLanguageChange={setPreviewLanguage}
            previewLanguageLabel={previewLanguageLabel}
            translationUpdatedText={translationUpdatedText}
            isTranslationStale={isTranslationStale}
            hasTranslation={hasTranslation}
            loadingAction={loadingAction}
            undoResetVisible={undoResetVisible}
            onSave={handleSave}
            onExportPdf={handleExportPdf}
            onExportMarkdown={handleExportMarkdown}
            onTranslate={handleTranslateSelectedLanguage}
            onReset={handleReset}
            onUndoReset={handleUndoReset}
            onImprove={handleImprove}
          />

          <Preview data={previewData} language={previewLanguage} />
        </section>
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <AppFooter />
    </div>
  );
}

export default App;