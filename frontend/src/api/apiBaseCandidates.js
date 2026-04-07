const DEFAULT_LOCAL_API = "http://localhost:8000";
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_LOCAL_API;

function normalizeBaseUrl(rawUrl) {
    const normalized = String(rawUrl || "").trim().replace(/\/$/, "");

    if (!normalized) {
        return DEFAULT_LOCAL_API;
    }

    return normalized;
}

export function getApiBaseCandidates(rawUrl = RAW_API_BASE_URL) {
    const base = normalizeBaseUrl(rawUrl);

    if (/\/api$/i.test(base)) {
        return [base, base.replace(/\/api$/i, "")].filter(Boolean);
    }

    return [`${base}/api`, base];
}
