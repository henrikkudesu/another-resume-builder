export default function EducationForm({ education, setResume }) {

    function add() {
        setResume(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { school: "", course: "", period: "", description: "" }
            ]
        }));
    }

    function update(index, field, value) {
        const updated = [...education];
        updated[index][field] = value;

        setResume(prev => ({
            ...prev,
            education: updated
        }));
    }

    function remove(index) {
        setResume(prev => {
            if (prev.education.length <= 1) {
                return prev;
            }

            const updated = prev.education.filter((_, i) => i !== index);
            return {
                ...prev,
                education: updated
            };
        });
    }

    return (
        <div className="section-card">
            <h2>Educação</h2>

            {education.map((edu, i) => (
                <div key={i} className="entry-card">
                    <div className="entry-actions">
                        <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => remove(i)}
                            disabled={education.length <= 1}
                        >
                            Remover
                        </button>
                    </div>

                    <input placeholder="Instituição"
                        value={edu.school}
                        onChange={e => update(i, "school", e.target.value)} />

                    <input placeholder="Curso"
                        value={edu.course}
                        onChange={e => update(i, "course", e.target.value)} />

                    <input placeholder="Período"
                        value={edu.period}
                        onChange={e => update(i, "period", e.target.value)} />

                    <textarea placeholder="Descrição"
                        value={edu.description}
                        onChange={e => update(i, "description", e.target.value)} />
                </div>
            ))}

            <button className="secondary-btn" onClick={add}>+ Adicionar</button>
        </div>
    );
}