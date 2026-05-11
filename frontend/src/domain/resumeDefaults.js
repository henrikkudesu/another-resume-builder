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
        { role: "", company: "", city: "", period: "", description: "", style: "paragraph" }
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
