import { importResumeFromPdf } from "../api";
import { isValidResume } from "../domain/resumeNormalization";
import { UI_TEXT } from "../content/uiText.pt-br";

export async function importResumeFromPdfWithValidation(file) {
    const data = await importResumeFromPdf(file);

    if (!isValidResume(data)) {
        throw new Error(UI_TEXT.errors.invalidApiResponse);
    }

    return data;
}
