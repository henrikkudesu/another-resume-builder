import { UI_TEXT } from "../content/uiText.pt-br";
import { useArrayField } from "../hooks/useArrayField";

export default function ExperienceForm({ experiences, setResume }) {
    const text = UI_TEXT.forms.experience;
    const common = UI_TEXT.forms.common;
    const { addItem, updateItem, removeItem } = useArrayField({
        setResume,
        fieldKey: "experiences",
        createEmptyItem: () => ({ role: "", company: "", city: "", period: "", description: "", style: "paragraph" }),
    });

    return (
        <div className="section-card">
            <h2>{text.title}</h2>
            <p className="field-hint">{text.hint}</p>

            {experiences.map((exp, i) => (
                <div key={i} className="entry-card">
                    <div className="entry-actions">
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => removeItem(i)}
                            disabled={experiences.length <= 1}
                        >
                            {common.remove}
                        </button>
                    </div>

                    <input placeholder={text.placeholders.role}
                        value={exp.role}
                        onChange={e => updateItem(i, "role", e.target.value)} />

                    <input placeholder={text.placeholders.company}
                        value={exp.company}
                        onChange={e => updateItem(i, "company", e.target.value)} />

                    <input placeholder={text.placeholders.city}
                        value={exp.city || ""}
                        onChange={e => updateItem(i, "city", e.target.value)} />

                    <input placeholder={text.placeholders.period}
                        value={exp.period || ""}
                        onChange={e => updateItem(i, "period", e.target.value)} />

                    <textarea placeholder={text.placeholders.description}
                        value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description}
                        onChange={e => updateItem(i, "description", e.target.value)} />

                    <select value={exp.style || "paragraph"} onChange={e => updateItem(i, "style", e.target.value)}>
                        <option value="bullet">{text.styleOptions.bullet}</option>
                        <option value="paragraph">{text.styleOptions.paragraph}</option>
                    </select>
                </div>
            ))}

            <button className="secondary-btn" onClick={addItem}>
                {text.addLabel}
            </button>
        </div>
    );
}