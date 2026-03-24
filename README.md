# Outro Montador de Curriculo

Aplicacao full stack para montar curriculos com apoio de IA.

## Stack

- Backend: FastAPI + Pydantic
- Frontend: React + Vite
- IA: Google Gemini (`gemini-3-flash-preview` por padrao)

## Estrutura

- `app/`: API FastAPI
- `api/index.py`: entrypoint serverless
- `frontend/`: interface web React
- `requirements.txt`: dependencias do backend

## Configuracao

### Backend (`.env` na raiz)

- `APP_ENV`: `development` | `staging` | `production`
- `ALLOWED_ORIGINS`: origens permitidas no CORS, separadas por virgula
- `GEMINI_API_KEY`: chave da API Gemini
- `GEMINI_MODEL`: modelo Gemini (opcional)

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL`: URL base da API

## Execucao local

### 1) Backend

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.development.example .env
uvicorn app.main:app --reload
```

### 2) Frontend

```powershell
cd frontend
npm install
copy .env.development.example .env
npm run dev
```

## Deploy (Vercel)

Use dois projetos apontando para o mesmo repositorio.

### Backend

- Root Directory: raiz
- Entry point: `api/index.py`
- Variaveis: `APP_ENV`, `ALLOWED_ORIGINS`, `GEMINI_API_KEY`, `GEMINI_MODEL`

### Frontend

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Variavel: `VITE_API_BASE_URL=https://SEU_BACKEND.vercel.app/api`

## Metas

- Adicionar mais templates de currículos diferentes.
- Mais idiomas (inglês, espanhol).
- Adicionar mais modelos de IAs diferentes.

### Observações

- App totalmente vibecodado. Apliquei somente conceitos de arquitetura de software e código limpo, o máximo que consegui. Não testei a fundo. Usei o gemini-3-flash-preview como modelo de IA porque é de graça.
