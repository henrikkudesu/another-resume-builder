const PREVIEW_LABELS = {
    "pt-br": {
        fallbackName: "Seu Nome",
        fallbackLocation: "Cidade - Pais",
        summary: "Resumo",
        experience: "Experiencia",
        education: "Educacao",
        extras: "Extras",
        missingDescription: "Descricao nao preenchida.",
        skills: "Habilidades",
        certifications: "Certificacoes",
        interests: "Interesses"
    },
    "en-us": {
        fallbackName: "Your Name",
        fallbackLocation: "City - Country",
        summary: "Summary",
        experience: "Experience",
        education: "Education",
        extras: "Extras",
        missingDescription: "Description not provided.",
        skills: "Skills",
        certifications: "Certifications",
        interests: "Interests"
    },
    "es": {
        fallbackName: "Tu Nombre",
        fallbackLocation: "Ciudad - Pais",
        summary: "Resumen",
        experience: "Experiencia",
        education: "Educacion",
        extras: "Extras",
        missingDescription: "Descripcion no completada.",
        skills: "Habilidades",
        certifications: "Certificaciones",
        interests: "Intereses"
    }
};

export default function Preview({ data, language = "pt-br" }) {
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

    const labels = PREVIEW_LABELS[language] || PREVIEW_LABELS["pt-br"];

    return (
        <div className="resume-preview">
            <header className="resume-header">
                <h1>{data.personal.name || labels.fallbackName}</h1>
                <p>
                    {[data.personal.city, data.personal.country].filter(Boolean).join(" - ") || labels.fallbackLocation}
                </p>
                <small>{data.personal.phone} {data.personal.links ? `| ${data.personal.links}` : ""}</small>
            </header>

            {data.summary && (
                <section>
                    <h3>{labels.summary}</h3>
                    <p>{data.summary}</p>
                </section>
            )}

            <section>
                <h3>{labels.experience}</h3>
                {data.experiences.map((exp, i) => (
                    <article key={i} className="resume-block">
                        <strong>{exp.role} - {exp.company}</strong>
                        {([exp.period, exp.city].filter(Boolean).length > 0) && (
                            <p>{[exp.period, exp.city].filter(Boolean).join(" | ")}</p>
                        )}
                        {(() => {
                            const { bullets, paragraph } = normalizeExperience(exp);

                            if (exp.style === "paragraph") {
                                return <p>{paragraph || labels.missingDescription}</p>;
                            }

                            return bullets.length ? (
                                <ul>
                                    {bullets.map((d, idx) => <li key={idx}>{d}</li>)}
                                </ul>
                            ) : (
                                <p>{labels.missingDescription}</p>
                            );
                        })()}
                    </article>
                ))}
            </section>

            <section>
                <h3>{labels.education}</h3>
                {data.education.map((edu, i) => (
                    <article key={i} className="resume-block">
                        <strong>{edu.course} - {edu.school}</strong>
                        {([edu.period, edu.city].filter(Boolean).length > 0) && (
                            <p>{[edu.period, edu.city].filter(Boolean).join(" | ")}</p>
                        )}
                        {edu.description && <p>{edu.description}</p>}
                    </article>
                ))}
            </section>

            <section>
                <h3>{labels.extras}</h3>
                <article className="resume-block">
                    <p><strong>{labels.skills}:</strong> {data.extras.skills}</p>
                    <p><strong>{labels.certifications}:</strong> {data.extras.certifications}</p>
                    <p><strong>{labels.interests}:</strong> {data.extras.interests}</p>
                </article>
            </section>
        </div>
    );
}