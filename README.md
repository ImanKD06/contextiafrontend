# ContextIA
```
npm install && cp .env.example .env && npm run dev
```
- `VITE_USE_MOCK=true` usa datos de demostración de `src/mocks/data.ts`. Pon `false` y `VITE_API_URL` para conectar FastAPI.
- Endpoints centralizados en `src/api/*.ts` (constante `EP`). Ajusta la forma de las respuestas en `src/types/index.ts`.
