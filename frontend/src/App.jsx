import { useState } from "react";
import "./App.css";

import PersonalForm from "./components/PersonalForm";
import SummaryForm from "./components/SummaryForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ExtrasForm from "./components/ExtrasForm";
import TutorialEmptyState from "./components/TutorialEmptyState";
import Preview from "./components/Preview";
import PreviewToolbar from "./components/PreviewToolbar";
import AppFooter from "./components/AppFooter";

import { EMPTY_RESUME, STORAGE_KEY } from "./domain/resumeDefaults";
import {
  isEmptyEducation,
  isEmptyExperience,
  isResumeEmpty,
  truncateText,
} from "./domain/resumeUtils";
import { UI_TEXT } from "./content/uiText.pt-br";
import { JOHN_DOE_RESUME } from "./content/samples/johnDoe.pt-br";
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
import { useImportFlow } from "./hooks/useImportFlow";

function App() {
  const { resume, setResume, markSaved, getSaveStatusText } = useResumeState();
  const { toast, showToast } = useToast();
  const [loadingAction, setLoadingAction] = useState(null);
  const [showTutorial, setShowTutorial] = useState(() => isResumeEmpty(resume));
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
  const {
    fileInputRef,
    importDraft,
    importMode,
    setImportMode,
    handleImportPdfClick,
    handleImportPdfSelected,
    handleImportCancel,
    handleImportApply,
  } = useImportFlow({
    resume,
    setResume,
    showToast,
    setLoadingAction,
    onHideTutorial: () => setShowTutorial(false),
  });

  async function handleImprove() {
    setLoadingAction("improve");

    try {
      const data = await improveResumeWithValidation(resume);
      setResume(data);
      showToast(UI_TEXT.toasts.improved, "success");
    } catch (err) {
      console.error(err);
      showToast(`${UI_TEXT.toasts.improveError} ${err.message}`, "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleTranslateSelectedLanguage() {
    if (previewLanguage === "pt-br") {
      showToast(UI_TEXT.toasts.translateSelect, "info");
      return;
    }

    if (selectedTranslation?.fingerprint === resumeFingerprint && selectedTranslation?.resume) {
      showToast(UI_TEXT.toasts.translationReuse, "info");
      return;
    }

    setLoadingAction("translate");

    try {
      const translated = await translateResumeWithValidation(resume, previewLanguage, "pt-br");
      storeTranslation(previewLanguage, translated);

      showToast(`${UI_TEXT.toasts.translationReady} ${previewLanguage}.`, "success");
    } catch (err) {
      console.error(err);
      showToast(`${UI_TEXT.toasts.translationError} ${err.message}`, "error");
    } finally {
      setLoadingAction(null);
    }
  }

  function handleSave() {
    markSaved();
    showToast(UI_TEXT.toasts.saved, "success");
  }

  function handleReset() {
    if (!window.confirm(UI_TEXT.misc.resetConfirm)) {
      return;
    }

    resetResume(resume);
    setShowTutorial(true);
    showToast(UI_TEXT.toasts.resetDone, "info");
  }

  function handleUndoReset() {
    if (undoReset()) {
      setShowTutorial(false);
      showToast(UI_TEXT.toasts.undoReset, "success");
    }
  }

  function handleExportMarkdown() {
    try {
      exportResumeAsMarkdown(previewData, previewLanguage);

      showToast(UI_TEXT.toasts.exportMarkdownOk, "success");
    } catch (err) {
      console.error(err);
      showToast(`${UI_TEXT.toasts.exportMarkdownError} ${err.message}`, "error");
    }
  }

  async function handleExportPdf() {
    try {
      showToast(UI_TEXT.toasts.exportPdfStart, "info");
      await exportResumeAsPdf(previewData, previewLanguage);
      showToast(UI_TEXT.toasts.exportPdfOk, "success");
    } catch (err) {
      console.error(err);
      showToast(`${UI_TEXT.toasts.exportPdfError} ${err.message}`, "error");
    }
  }

  function handleShowTutorial() {
    setShowTutorial(true);
  }

  function handleStartBlank() {
    setShowTutorial(false);
  }

  function handleUseExample() {
    setResume(JOHN_DOE_RESUME);
    setShowTutorial(false);
  }

  return (
    <div className="app-shell">
      <header className="app-hero">
        <div className="hero-main">
          <h1>{UI_TEXT.hero.title}</h1>
          <p className="hero-copy">{UI_TEXT.hero.subtitle}</p>
          <div className="hero-actions">
            <button className="link-btn" onClick={handleShowTutorial}>{UI_TEXT.hero.tutorialLink}</button>
          </div>
        </div>

        <aside className="hero-meta" aria-label="Resumo da sessao">
          <p className="save-status">{getSaveStatusText()}</p>
          <div className="hero-chips" aria-hidden="true">
            {UI_TEXT.hero.chips.map((chip) => (
              <span key={chip} className="hero-chip">{chip}</span>
            ))}
          </div>
        </aside>

        <div className="hero-accent" aria-hidden="true">
          <span className="hero-accent-dot" />
          <span className="hero-accent-dot" />
          <span className="hero-accent-dot" />
        </div>
      </header>

      <main className="app-grid">
        {showTutorial ? (
          <TutorialEmptyState
            onImportPdf={handleImportPdfClick}
            onStartBlank={handleStartBlank}
            onUseExample={handleUseExample}
            onClose={!isResumeEmpty(resume) ? () => setShowTutorial(false) : null}
          />
        ) : (
          <>
            <section className="editor-panel">
              <PersonalForm data={resume.personal} setResume={setResume} />

              <SummaryForm summary={resume.summary} setResume={setResume} />

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
                onImportPdf={handleImportPdfClick}
                onExportPdf={handleExportPdf}
                onExportMarkdown={handleExportMarkdown}
                onTranslate={handleTranslateSelectedLanguage}
                onReset={handleReset}
                onUndoReset={handleUndoReset}
                onImprove={handleImprove}
              />

              <Preview data={previewData} language={previewLanguage} />
            </section>
          </>
        )}
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {importDraft && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Revisao da importacao">
          <div className="modal-card">
            <header className="modal-header">
              <div>
                <h3>{UI_TEXT.modal.title}</h3>
                <p className="modal-subtitle">{UI_TEXT.modal.subtitle}</p>
              </div>
              <button className="secondary-btn" onClick={handleImportCancel}>{UI_TEXT.modal.actions.close}</button>
            </header>

            <div className="modal-body">
              <div className="modal-section">
                <h4>{UI_TEXT.modal.sections.personal}</h4>
                <p><strong>{UI_TEXT.modal.fields.name}:</strong> {truncateText(importDraft.personal?.name, 60)}</p>
                <p><strong>{UI_TEXT.modal.fields.city}:</strong> {truncateText(importDraft.personal?.city, 60)}</p>
                <p><strong>{UI_TEXT.modal.fields.country}:</strong> {truncateText(importDraft.personal?.country, 60)}</p>
                <p><strong>{UI_TEXT.modal.fields.phone}:</strong> {truncateText(importDraft.personal?.phone, 60)}</p>
                <p><strong>{UI_TEXT.modal.fields.links}:</strong> {truncateText(importDraft.personal?.links, 120)}</p>
              </div>

              <div className="modal-section">
                <h4>{UI_TEXT.modal.sections.summary}</h4>
                <p>{truncateText(importDraft.summary, 220)}</p>
              </div>

              <div className="modal-section">
                <h4>{UI_TEXT.modal.sections.experiences}</h4>
                <ul className="modal-list">
                  {(importDraft.experiences || [])
                    .filter((exp) => !isEmptyExperience(exp))
                    .slice(0, 4)
                    .map((exp, index) => {
                      const title = [exp.role, exp.company].filter(Boolean).join(" - ") || UI_TEXT.modal.sections.experiences;
                      const meta = [exp.period, exp.city].filter(Boolean).join(" | ");
                      return (
                        <li key={`exp-${index}`}>
                          <strong>{truncateText(title, 80)}</strong>
                          {meta ? <span>{truncateText(meta, 80)}</span> : null}
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div className="modal-section">
                <h4>{UI_TEXT.modal.sections.education}</h4>
                <ul className="modal-list">
                  {(importDraft.education || [])
                    .filter((edu) => !isEmptyEducation(edu))
                    .slice(0, 4)
                    .map((edu, index) => {
                      const title = [edu.course, edu.school].filter(Boolean).join(" - ") || UI_TEXT.modal.sections.education;
                      const meta = [edu.period, edu.city].filter(Boolean).join(" | ");
                      return (
                        <li key={`edu-${index}`}>
                          <strong>{truncateText(title, 80)}</strong>
                          {meta ? <span>{truncateText(meta, 80)}</span> : null}
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div className="modal-section">
                <h4>{UI_TEXT.modal.sections.extras}</h4>
                <p><strong>{UI_TEXT.modal.fields.skills}:</strong> {truncateText(importDraft.extras?.skills, 140)}</p>
                <p><strong>{UI_TEXT.modal.fields.certifications}:</strong> {truncateText(importDraft.extras?.certifications, 140)}</p>
                <p><strong>{UI_TEXT.modal.fields.interests}:</strong> {truncateText(importDraft.extras?.interests, 140)}</p>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-choice">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="import-mode"
                    value="merge"
                    checked={importMode === "merge"}
                    onChange={() => setImportMode("merge")}
                  />
                  {UI_TEXT.modal.actions.merge}
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="import-mode"
                    value="replace"
                    checked={importMode === "replace"}
                    onChange={() => setImportMode("replace")}
                  />
                  {UI_TEXT.modal.actions.replace}
                </label>
              </div>

              <div className="modal-actions">
                <button className="secondary-btn" onClick={handleImportCancel}>{UI_TEXT.modal.actions.cancel}</button>
                <button className="primary-btn" onClick={handleImportApply}>{UI_TEXT.modal.actions.apply}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="file-input-hidden"
        onChange={handleImportPdfSelected}
        aria-hidden="true"
      />

      <AppFooter />
    </div>
  );
}

export default App;