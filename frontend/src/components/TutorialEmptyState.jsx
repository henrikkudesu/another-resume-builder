import { UI_TEXT } from "../content/uiText.pt-br";

export default function TutorialEmptyState({ onImportPdf, onStartBlank, onUseExample, onClose }) {
    return (
        <section className="tutorial-shell">
            <div className="tutorial-content">
                <p className="tutorial-eyebrow">{UI_TEXT.tutorial.eyebrow}</p>
                <h2>{UI_TEXT.tutorial.title}</h2>
                <p className="tutorial-lead">{UI_TEXT.tutorial.lead}</p>
                <div className="tutorial-actions">
                    <button className="primary-btn" onClick={onImportPdf}>{UI_TEXT.tutorial.actions.importPdf}</button>
                    <button className="secondary-btn" onClick={onStartBlank}>{UI_TEXT.tutorial.actions.startBlank}</button>
                    <button className="secondary-btn" onClick={onUseExample}>{UI_TEXT.tutorial.actions.useExample}</button>
                    {onClose && (
                        <button className="ghost-btn" onClick={onClose}>{UI_TEXT.tutorial.actions.backToResume}</button>
                    )}
                </div>
            </div>

            <ol className="tutorial-steps">
                {UI_TEXT.tutorial.steps.map((step, index) => (
                    <li key={step.title}>
                        <span className="step-index">{index + 1}</span>
                        <div>
                            <h4>{step.title}</h4>
                            <p>{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
