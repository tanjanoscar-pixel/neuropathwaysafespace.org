# NeuroPathway Ecosystem

**Mission:** Prevention Is the Cure.

NeuroPathway Ecosystem is an AI-assisted early identification and lifelong support platform for neurodivergent children, young people, adults, families, schools, health professionals, social care teams, and commissioners.

Created by **Tanja Hanson**, Founder of NeuroPathway, from lived experience and a commitment to ensure no family experiences preventable systemic failures.

## What is scaffolded

- Executive and technical architecture in `docs/neuro-pathway-architecture.md`.
- Supabase/PostgreSQL schema in `supabase/schema.sql`.
- Next.js 15 + TypeScript + Tailwind scaffold.
- Landing page, professional dashboard, Safe Space page, observations page, EHCP reports page, and commissioner analytics page.
- Initial deterministic risk scoring logic and EHCP report section generation.
- AI prompt templates for evidence summaries, pattern detection, safeguarding, and stakeholder summaries.

## Product modules

1. NeuroPathway Support Platform
2. Safe Space App
3. Adult Support Tracker
4. AI Evidence Engine
5. EHCP Report Generator
6. Professional Dashboard
7. Analytics and Population Insights

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` through migrations or the SQL editor.
3. Configure private storage buckets for documents, voice notes, Safe Space media, and report exports.
4. Add Supabase and OpenAI credentials to `.env.local` and Vercel.

See `docs/neuro-pathway-architecture.md` for architecture, API routes, compliance planning, MVP roadmap, testing strategy, and commercial roadmap.

## Legacy prototype

The earlier static prototype and Express API remain in `frontend/` and `backend/` for reference while the Next.js production scaffold is built out.
