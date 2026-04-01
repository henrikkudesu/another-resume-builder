import { useEffect, useMemo, useState } from "react";
import "./App.css";

import PersonalForm from "./components/PersonalForm";
import ExperienceForm from "./components/ExperienceForm";
import EducationForm from "./components/EducationForm";
import ExtrasForm from "./components/ExtrasForm";
import Preview from "./components/Preview";
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

const LANGUAGE_OPTIONS = [
  { value: "pt-br", label: "Portugues (pt-br)" },
  { value: "en-us", label: "English (en-us)" },
  { value: "es", label: "Espanol (es)" },
];

const LANGUAGE_BADGE_LABELS = {
  "pt-br": "PT-BR",
  "en-us": "EN-US",
  es: "ES",
};

const TRANSLATION_CACHE_STORAGE_KEY = "resume_studio_translation_cache_v1";

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function formatRelativeMinutes(timestamp, nowMs) {
  if (!timestamp) {
    return null;
  }

  const diffMinutes = Math.max(0, Math.floor((nowMs - Number(timestamp)) / 60000));

  if (diffMinutes < 1) {
    return "Atualizado agora";
  }

  if (diffMinutes === 1) {
    return "Atualizado ha 1 min";
  }

  return `Atualizado ha ${diffMinutes} min`;
}

function App() {
  const { resume, setResume, markSaved, getSaveStatusText } = useResumeState();
  const { toast, showToast } = useToast();
  const [loadingAction, setLoadingAction] = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState("pt-br");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [translationsByLanguage, setTranslationsByLanguage] = useState(() => {
    try {
      const raw = localStorage.getItem(TRANSLATION_CACHE_STORAGE_KEY);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return {};
      }

      const allowedLanguages = new Set(LANGUAGE_OPTIONS.map((option) => option.value));
      const normalized = {};

      Object.entries(parsed).forEach(([language, entry]) => {
        if (!allowedLanguages.has(language)) {
          return;
        }

        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          return;
        }

        if (!entry.resume || typeof entry.fingerprint !== "string") {
          return;
        }

        normalized[language] = {
          resume: entry.resume,
          fingerprint: entry.fingerprint,
          generatedAt: Number(entry.generatedAt || Date.now()),
        };
      });

      return normalized;
    } catch {
      return {};
    }
  });
  const { undoResetVisible, resetResume, undoReset } = useResettableResume({
    setResume,
    emptyResume: EMPTY_RESUME,
    storageKey: STORAGE_KEY,
  });

  const resumeFingerprint = useMemo(() => stableStringify(resume), [resume]);
  const selectedTranslation = translationsByLanguage[previewLanguage] || null;
  const hasTranslation = previewLanguage !== "pt-br" && Boolean(selectedTranslation?.resume);
  const isTranslationStale = hasTranslation
    ? selectedTranslation.fingerprint !== resumeFingerprint
    : false;

  const previewData = useMemo(() => {
    if (previewLanguage === "pt-br") {
      return resume;
    }

    if (selectedTranslation?.resume) {
      return selectedTranslation.resume;
    }

    return resume;
  }, [previewLanguage, resume, selectedTranslation]);

  const previewLanguageLabel = useMemo(() => {
    const current = LANGUAGE_OPTIONS.find((item) => item.value === previewLanguage);
    return current?.label || previewLanguage;
  }, [previewLanguage]);

  const translationUpdatedText = useMemo(() => {
    if (previewLanguage === "pt-br") {
      return "Original em PT-BR";
    }

    return formatRelativeMinutes(selectedTranslation?.generatedAt, nowMs) || "Traducao ainda nao gerada";
  }, [nowMs, previewLanguage, selectedTranslation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TRANSLATION_CACHE_STORAGE_KEY, JSON.stringify(translationsByLanguage));
    } catch {
      // Ignore storage errors (quota/privacy mode) and keep in-memory cache working.
    }
  }, [translationsByLanguage]);

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

      setTranslationsByLanguage((previous) => ({
        ...previous,
        [previewLanguage]: {
          resume: translated,
          fingerprint: resumeFingerprint,
          generatedAt: Date.now(),
        },
      }));

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
            <div className="preview-toolbar-header">
              <div>
                <h2>Preview</h2>
                <p className="language-caption">Idioma atual: {previewLanguageLabel}</p>
                <div className="language-badge-row" aria-label="Idiomas do preview">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <span
                      key={option.value}
                      className={`language-badge ${previewLanguage === option.value ? "language-badge-active" : ""}`}
                    >
                      {LANGUAGE_BADGE_LABELS[option.value] || option.value.toUpperCase()}
                    </span>
                  ))}
                </div>
                <p className="translation-updated-at">{translationUpdatedText}</p>
              </div>

              <div className="language-controls">
                <label htmlFor="preview-language" className="language-label">Idioma</label>
                <select
                  id="preview-language"
                  className="language-select"
                  value={previewLanguage}
                  onChange={(event) => setPreviewLanguage(event.target.value)}
                  disabled={loadingAction !== null}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {previewLanguage !== "pt-br" && (
              <p className={`translation-status ${isTranslationStale ? "translation-status-warning" : "translation-status-ok"}`}>
                {hasTranslation
                  ? isTranslationStale
                    ? "A traducao exibida esta desatualizada. Clique em Atualizar traducao."
                    : "Traducao atualizada para esta versao do curriculo."
                  : "Nenhuma traducao gerada para este idioma ainda."}
              </p>
            )}

            <div className="toolbar-actions">
              <button className="secondary-btn" onClick={handleSave}>Salvar</button>
              <button className="secondary-btn" onClick={handleExportPdf}>Exportar PDF</button>
              <button className="secondary-btn" onClick={handleExportMarkdown}>Exportar Markdown</button>
              <button
                className="secondary-btn"
                onClick={handleTranslateSelectedLanguage}
                disabled={loadingAction !== null || previewLanguage === "pt-br"}
              >
                {loadingAction === "translate" ? "Traduzindo..." : hasTranslation ? "Atualizar traducao" : "Traduzir curriculo"}
              </button>
              <button className="secondary-btn danger-btn" onClick={handleReset}>Resetar</button>
              {undoResetVisible && (
                <button className="secondary-btn" onClick={handleUndoReset}>Desfazer reset</button>
              )}
              <button className="primary-btn" onClick={handleImprove} disabled={loadingAction !== null}>
                {loadingAction === "improve" ? "Gerando..." : "Aprimorar com IA"}
              </button>
            </div>
          </div>

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