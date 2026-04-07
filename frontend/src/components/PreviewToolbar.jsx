import { LANGUAGE_BADGE_LABELS, LANGUAGE_OPTIONS } from "../domain/resumeLabels";

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
    onTranslate,
    onReset,
    onUndoReset,
    onImprove,
}) {
    return (
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
                            ? "A traducao exibida esta desatualizada. Clique em Atualizar traducao."
                            : "Traducao atualizada para esta versao do curriculo."
                        : "Nenhuma traducao gerada para este idioma ainda. Clique no botão Traduzir curriculo para gerar uma traducao."}
                </p>
            )}

            <div className="toolbar-actions">
                <button className="secondary-btn" onClick={onSave}>Salvar</button>
                <button className="secondary-btn" onClick={onExportPdf}>Exportar PDF</button>
                <button className="secondary-btn" onClick={onExportMarkdown}>Exportar Markdown</button>
                <button
                    className="secondary-btn"
                    onClick={onTranslate}
                    disabled={loadingAction !== null || previewLanguage === "pt-br"}
                >
                    {loadingAction === "translate" ? "Traduzindo..." : hasTranslation ? "Atualizar traducao" : "Traduzir curriculo"}
                </button>
                <button className="secondary-btn danger-btn" onClick={onReset}>Resetar</button>
                {undoResetVisible && (
                    <button className="secondary-btn" onClick={onUndoReset}>Desfazer reset</button>
                )}
                <button className="primary-btn" onClick={onImprove} disabled={loadingAction !== null}>
                    {loadingAction === "improve" ? "Gerando..." : "Aprimorar com IA"}
                </button>
            </div>
        </div>
    );
}
