export default function ExperienceForm({ experiences, setResume }) {
    function addExperience() {
        setResume(prev => ({
            ...prev,
            experiences: [
                ...prev.experiences,
                { role: "", company: "", city: "", period: "", description: "", style: "bullet" }
            ]
        }));
    }

    function update(index, field, value) {
        const updated = [...experiences];
        updated[index][field] = value;

        setResume(prev => ({
            ...prev,
            experiences: updated
        }));
    }

    function removeExperience(index) {
        setResume(prev => {
            if (prev.experiences.length <= 1) {
                return prev;
            }

            const updated = prev.experiences.filter((_, i) => i !== index);
            return {
                ...prev,
                experiences: updated
            };
        });
    }

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
                            onClick={() => removeExperience(i)}
                            disabled={experiences.length <= 1}
                        >
                            Remover
                        </button>
                    </div>

                    <input placeholder="Cargo"
                        value={exp.role}
                        onChange={e => update(i, "role", e.target.value)} />

                    <input placeholder="Empresa"
                        value={exp.company}
                        onChange={e => update(i, "company", e.target.value)} />

                    <input placeholder="Cidade"
                        value={exp.city || ""}
                        onChange={e => update(i, "city", e.target.value)} />

                    <input placeholder="Período"
                        value={exp.period || ""}
                        onChange={e => update(i, "period", e.target.value)} />

                    <textarea placeholder="Descrição"
                        value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description}
                        onChange={e => update(i, "description", e.target.value)} />

                    <select value={exp.style || "bullet"} onChange={e => update(i, "style", e.target.value)}>
                        <option value="bullet">Bullet</option>
                        <option value="paragraph">Parágrafo</option>
                    </select>
                </div>
            ))}

            <button className="secondary-btn" onClick={addExperience}>
                + Adicionar experiência
            </button>
        </div>
    );
}