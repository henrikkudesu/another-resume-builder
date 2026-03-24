import { improveResume } from "../api";
import { isValidResume } from "../domain/resumeNormalization";

export async function improveResumeWithValidation(resume) {
    const data = await improveResume(resume);

    if (!isValidResume(data)) {
        throw new Error("Resposta inválida da API");
    }

    return data;
}
