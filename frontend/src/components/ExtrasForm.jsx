export default function ExtrasForm({ extras, setResume }) {

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
            <h2>Informações Complementares</h2>

            <textarea placeholder="Habilidades"
                value={extras.skills}
                onChange={e => update("skills", e.target.value)} />

            <textarea placeholder="Certificações"
                value={extras.certifications}
                onChange={e => update("certifications", e.target.value)} />

            <textarea placeholder="Interesses"
                value={extras.interests}
                onChange={e => update("interests", e.target.value)} />
        </div>
    );
}