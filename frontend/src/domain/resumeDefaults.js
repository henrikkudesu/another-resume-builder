export const STORAGE_KEY = "resume_studio_data_v1";

export const EMPTY_RESUME = {
    personal: {
        name: "",
        city: "",
        country: "",
        phone: "",
        links: ""
    },
    experiences: [
        { role: "", company: "", city: "", period: "", description: "", style: "bullet" }
    ],
    education: [
        { school: "", course: "", city: "", period: "", description: "" }
    ],
    extras: {
        skills: "",
        certifications: "",
        interests: ""
    },
    summary: ""
};

export const JOHN_DOE_RESUME = {
    personal: {
        name: "John Doe",
        city: "Sao Paulo",
        country: "Brasil",
        phone: "+55 11 99999-9999",
        links: "linkedin.com/in/johndoe | github.com/johndoe"
    },
    summary: "Desenvolvedor de software com experiencia em aplicacoes web, APIs e melhoria continua de produtos digitais.",
    experiences: [
        {
            role: "Desenvolvedor Full Stack",
            company: "Acme Tech",
            city: "Sao Paulo",
            period: "2022 - Atual",
            description: "Desenvolvimento de funcionalidades em React e FastAPI, com foco em performance e experiencia do usuario.",
            style: "bullet"
        },
        {
            role: "Analista de Sistemas",
            company: "Nova Systems",
            city: "Sao Paulo",
            period: "2020 - 2022",
            description: "Levantamento de requisitos, criacao de documentacao tecnica e suporte a integracoes entre sistemas.",
            style: "bullet"
        }
    ],
    education: [
        {
            school: "Universidade Exemplo",
            course: "Bacharelado em Ciencia da Computacao",
            city: "Sao Paulo",
            period: "2018 - 2022",
            description: "Formacao com enfase em engenharia de software e arquitetura de sistemas."
        }
    ],
    extras: {
        skills: "React, FastAPI, Python, JavaScript, PostgreSQL",
        certifications: "AWS Cloud Practitioner",
        interests: "Produtos digitais, UX, automacao"
    }
};
