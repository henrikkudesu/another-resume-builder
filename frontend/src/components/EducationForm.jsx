import { UI_TEXT } from "../content/uiText.pt-br";
import { useArrayField } from "../hooks/useArrayField";

export default function EducationForm({ education, setResume }) {
    const text = UI_TEXT.forms.education;
    const common = UI_TEXT.forms.common;
    const { addItem, updateItem, removeItem } = useArrayField({
        setResume,
        fieldKey: "education",
        createEmptyItem: () => ({ school: "", course: "", city: "", period: "", description: "" }),
    });

    return (
        <div className="section-card">
            <h2>{text.title}</h2>

            {education.map((edu, i) => (
                <div key={i} className="entry-card">
                    <div className="entry-actions">
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => removeItem(i)}
                            disabled={education.length <= 1}
                        >
                            {common.remove}
                        </button>
                    </div>

                    <input placeholder={text.placeholders.school}
                        value={edu.school}
                        onChange={e => updateItem(i, "school", e.target.value)} />

                    <input placeholder={text.placeholders.course}
                        value={edu.course}
                        onChange={e => updateItem(i, "course", e.target.value)} />

                    <input placeholder={text.placeholders.city}
                        value={edu.city || ""}
                        onChange={e => updateItem(i, "city", e.target.value)} />

                    <input placeholder={text.placeholders.period}
                        value={edu.period}
                        onChange={e => updateItem(i, "period", e.target.value)} />

                    <textarea placeholder={text.placeholders.description}
                        value={edu.description}
                        onChange={e => updateItem(i, "description", e.target.value)} />
                </div>
            ))}

            <button className="secondary-btn" onClick={addItem}>{text.addLabel}</button>
        </div>
    );
}