export default function PersonalForm({ data, setResume }) {

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
            <h2>Dados Pessoais</h2>

            <input placeholder="Nome"
                value={data.name}
                onChange={e => update("name", e.target.value)} />

            <input placeholder="Cidade"
                value={data.city}
                onChange={e => update("city", e.target.value)} />

            <input placeholder="País"
                value={data.country}
                onChange={e => update("country", e.target.value)} />

            <input placeholder="Telefone"
                value={data.phone}
                onChange={e => update("phone", e.target.value)} />

            <input placeholder="Links (LinkedIn, GitHub...)"
                value={data.links}
                onChange={e => update("links", e.target.value)} />
        </div>
    );
}