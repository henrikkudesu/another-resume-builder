import { LANGUAGE_BADGE_LABELS, LANGUAGE_OPTIONS } from "../domain/resumeLabels";
import { UI_TEXT } from "../content/uiText.pt-br";

export default function PreviewToolbar({
    previewLanguage,
    onPreviewLanguageChange,
    previewLanguageLabel,
    translationUpdatedText,
    isTranslationStale,
    hasTranslation,
    loadingAction,
    undoResetVisible,
    onSave,
    onExportPdf,
    onExportMarkdown,
    onImportPdf,
    onTranslate,
    onReset,
    onUndoReset,
    onImprove,
}) {
    const icons = {
        save: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3h11l3 3v15H5z" />
                <path d="M9 3v6h6V3" />
                <path d="M8 21v-6h8v6" />
            </svg>
        ),
        upload: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 8 5-5 5 5" />
                <path d="M4 21h16" />
            </svg>
        ),
        download: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 12 5 5 5-5" />
                <path d="M4 21h16" />
            </svg>
        ),
        code: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 7-5 5 5 5" />
                <path d="m16 7 5 5-5 5" />
            </svg>
        ),
        translate: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h8" />
                <path d="M8 6v10" />
                <path d="m4 14 4 2 4-2" />
                <path d="M14 6h6" />
                <path d="m14 10 6 6" />
                <path d="m20 10-6 6" />
            </svg>
        ),
        reset: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
            </svg>
        ),
        undo: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14 4 9l5-5" />
                <path d="M20 20a7 7 0 0 0-7-7H4" />
            </svg>
        ),
        sparkle: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.7 4.2L18 9l-4.3 1.8L12 15l-1.7-4.2L6 9l4.3-1.8L12 3z" />
                <path d="M4 18l0.8 2 2 0.8-2 0.8L4 24l-0.8-2-2-0.8 2-0.8L4 18z" />
            </svg>
        ),
    };

    return (
        <div className="preview-toolbar">
            <div className="preview-toolbar-header">
                <div>
                    <h2>{UI_TEXT.toolbar.title}</h2>
                    <p className="language-caption">{UI_TEXT.toolbar.languageCaptionPrefix} {previewLanguageLabel}</p>
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
                        onChange={(event) => onPreviewLanguageChange(event.target.value)}
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
                            ? UI_TEXT.toolbar.translate.stale
                            : UI_TEXT.toolbar.translate.ok
                        : UI_TEXT.toolbar.translate.empty}
                </p>
            )}

            <div className="toolbar-actions">
                <button className="secondary-btn action-btn" onClick={onSave}>
                    <span className="btn-icon" aria-hidden="true">{icons.save}</span>
                    <span className="btn-text">
                        <span className="btn-label">Salvar</span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.save.hint}</span>
                    </span>
                </button>
                <button
                    className="secondary-btn action-btn"
                    onClick={onImportPdf}
                    disabled={loadingAction !== null}
                >
                    <span className="btn-icon" aria-hidden="true">{icons.upload}</span>
                    <span className="btn-text">
                        <span className="btn-label">{loadingAction === "import" ? UI_TEXT.toolbar.actions.importPdf.loading : UI_TEXT.toolbar.actions.importPdf.label}</span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.importPdf.hint}</span>
                    </span>
                </button>
                <button className="secondary-btn action-btn" onClick={onExportPdf}>
                    <span className="btn-icon" aria-hidden="true">{icons.download}</span>
                    <span className="btn-text">
                        <span className="btn-label">{UI_TEXT.toolbar.actions.exportPdf.label}</span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.exportPdf.hint}</span>
                    </span>
                </button>
                <button className="secondary-btn action-btn" onClick={onExportMarkdown}>
                    <span className="btn-icon" aria-hidden="true">{icons.code}</span>
                    <span className="btn-text">
                        <span className="btn-label">{UI_TEXT.toolbar.actions.exportMarkdown.label}</span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.exportMarkdown.hint}</span>
                    </span>
                </button>
                <button
                    className="secondary-btn action-btn"
                    onClick={onTranslate}
                    disabled={loadingAction !== null || previewLanguage === "pt-br"}
                >
                    <span className="btn-icon" aria-hidden="true">{icons.translate}</span>
                    <span className="btn-text">
                        <span className="btn-label">
                            {loadingAction === "translate"
                                ? UI_TEXT.toolbar.actions.translate.loading
                                : hasTranslation
                                    ? UI_TEXT.toolbar.actions.translate.refresh
                                    : UI_TEXT.toolbar.actions.translate.label}
                        </span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.translate.hint}</span>
                    </span>
                </button>
                <button className="secondary-btn danger-btn action-btn" onClick={onReset}>
                    <span className="btn-icon" aria-hidden="true">{icons.reset}</span>
                    <span className="btn-text">
                        <span className="btn-label">{UI_TEXT.toolbar.actions.reset.label}</span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.reset.hint}</span>
                    </span>
                </button>
                {undoResetVisible && (
                    <button className="secondary-btn action-btn" onClick={onUndoReset}>
                        <span className="btn-icon" aria-hidden="true">{icons.undo}</span>
                        <span className="btn-text">
                            <span className="btn-label">{UI_TEXT.toolbar.actions.undoReset.label}</span>
                            <span className="btn-hint">{UI_TEXT.toolbar.actions.undoReset.hint}</span>
                        </span>
                    </button>
                )}
                <button
                    className={`primary-btn action-btn ${loadingAction === "improve" ? "ai-loading" : ""}`}
                    onClick={onImprove}
                    disabled={loadingAction !== null}
                >
                    <span className="btn-icon" aria-hidden="true">{icons.sparkle}</span>
                    <span className="btn-text">
                        <span className="btn-label">{loadingAction === "improve" ? UI_TEXT.toolbar.actions.improve.loading : UI_TEXT.toolbar.actions.improve.label}</span>
                        <span className="btn-hint">{UI_TEXT.toolbar.actions.improve.hint}</span>
                    </span>
                </button>
            </div>

            <p className="ai-disclaimer">
                {UI_TEXT.toolbar.disclaimer}
            </p>
        </div>
    );
}
