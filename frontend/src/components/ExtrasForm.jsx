import { UI_TEXT } from "../content/uiText.pt-br";

export default function ExtrasForm({ extras, setResume }) {
    const text = UI_TEXT.forms.extras;

    function update(field, value) {
        setResume(prev => ({
            ...prev,
            extras: {
                ...prev.extras,
                [field]: value
            }
        }));
    }

    return (
        <div className="section-card">
            <h2>{text.title}</h2>

            <textarea placeholder={text.placeholders.skills}
                value={extras.skills}
                onChange={e => update("skills", e.target.value)} />

            <textarea placeholder={text.placeholders.certifications}
                value={extras.certifications}
                onChange={e => update("certifications", e.target.value)} />

            <textarea placeholder={text.placeholders.interests}
                value={extras.interests}
                onChange={e => update("interests", e.target.value)} />
        </div>
    );
}