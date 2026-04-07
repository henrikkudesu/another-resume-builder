import { useArrayField } from "../hooks/useArrayField";

export default function ExperienceForm({ experiences, setResume }) {
    const { addItem, updateItem, removeItem } = useArrayField({
        setResume,
        fieldKey: "experiences",
        createEmptyItem: () => ({ role: "", company: "", city: "", period: "", description: "", style: "paragraph" }),
    });

    return (
        <div className="section-card">
            <h2>Experiência</h2>
            <p className="field-hint">
                Selecione o formato por experiência. O preview e o PDF seguem esse estilo.
            </p>

            {experiences.map((exp, i) => (
                <div key={i} className="entry-card">
                    <div className="entry-actions">
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => removeItem(i)}
                            disabled={experiences.length <= 1}
                        >
                            Remover
                        </button>
                    </div>

                    <input placeholder="Cargo"
                        value={exp.role}
                        onChange={e => updateItem(i, "role", e.target.value)} />

                    <input placeholder="Empresa"
                        value={exp.company}
                        onChange={e => updateItem(i, "company", e.target.value)} />

                    <input placeholder="Cidade"
                        value={exp.city || ""}
                        onChange={e => updateItem(i, "city", e.target.value)} />

                    <input placeholder="Período"
                        value={exp.period || ""}
                        onChange={e => updateItem(i, "period", e.target.value)} />

                    <textarea placeholder="Descrição"
                        value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description}
                        onChange={e => updateItem(i, "description", e.target.value)} />

                    <select value={exp.style || "paragraph"} onChange={e => updateItem(i, "style", e.target.value)}>
                        <option value="bullet">Bullet</option>
                        <option value="paragraph">Parágrafo</option>
                    </select>
                </div>
            ))}

            <button className="secondary-btn" onClick={addItem}>
                + Adicionar experiência
            </button>
        </div>
    );
}