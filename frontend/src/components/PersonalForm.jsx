import { UI_TEXT } from "../content/uiText.pt-br";

export default function PersonalForm({ data, setResume }) {
    const text = UI_TEXT.forms.personal;

    function update(field, value) {
        setResume(prev => ({
            ...prev,
            personal: {
                ...prev.personal,
                [field]: value
            }
        }));
    }

    return (
        <div className="section-card">
            <h2>{text.title}</h2>

            <input placeholder={text.placeholders.name}
                value={data.name}
                onChange={e => update("name", e.target.value)} />

            <input placeholder={text.placeholders.city}
                value={data.city}
                onChange={e => update("city", e.target.value)} />

            <input placeholder={text.placeholders.country}
                value={data.country}
                onChange={e => update("country", e.target.value)} />

            <input placeholder={text.placeholders.phone}
                value={data.phone}
                onChange={e => update("phone", e.target.value)} />

            <input placeholder={text.placeholders.links}
                value={data.links}
                onChange={e => update("links", e.target.value)} />
        </div>
    );
}