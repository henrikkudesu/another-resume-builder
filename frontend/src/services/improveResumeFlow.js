import { improveResume, translateResume } from "../api";
import { isValidResume } from "../domain/resumeNormalization";
import { UI_TEXT } from "../content/uiText.pt-br";

export async function improveResumeWithValidation(resume) {
    const data = await improveResume(resume);

    if (!isValidResume(data)) {
        throw new Error(UI_TEXT.errors.invalidApiResponse);
    }

    return data;
}

export async function translateResumeWithValidation(resume, targetLanguage, sourceLanguage = "pt-br") {
    const data = await translateResume(resume, targetLanguage, sourceLanguage);

    if (!isValidResume(data)) {
        throw new Error(UI_TEXT.errors.invalidApiResponse);
    }

    return data;
}
