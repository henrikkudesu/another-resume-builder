export default function Preview({ data }) {
    function normalizeExperience(exp) {
        const raw = exp?.description;

        const bullets = Array.isArray(raw)
            ? raw.map((item) => String(item).trim()).filter(Boolean)
            : String(raw || "")
                .split("\n")
                .map((item) => item.replace(/^[-*]\s*/, "").trim())
                .filter(Boolean);

        const paragraph = Array.isArray(raw)
            ? raw.join(" ").replace(/\s+/g, " ").trim()
            : String(raw || "").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();

        return { bullets, paragraph };
    }

    return (
        <div className="resume-preview">
            <header className="resume-header">
                <h1>{data.personal.name || "Seu Nome"}</h1>
                <p>
                    {[data.personal.city, data.personal.country].filter(Boolean).join(" - ") || "Cidade - País"}
                </p>
                <small>{data.personal.phone} {data.personal.links ? `| ${data.personal.links}` : ""}</small>
            </header>

            {data.summary && (
                <section>
                    <h3>Resumo</h3>
                    <p>{data.summary}</p>
                </section>
            )}

            <section>
                <h3>Experiência</h3>
                {data.experiences.map((exp, i) => (
                    <article key={i} className="resume-block">
                        <strong>{exp.role} - {exp.company}</strong>
                        {(() => {
                            const { bullets, paragraph } = normalizeExperience(exp);

                            if (exp.style === "paragraph") {
                                return <p>{paragraph || "Descrição não preenchida."}</p>;
                            }

                            return bullets.length ? (
                                <ul>
                                    {bullets.map((d, idx) => <li key={idx}>{d}</li>)}
                                </ul>
                            ) : (
                                <p>Descrição não preenchida.</p>
                            );
                        })()}
                    </article>
                ))}
            </section>

            <section>
                <h3>Educação</h3>
                {data.education.map((edu, i) => (
                    <article key={i} className="resume-block">
                        <strong>{edu.course} - {edu.school}</strong>
                        <p>{edu.period}</p>
                        {edu.description && <p>{edu.description}</p>}
                    </article>
                ))}
            </section>

            <section>
                <h3>Extras</h3>
                <article className="resume-block">
                    <p><strong>Habilidades:</strong> {data.extras.skills}</p>
                    <p><strong>Certificações:</strong> {data.extras.certifications}</p>
                    <p><strong>Interesses:</strong> {data.extras.interests}</p>
                </article>
            </section>
        </div>
    );
}