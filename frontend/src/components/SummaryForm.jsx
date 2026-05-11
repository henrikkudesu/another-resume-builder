import { UI_TEXT } from "../content/uiText.pt-br";

export default function SummaryForm({ summary, setResume }) {
    const text = UI_TEXT.forms.summary;
    function update(value) {
        setResume((prev) => ({
            ...prev,
            summary: value,
        }));
    }

    return (
        <div className="section-card">
            <h2>{text.title}</h2>
            <textarea
                placeholder={text.placeholder}
                value={summary}
                onChange={(event) => update(event.target.value)}
            />
        </div>
    );
}
