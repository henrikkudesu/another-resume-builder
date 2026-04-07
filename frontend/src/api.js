import { getApiBaseCandidates } from "./api/apiBaseCandidates";
import { postWithFallback } from "./api/postWithFallback";

const API_BASE_CANDIDATES = getApiBaseCandidates();

function request(path, payload) {
    return postWithFallback(API_BASE_CANDIDATES, path, payload);
}

export function improveResume(data) {
    return request("/improve/resume", data);
}

export function translateResume(data, targetLanguage, sourceLanguage = "pt-br") {
    return request("/translate/resume", {
        ...data,
        target_language: targetLanguage,
        source_language: sourceLanguage,
    });
}