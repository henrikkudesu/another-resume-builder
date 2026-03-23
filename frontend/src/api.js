const DEFAULT_LOCAL_API = "http://localhost:8000";
const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_LOCAL_API;

function resolveApiBaseUrl(rawUrl) {
    const normalized = String(rawUrl || "").trim().replace(/\/$/, "");

    if (!normalized) {
        return DEFAULT_LOCAL_API;
    }

    // Vercel Python functions are exposed under /api by default.
    return /\/api$/i.test(normalized) ? normalized : `${normalized}/api`;
}

const API_BASE_URL = resolveApiBaseUrl(RAW_API_BASE_URL);

async function request(path, payload) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
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

    if (!res.ok) {
        const message = data?.detail || text || "Erro ao chamar API";
        throw new Error(message);
    }

    if (!data) {
        throw new Error("Resposta inválida da API");
    }

    return data;
}

export function improveResume(data) {
    return request("/improve/resume", data);
}