# Montador de Curriculo

Aplicacao full stack para criar, editar e exportar curriculos com apoio de IA.

## O que o app faz

- Edicao de curriculo em interface web.
- Melhoria de texto com IA.
- Importacao de curriculo em PDF.
- Exportacao para PDF e Markdown.
- Suporte de preview por idioma (pt-br, en-us, es).

## Stack

- Backend: FastAPI + Pydantic
- Frontend: React + Vite
- IA: Google Gemini (padrao: gemini-3-flash-preview)
- PDF no backend: pypdf
- PDF no frontend: jsPDF
- Observabilidade opcional: Sentry

## Arquitetura

### Backend

- `app/main.py`: app FastAPI, middlewares, seguranca, rate limit e endpoints.
- `app/settings.py`: configuracao de CORS e seguranca por ambiente.
- `app/ai.py`: cliente Gemini.
- `app/prompts.py`: prompts de improve, translate e import de PDF.
- `app/schemas.py`: modelos Pydantic de entrada e saida.
- `app/services/pdf_import.py`: extracao de texto de PDF.
- `app/services/resume_response.py`: parser/normalizacao da resposta de IA.
- `app/services/logger.py`: log com nivel por ambiente.
- `app/services/observability.py`: inicializacao opcional do Sentry.
- `app/domain/resume_defaults.py`: payload padrao de curriculo vazio.
- `api/index.py`: entrypoint serverless para deploy.

### Frontend

- `frontend/src/App.jsx`: orquestracao dos fluxos da interface.
- `frontend/src/components`: formularios, preview, toolbar, estado tutorial.
- `frontend/src/hooks`: estado local, importacao, idioma de preview, reset com undo, toast.
- `frontend/src/domain`: defaults, normalizacao, utilitarios e cache de traducao.
- `frontend/src/services`: exportacao PDF/Markdown e fluxos de validacao.
- `frontend/src/api`: camada HTTP (JSON e multipart).

## API backend

- `GET /`: health check simples.
- `POST /improve/resume`: melhora o curriculo com IA.
- `POST /translate/resume`: traducao de curriculo (endpoint presente no backend).
- `POST /import/resume/pdf`: importa PDF (limite de 5 MB), extrai texto e estrutura em JSON.

Autenticacao e protecao:

- Header opcional `x-api-key`.
- Se `API_ACCESS_KEY` estiver configurada, a chave passa a ser obrigatoria.
- Rate limit por chave/IP (padrao: 30 req por 60s).

## Configuracao de ambiente

Use os arquivos de exemplo:

- Backend: `.env.example`, `.env.development.example`, `.env.staging.example`, `.env.production.example`
- Frontend: `frontend/.env.example`, `frontend/.env.development.example`, `frontend/.env.staging.example`, `frontend/.env.production.example`

### Backend (`.env` na raiz)

Obrigatorias em producao:

- `APP_ENV`: `production`
- `ALLOWED_ORIGINS`: origens permitidas (sem wildcard)
- `API_ACCESS_KEY`: chave da API
- `GEMINI_API_KEY`: chave Gemini

Comuns:

- `APP_ENV`: `development` | `staging` | `production`
- `ALLOWED_ORIGINS`: lista separada por virgula
- `ALLOWED_ORIGIN_REGEX`: permitido fora de producao
- `API_ACCESS_KEY`: protege endpoints de escrita
- `AI_RATE_LIMIT_REQUESTS`: padrao 30
- `AI_RATE_LIMIT_WINDOW_SECONDS`: padrao 60
- `GEMINI_API_KEY`: chave Gemini
- `GEMINI_MODEL`: padrao `gemini-3-flash-preview`
- `TRUST_PROXY_HEADERS`: `true/false` para ler `x-forwarded-for`
- `LOG_LEVEL`: padrao `INFO`
- `LOG_AI_DEBUG`: `true/false`
- `SENTRY_DSN`: opcional
- `SENTRY_TRACES_SAMPLE_RATE`: opcional (ex: `0.1`)

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL`: base da API (ex: `http://localhost:8000`)
- `VITE_API_ACCESS_KEY`: mesma chave de `API_ACCESS_KEY` (quando usada)

Importante: configure `VITE_API_BASE_URL` sem sufixo `/api`.

## Execucao local

Pre-requisitos:

- Python 3.11+
- Node 20+

### 1) Backend

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.development.example .env
uvicorn app.main:app --reload
```

Backend em: `http://localhost:8000`

### 2) Frontend

```powershell
cd frontend
npm install
copy .env.development.example .env
npm run dev
```

Frontend em: `http://localhost:5173`

Scripts frontend:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Deploy (Vercel)

Use dois projetos apontando para o mesmo repositorio.

### Backend

- Root Directory: raiz
- Entry point: `api/index.py`
- Variaveis recomendadas: `APP_ENV`, `ALLOWED_ORIGINS`, `API_ACCESS_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `AI_RATE_LIMIT_REQUESTS`, `AI_RATE_LIMIT_WINDOW_SECONDS`, `LOG_LEVEL`

### Frontend

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Variaveis: `VITE_API_BASE_URL=https://SEU_BACKEND.vercel.app`, `VITE_API_ACCESS_KEY`
- Fallback de rotas SPA configurado em `frontend/vercel.json`

## Limites e observacoes

- Importacao PDF limitada a 5 MB por arquivo.
- Texto extraido do PDF e enviado ao provedor de IA para estruturacao.
- Traducoes possuem cache em memoria no backend e no frontend.
- Atualmente nao existe suite formal de testes automatizados no repositorio.

## Troubleshooting rapido

- `401 Nao autorizado`: verifique `API_ACCESS_KEY` no backend e `VITE_API_ACCESS_KEY` no frontend.
- `429 Muitas requisicoes`: ajuste limite com `AI_RATE_LIMIT_REQUESTS` e `AI_RATE_LIMIT_WINDOW_SECONDS`.
- Erro de CORS: revise `ALLOWED_ORIGINS` (e `ALLOWED_ORIGIN_REGEX` fora de producao).
- Erro de conexao frontend->backend: confira `VITE_API_BASE_URL`.

## Roadmap

- Ampliar cobertura de testes automatizados.
- Expandir templates de curriculo.
- Evoluir suporte multi-idioma e qualidade de traducao.
- Adicionar provedores/modelos de IA alternativos.
