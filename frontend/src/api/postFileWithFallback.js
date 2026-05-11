export async function postFileWithFallback(baseCandidates, path, file, extraFields = {}) {
    let lastError = null;

    for (let i = 0; i < baseCandidates.length; i += 1) {
        const baseUrl = baseCandidates[i];
        let res;

        try {
            const formData = new FormData();
            formData.append("file", file);

            Object.entries(extraFields).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            res = await fetch(`${baseUrl}${path}`, {
                method: "POST",
                body: formData,
            });
        } catch (err) {
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

        if (res.status !== 404) {
            throw lastError;
        }
    }

    throw lastError || new Error("Resposta invalida da API");
}
