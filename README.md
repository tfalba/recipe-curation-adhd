# Recipe Curation for ADHD

A web app that transforms pasted recipes into structured ingredients and step-by-step, attention-friendly cooking guides. It’s designed around chunked steps, focus mode, and clear visual hierarchy for users with ADHD.

**Deployments**
1. Web: https://recipe-curation-genius.vercel.app
2. API: https://recipe-curation-adhd.onrender.com

**Monorepo Structure**
1. `apps/web`: Vite + React frontend (Tailwind).
2. `apps/api`: Express API with OpenAI integration.
3. `packages`: Shared packages (if/when added).

**Local Development**
1. Install dependencies: `pnpm install`
2. Start API: `pnpm --filter api dev`
3. Start web: `pnpm --filter web dev`

**Environment Variables**
1. API: `OPENAI_API_KEY`, `FRONTEND_URL`, and `PORT` in `apps/api/.env` (see `apps/api/.env.example`)
2. Web: `VITE_API_URL` for API base URL (optional; defaults to `http://localhost:10000`)

**API Endpoints**
1. `POST /api/transform`: convert recipe text into structured ingredients + steps.
2. `POST /api/parse`: upload a PDF and extract recipe text for the inbox.
