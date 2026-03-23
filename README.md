# Outro Montador de Curriculo

Aplicacao full stack para montar curriculos com apoio de IA.

## Stack

- Backend: FastAPI + Pydantic
- Frontend: React + Vite
- IA: Google Gemini (`gemini-3-flash-preview` por padrao)

## Estrutura

- `app/`: API FastAPI
- `frontend/`: interface web React
- `requirements.txt`: dependencias do backend

## Ambientes

Este projeto usa configuracao separada para `development`, `staging` e `production`.

### Backend

Arquivos de exemplo na raiz:

- `.env.development.example`
- `.env.staging.example`
- `.env.production.example`

Variaveis principais:

- `APP_ENV`: `development` | `staging` | `production`
- `ALLOWED_ORIGINS`: origens permitidas no CORS, separadas por virgula
- `GEMINI_API_KEY`: chave da API Gemini
- `GEMINI_MODEL`: modelo Gemini (default `gemini-3-flash-preview`)

### Frontend

Arquivos de exemplo em `frontend/`:

- `.env.development.example`
- `.env.staging.example`
- `.env.production.example`

Variavel principal:

- `VITE_API_BASE_URL`: URL base da API

## Setup local

### 1) Backend

Na raiz do projeto:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.development.example .env
```

Preencha `GEMINI_API_KEY` no `.env`.

Inicie a API:

```powershell
uvicorn app.main:app --reload
```

### 2) Frontend

No diretorio `frontend`:

```powershell
npm install
copy .env.development.example .env
npm run dev
```

## Build de producao

### Frontend

```powershell
cd frontend
copy .env.production.example .env
npm run build
```

### Backend

Use variaveis de ambiente de producao e execute sem `--reload`.

Exemplo:

```powershell
$env:APP_ENV="production"
$env:ALLOWED_ORIGINS="https://seu-frontend.com"
$env:GEMINI_API_KEY="SUA_CHAVE"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Git

Repositorio inicializado na raiz com `.gitignore` adequado para Python, Node, ambientes e artefatos de build.

## Deploy no Vercel

Recomendado usar dois projetos no Vercel, apontando para o mesmo repositorio.

Configuracao versionada neste repositorio:

- `vercel.json` na raiz: fixa runtime Python para `api/index.py`
- `frontend/vercel.json`: rewrite SPA para `index.html`

### Projeto 1: Backend (FastAPI)

- Root Directory: raiz do repositorio
- Runtime Python: usa `requirements.txt` da raiz
- Entry point serverless: `api/index.py`

Variaveis de ambiente no projeto backend:

- `APP_ENV=production`
- `ALLOWED_ORIGINS=https://SEU_FRONTEND.vercel.app`
- `GEMINI_API_KEY=...`
- `GEMINI_MODEL=gemini-3-flash-preview`

Endpoint final esperado:

- `https://SEU_BACKEND.vercel.app/api`

Importante: nao use Root Directory em `app`, pois isso remove `api/index.py` e `requirements.txt` do escopo de build.

### Projeto 2: Frontend (Vite)

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Variavel de ambiente no projeto frontend:

- `VITE_API_BASE_URL=https://SEU_BACKEND.vercel.app/api`

### Fluxo de validacao

1. Suba o backend e copie a URL publica.
2. Configure `VITE_API_BASE_URL` no frontend com essa URL.
3. Redeploy do frontend.
4. Teste `POST /improve/resume` pela interface.

## Observacoes

- Nunca versionar arquivos `.env` com segredos.
- Recomendado rotacionar chaves caso tenham sido expostas durante desenvolvimento.
