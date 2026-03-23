const DEFAULT_LOCAL_API = "http://localhost:8000";
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_LOCAL_API;

function normalizeBaseUrl(rawUrl) {
    const normalized = String(rawUrl || "").trim().replace(/\/$/, "");

    if (!normalized) {
        return DEFAULT_LOCAL_API;
    }

    return normalized;
}

function buildApiBaseCandidates(rawUrl) {
    const base = normalizeBaseUrl(rawUrl);

    if (/\/api$/i.test(base)) {
        return [base, base.replace(/\/api$/i, "")].filter(Boolean);
    }

    return [`${base}/api`, base];
}

const API_BASE_CANDIDATES = buildApiBaseCandidates(RAW_API_BASE_URL);

async function request(path, payload) {
    let lastError = null;

    for (let i = 0; i < API_BASE_CANDIDATES.length; i += 1) {
        const baseUrl = API_BASE_CANDIDATES[i];
        const res = await fetch(`${baseUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        let data = null;

        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = null;
        }

        if (res.ok && data) {
            return data;
        }

        const message = data?.detail || text || "Erro ao chamar API";
        lastError = new Error(message);

        // Try the fallback base path only when route was not found.
        if (res.status !== 404) {
            throw lastError;
        }
    }

    throw lastError || new Error("Resposta inválida da API");
}

export function improveResume(data) {
    return request("/improve/resume", data);
}