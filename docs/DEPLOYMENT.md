# Deployment — Lifera

MVP is deployed on Vercel with custom domain **lifera.app**.

**Status:** Production launch green.

## URLs

| Environment | URL |
| --- | --- |
| Production (primary) | [https://lifera.app](https://lifera.app) |
| Vercel alias | `https://lifera.vercel.app` |

## GitHub

- Repository: [https://github.com/Vasya2004/LIFERA](https://github.com/Vasya2004/LIFERA)
- Default branch: `main`

## Vercel

- Platform: Vercel
- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Node: 20+ recommended

## Environment variables

Set in Vercel Project → Settings → Environment Variables. **Do not commit real values.**

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | server-only |
| `DEMO_PREMIUM_ENABLED` | yes | **`false`** in production and preview |
| `NEXT_PUBLIC_SITE_URL` | yes (production) | `https://lifera.app` |
| `OPENAI_API_KEY` | no | reserved for future LLM provider |

Local copy: `.env.example` (placeholders only).

## Supabase

### Migrations

Apply in order via Supabase SQL Editor (or `SUPABASE_DB_URL` helper scripts):

```text
supabase/migrations/0001_lifera_foundation.sql
supabase/migrations/0002_habits_foundation.sql
supabase/migrations/0003_habit_achievements.sql
supabase/migrations/0004_branch_extensions.sql
supabase/migrations/0005_subscription_plans.sql
supabase/migrations/0006_achievement_uniqueness.sql
```

After manual SQL:

```sql
NOTIFY pgrst, 'reload schema';
```

### Authentication URL configuration

Supabase Dashboard → Authentication → URL Configuration:

| Setting | Value |
| --- | --- |
| Site URL | `https://lifera.app` |
| Redirect URLs | `https://lifera.app/**` |
| Redirect URLs (preview) | `https://*.vercel.app/**` |

## Smoke test

Production:

```bash
SMOKE_BASE_URL=https://lifera.app node scripts/smoke.mjs
```

Local (with dev server for route checks):

```bash
npm run dev
node scripts/smoke.mjs
```

Smoke verifies: env, Supabase tables, migrations 0005/0006, stage readiness scripts, and HTTP routes.

Stage 10 production MVP:

```bash
node scripts/production-qa.mjs
node scripts/diploma-qa.mjs
```

Full local Playwright regression (with dev server):

```bash
DIPLOMA_QA_FULL=1 node scripts/diploma-qa.mjs
```

Demo script for diploma defense: `docs/DEMO_SCRIPT.md`.

## Post-deploy checklist

1. `SMOKE_BASE_URL=https://lifera.app node scripts/smoke.mjs` — pass
2. Register → onboarding → dashboard on production
3. `DEMO_PREMIUM_ENABLED=false` on Vercel
4. Supabase Site URL matches production domain

## Related docs

- `README.md` — local run, product overview, checks
- `docs/PRODUCT_FLOW.md` — user flows and production verification
- `docs/TECH_ARCHITECTURE.md` — architecture and env notes
