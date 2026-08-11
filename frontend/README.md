# Frontend - Montador de Curriculo

Aplicacao React + Vite para montar curriculos, integrar com IA no backend e exportar resultado.

## Funcionalidades

- Edicao completa de curriculo (dados pessoais, resumo, experiencias, educacao e extras).
- Melhoria de curriculo via IA.
- Traducao para idioma de preview (pt-br, en-us, es).
- Importacao de PDF com revisao antes de aplicar.
- Exportacao para PDF e Markdown.
- Persistencia local automatica no navegador.
- Reset com opcao de desfazer.

## Estrutura principal

- `src/App.jsx`: orquestracao dos fluxos principais da UI.
- `src/components/`: formularios, preview, toolbar e componentes visuais.
- `src/hooks/`: estado local, importacao, traducao de preview, toast e reset.
- `src/domain/`: defaults, normalizacao, labels, utilitarios e cache de traducao.
- `src/services/`: fluxos de negocio (improve/import/translate) e exportacoes.
- `src/api/`: camada HTTP (JSON e multipart) e estrategia de chamada.
- `src/i18n/`: idiomas e textos de interface/preview.
- `src/styles/`: tokens e estilos base/componentes/layout/responsivo.

## Requisitos

- Node.js 20+
- npm 10+

## Configuracao de ambiente

Crie `frontend/.env` com base em `frontend/.env.development.example`.

Variaveis:

- `VITE_API_BASE_URL`: URL base do backend (ex: `http://localhost:8000`).
- `VITE_API_ACCESS_KEY`: chave opcional para header `x-api-key`.

Importante:

- Use `VITE_API_BASE_URL` sem sufixo `/api`.

## Execucao local

```powershell
cd frontend
npm install
copy .env.development.example .env
npm run dev
```

Aplicacao em `http://localhost:5173`.

## Scripts

- `npm run dev`: inicia ambiente local com HMR.
- `npm run build`: gera build de producao em `dist`.
- `npm run preview`: sobe build localmente para validacao.
- `npm run lint`: executa ESLint.

## Integracao com API

Chamadas usadas pelo frontend:

- `POST /improve/resume`
- `POST /translate/resume`
- `POST /import/resume/pdf`

Headers:

- `Content-Type: application/json` nas rotas JSON.
- `x-api-key` enviado apenas quando `VITE_API_ACCESS_KEY` estiver definido.

## Build e deploy

- Build: `npm run build`
- Output: `dist`
- Vercel SPA fallback configurado em `vercel.json`

Variaveis de producao:

- `VITE_API_BASE_URL=https://SEU_BACKEND.vercel.app`
- `VITE_API_ACCESS_KEY=<opcional>`

## Troubleshooting

- `401 Nao autorizado`: valide `VITE_API_ACCESS_KEY` e `API_ACCESS_KEY` no backend.
- `429 Muitas requisicoes`: backend com rate limit ativo.
- Erro de CORS: confira `ALLOWED_ORIGINS` no backend.
- Erro de rede no frontend: revise `VITE_API_BASE_URL` e se o backend esta online.
