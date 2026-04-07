export async function postWithFallback(baseCandidates, path, payload) {
    let lastError = null;

    for (let i = 0; i < baseCandidates.length; i += 1) {
        const baseUrl = baseCandidates[i];
        let res;

        try {
            res = await fetch(`${baseUrl}${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            // If one base path fails due to CORS/network, try the next candidate.
            lastError = err instanceof Error ? err : new Error("Erro de rede ao chamar API");
            continue;
        }

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
