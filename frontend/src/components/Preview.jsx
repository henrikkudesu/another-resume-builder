import { getPreviewLabels } from "../domain/resumeLabels";
import { normalizeExperienceDescription } from "../domain/resumeNormalization";

export default function Preview({ data, language = "pt-br" }) {
    const labels = getPreviewLabels(language);
    const location = [data.personal.city, data.personal.country].filter(Boolean).join(" · ")
        || labels.fallbackLocation;
    const contactItems = [data.personal.phone, data.personal.links].filter(Boolean);
    const summaryText = data.summary?.trim() ? data.summary : labels.summaryFallback;

    function renderExperienceDescription(exp) {
        const { bullets, paragraph } = normalizeExperienceDescription(exp);

        if (exp.style === "paragraph") {
            const text = paragraph || labels.missingDescription;
            return <p className={paragraph ? "" : "resume-empty"}>{text}</p>;
        }

        if (bullets.length) {
            return (
                <ul className="resume-list">
                    {bullets.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            );
        }

        return <p className="resume-empty">{labels.missingDescription}</p>;
    }

    function renderMetaText(metaItems) {
        const meta = metaItems.filter(Boolean).join(" · ");
        return meta || labels.emptyField;
    }

    return (
        <div className="resume-preview">
            <header className="resume-header">
                <div className="resume-header-main">
                    <h1>{data.personal.name || labels.fallbackName}</h1>
                    <p>{location}</p>
                </div>
                <div className="resume-contact">
                    {contactItems.length ? contactItems.map((item, index) => (
                        <span key={index} className="resume-contact-pill">{item}</span>
                    )) : (
                        <span className="resume-contact-pill resume-empty">{labels.emptyField}</span>
                    )}
                </div>
            </header>

            <section className="resume-section">
                <div className="resume-section-title">
                    <h3>{labels.summary}</h3>
                </div>
                <p className={data.summary?.trim() ? "resume-paragraph" : "resume-paragraph resume-empty"}>
                    {summaryText}
                </p>
            </section>

            <section className="resume-section">
                <div className="resume-section-title">
                    <h3>{labels.experience}</h3>
                </div>
                <div className="resume-timeline">
                    {data.experiences.map((exp, i) => {
                        const role = exp.role || labels.roleFallback;
                        const company = exp.company || labels.companyFallback;
                        const metaText = renderMetaText([exp.period, exp.city]);
                        const metaClass = (exp.period || exp.city) ? "" : "resume-empty";

                        return (
                            <article key={i} className="resume-item">
                                <div className="resume-item-header">
                                    <strong>{role} · {company}</strong>
                                    <span className={`resume-meta ${metaClass}`}>{metaText}</span>
                                </div>
                                <div className="resume-item-body">
                                    {renderExperienceDescription(exp)}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="resume-section">
                <div className="resume-section-title">
                    <h3>{labels.education}</h3>
                </div>
                <div className="resume-timeline">
                    {data.education.map((edu, i) => {
                        const course = edu.course || labels.courseFallback;
                        const school = edu.school || labels.schoolFallback;
                        const metaText = renderMetaText([edu.period, edu.city]);
                        const metaClass = (edu.period || edu.city) ? "" : "resume-empty";
                        const description = edu.description?.trim();

                        return (
                            <article key={i} className="resume-item">
                                <div className="resume-item-header">
                                    <strong>{course} · {school}</strong>
                                    <span className={`resume-meta ${metaClass}`}>{metaText}</span>
                                </div>
                                {description ? (
                                    <p className="resume-paragraph">{description}</p>
                                ) : (
                                    <p className="resume-paragraph resume-empty">{labels.emptyField}</p>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="resume-section">
                <div className="resume-section-title">
                    <h3>{labels.extras}</h3>
                </div>
                <div className="resume-extras">
                    {[
                        { label: labels.skills, value: data.extras.skills },
                        { label: labels.certifications, value: data.extras.certifications },
                        { label: labels.interests, value: data.extras.interests },
                    ].map((item) => (
                        <div key={item.label} className="resume-extra-item">
                            <span>{item.label}</span>
                            <p className={item.value ? "" : "resume-empty"}>
                                {item.value || labels.emptyField}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}