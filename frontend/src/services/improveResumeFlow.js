import { improveResume, translateResume } from "../api";
import { isValidResume } from "../domain/resumeNormalization";

export async function improveResumeWithValidation(resume) {
    const data = await improveResume(resume);

    if (!isValidResume(data)) {
        throw new Error("Resposta inválida da API");
    }

    return data;
}

export async function translateResumeWithValidation(resume, targetLanguage, sourceLanguage = "pt-br") {
    const data = await translateResume(resume, targetLanguage, sourceLanguage);

    if (!isValidResume(data)) {
        throw new Error("Resposta invalida da API");
    }

    return data;
}
