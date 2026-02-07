# PandaClender (Phase 1)

Minimal, stable core: Email/password auth + protected dashboard + tasks CRUD. No Google OAuth yet.

## Local setup

1. Install deps

```bash
npm install
```

2. Create `.env` from `.env.example` and fill your anon key

3. Run

```bash
npm run dev
```

Open http://localhost:3000

## Deploy (Vercel)

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Supabase requirements

Tables must exist: `profiles`, `tasks`, `user_progress` with RLS enabled.
