import { useArrayField } from "../hooks/useArrayField";

export default function EducationForm({ education, setResume }) {
    const { addItem, updateItem, removeItem } = useArrayField({
        setResume,
        fieldKey: "education",
        createEmptyItem: () => ({ school: "", course: "", city: "", period: "", description: "" }),
    });

    return (
        <div className="section-card">
            <h2>Educação</h2>

            {education.map((edu, i) => (
                <div key={i} className="entry-card">
                    <div className="entry-actions">
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => removeItem(i)}
                            disabled={education.length <= 1}
                        >
                            Remover
                        </button>
                    </div>

                    <input placeholder="Instituição"
                        value={edu.school}
                        onChange={e => updateItem(i, "school", e.target.value)} />

                    <input placeholder="Curso"
                        value={edu.course}
                        onChange={e => updateItem(i, "course", e.target.value)} />

                    <input placeholder="Cidade"
                        value={edu.city || ""}
                        onChange={e => updateItem(i, "city", e.target.value)} />

                    <input placeholder="Período"
                        value={edu.period}
                        onChange={e => updateItem(i, "period", e.target.value)} />

                    <textarea placeholder="Descrição"
                        value={edu.description}
                        onChange={e => updateItem(i, "description", e.target.value)} />
                </div>
            ))}

            <button className="secondary-btn" onClick={addItem}>+ Adicionar</button>
        </div>
    );
}