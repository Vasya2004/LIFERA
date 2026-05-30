# Lifera

Lifera is a Next.js product prototype for a personal Life RPG system: goals, time-boxed challenges, life-area rituals (habits), progress, XP, levels, achievements and rule-based AI recommendations.

Core product loop:

```text
goal -> challenge or habit -> progress -> XP -> level -> achievements -> AI recommendation
```

Lifera is not a task manager or calendar-first app. Habits in Lifera are regular rituals for leveling up life areas, not a generic habit tracker.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth
- Supabase PostgreSQL + RLS
- Next.js Route Handlers
- Server-side XP and achievement logic
- Demo Free/Pro/Ultra subscription logic (in-app); public landing uses the same Free / Pro / Ultra model

## Local Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

Without Supabase env vars, public UI can render with demo fallback data. Real auth, database writes, XP, achievements and subscription actions require Supabase.

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
DEMO_PREMIUM_ENABLED=false
```

Copy from `.env.example`:

```bash
cp .env.example .env.local
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and required for critical writes that must not be exposed to the browser: XP transactions, achievement unlocks and demo subscription activation.

`DEMO_PREMIUM_ENABLED=true` enables demo Pro/Ultra activation on `/plan` and `POST /api/subscription/activate-demo` **only in local/dev**. Keep `false` (default) in production and preview.

`OPENAI_API_KEY` is reserved for a future LLM provider. The current MVP AI assistant is rule-based.

Optional for migration scripts:

```bash
SUPABASE_DB_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## Supabase Setup

1. Create a Supabase project.
2. Enable email/password auth.
3. Copy project URL and anon key to `.env.local`.
4. Copy service role key to `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
5. Apply SQL migrations in order:

```text
supabase/migrations/0001_lifera_foundation.sql
supabase/migrations/0002_habits_foundation.sql
supabase/migrations/0003_habit_achievements.sql
supabase/migrations/0004_branch_extensions.sql
supabase/migrations/0005_subscription_plans.sql
supabase/migrations/0006_achievement_uniqueness.sql
```

Migration `0001` creates core Life RPG tables. Migration `0002` adds `habits` and `habit_logs`. Migration `0003` adds habit achievements and updates the signup trigger. Migration `0004` adds `skills.status`, `skills.updated_at`, and optional `note` on health/finance metrics (Stage 6 branches). Migration `0005` aligns subscriptions with Free / Pro / Ultra, migrates legacy `premium` → `pro`, and adds `user_profiles.intended_plan` (Stage 7). Migration `0006` deduplicates achievements and adds a unique index on `(user_id, condition_type, condition_value)` (pre-deploy).

If you cannot run SQL directly, apply achievement backfill with:

```bash
node scripts/apply-migration-0003.mjs
```

Then run the full `0003` file in Supabase SQL Editor to update `create_lifera_profile()` for new users.

For `0004`, either paste `supabase/migrations/0004_branch_extensions.sql` in Supabase SQL Editor, or run:

```bash
SUPABASE_DB_URL=postgresql://... node scripts/apply-migration-0004.mjs
```

For `0005`, either paste `supabase/migrations/0005_subscription_plans.sql` in Supabase SQL Editor, or run:

```bash
SUPABASE_DB_URL=postgresql://... node scripts/apply-migration-0005.mjs
```

For `0006`, paste `supabase/migrations/0006_achievement_uniqueness.sql` in Supabase SQL Editor (dedupe + unique index on achievements).

After SQL in the editor, reload PostgREST schema:

```sql
NOTIFY pgrst, 'reload schema';
```

Verify: `node scripts/stage6-readiness.mjs`

- `user_profiles`
- `goals`
- `challenges`
- `challenge_stages`
- `xp_transactions`
- `achievements`
- `habits`
- `habit_logs`
- `skills`
- `health_metrics`
- `finance_metrics`
- `ai_recommendations`
- `subscriptions`

It also enables RLS and creates an auth trigger that provisions profile, subscription and starter achievements after registration.

## Product Routes

Public:

- `/`
- `/pricing`
- `/login`
- `/register`
- `/privacy`
- `/terms`

Protected:

- `/onboarding`
- `/dashboard`
- `/goals`
- `/challenges`
- `/challenges/[id]`
- `/habits`
- `/progress`
- `/skills`
- `/health`
- `/finance`
- `/achievements`
- `/ai-assistant`
- `/profile`
- `/settings`
- `/plan` (canonical Free/Premium UI)
- `/billing` (technical alias of `/plan`)

Legacy routes (`/tasks`, `/calendar`, `/projects`, `/actions`) redirect to `/dashboard`. `/ai-coach` redirects to `/ai-assistant`. See `docs/PRODUCT_FLOW.md` and `docs/APP_STRUCTURE.md`.

## Core Flows (Stage 2 entry + Stage 3 loop)

**Stage 2 — public entry**

1. Open `/` (landing) and start at `/register`.
2. Register at `/register` (or sign in at `/login`).
3. If email confirmation is enabled, confirm email and log in.
4. Complete `/onboarding` (goal, challenge, stages — idempotent).
5. Open `/dashboard` with starter goal and challenge.

**Stage 3 — Life RPG loop (requires `SUPABASE_SERVICE_ROLE_KEY`)**

6. Open `/challenges/[id]` and complete the active step (server-side XP, one time per step).
7. Confirm in Supabase / UI: `challenge_stages.status`, `xp_transactions`, `user_profiles.xp_total`, `level`, challenge/goal `progress`, unlocked `achievements`.
8. Refresh `/dashboard` — XP, level, next step and recent achievements update from real data (no demo fallback on dashboard).
9. Free limits: 3 active goals, 2 active challenges, 5 active habits — server returns `PLAN_LIMIT` with link to `/plan`.
10. Activate demo Premium in `/plan` when testing unlimited creation (`DEMO_PREMIUM_ENABLED=true` in `.env.local`).

**Stage 4 — Habits as RPG Rituals**

11. Open `/habits`, create a ritual, complete it once per day for XP.
12. Confirm: `habit_logs`, `streak_current`, `streak_best`, `last_completed_at`, dashboard block «Ритуалы прокачки», progress analytics.
13. Apply migration `0003` (or `node scripts/apply-migration-0003.mjs`) for habit achievements.
14. Readiness: `node scripts/stage4-readiness.mjs`. QA: `node scripts/stage45-habits-qa.mjs`.

**Stage 5 — Progress / Analytics**

15. Open `/progress` for Life Score, XP analytics, life areas, weekly activity, goals/challenges/habits summaries, achievements, AI progress insight.
16. Data layer: `src/lib/domain/progress.ts` (`getProgressData`).

**Stage 6 — Skills / Health / Finance Branches**

17. Open `/skills` — create/edit/archive skills; link via goals (`skill_id`) and habits (`linked_skill_id`).
18. Open `/health` — wellness snapshot (energy, sleep, activity, recovery) with optional note; disclaimer visible; health life_area activities.
19. Open `/finance` — savings snapshot and stability score with optional note; disclaimer visible; finance life_area activities.
20. Apply migration `0004` (`node scripts/apply-migration-0004.mjs` or Supabase SQL Editor) for `skills.status` and metric notes.
21. Readiness: `node scripts/stage6-readiness.mjs`. QA: `node scripts/stage6-branches-qa.mjs` (create/edit/archive skills, metrics with notes, mobile, regression).

**Stage 7 — Plan / Subscription Alignment**

22. Open `/plan` — current plan, limits, Free / Pro / Ultra comparison, demo activation (if `DEMO_PREMIUM_ENABLED=true`).
23. Register with `?plan=pro` or `?plan=ultra` — saves `intended_plan` only; paid access stays Free until demo or future payment.
24. Apply migration `0005` (`node scripts/apply-migration-0005.mjs` or Supabase SQL Editor).
25. Readiness: `node scripts/stage7-readiness.mjs`. QA: `node scripts/stage7-plan-qa.mjs`.

Unified plan model: backend `free` / `pro` / `ultra`. Legacy `premium` migrates to `pro`. Payment provider is a future stage.

Manual duplicate cleanup: `docs/STAGE3_DUPLICATE_CLEANUP.md`.

## API Routes

- `GET /api/me`
- `PUT /api/me`
- `POST /api/onboarding/complete`
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`
- `GET /api/challenges`
- `POST /api/challenges`
- `PUT /api/challenges/:id`
- `DELETE /api/challenges/:id`
- `GET /api/challenges/templates`
- `GET /api/challenges/:id/stages`
- `POST /api/challenges/:id/stages/:stageId/complete`
- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/:id`
- `DELETE /api/habits/:id` (archive)
- `POST /api/habits/:id/complete`
- `GET /api/skills`
- `POST /api/skills`
- `PUT /api/skills/:id`
- `PATCH /api/skills/:id` (archive)
- `GET /api/health/metrics`
- `POST /api/health/metrics`
- `GET /api/finance/metrics`
- `POST /api/finance/metrics`
- `GET /api/xp/history`
- `GET /api/achievements`
- `GET /api/dashboard`
- `GET /api/ai/recommendations`
- `POST /api/ai/generate-challenge`
- `GET /api/ai/next-step`
- `GET /api/subscription`
- `POST /api/subscription/activate-demo`

## Public pricing (landing)

Marketing plans on `/` and `/pricing`:

- **Free** — старт: лимиты по целям/челленджам/привычкам, 3 AI-рекомендации в неделю, история 7 дней
- **Pro** — основной платный: без лимитов по ядру, расширенная аналитика, AI-декомпозиция/генерация, полная история
- **Ultra** — глубокий AI и аналитика: стратегии, AI-отчёты, Life Score, ultra-достижения

CTAs lead to `/register` with optional `?plan=pro` or `?plan=ultra`. Query param saves **intended plan** only — not paid access. Real payment provider is a future stage.

## Subscription Logic

Plan tiers (backend + UI): **Free**, **Pro**, **Ultra**. Legacy `premium` values migrate to `pro`.

Free limits (server-side in `src/lib/domain/subscription.ts`):

- 3 active goals
- 2 active challenges
- 5 active habits
- 3 AI recommendations per week
- 7 days progress history
- basic achievements (including habit milestones after migration 0003)
- basic rule-based AI recommendations

Pro unlocks: unlimited core entities, premium challenge templates, AI challenge generation, full progress history.

Ultra (MVP): same server access as Pro; advanced AI/analytics features marked **coming soon** in `/plan`.

Demo Pro/Ultra: `/plan` + `POST /api/subscription/activate-demo` when `DEMO_PREMIUM_ENABLED=true`. Subscription schema keeps `provider` fields for Stripe, ЮKassa or another payment provider later.

Architecture and flow maps: `docs/PRODUCT_FLOW.md`, `docs/TECH_ARCHITECTURE.md`.

## Production deploy checklist

### Vercel environment

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | server-only; never expose to client |
| `DEMO_PREMIUM_ENABLED` | yes | **`false`** in production and preview |
| `OPENAI_API_KEY` | no | reserved for future LLM provider |
| `NEXT_PUBLIC_SITE_URL` | no | production URL for OG metadata (e.g. `https://yourdomain.com`) |

Build settings:

- Framework: **Next.js**
- Build command: `npm run build`
- Install command: `npm install`
- Node: 20+ recommended

### Supabase

1. Apply migrations **0001 → 0006** in order (SQL Editor or `SUPABASE_DB_URL` scripts).
2. Confirm **RLS enabled** on all personal tables.
3. **Authentication → URL configuration:**
   - Site URL: production domain
   - Redirect URLs: production domain + Vercel preview pattern if needed (`https://*.vercel.app/**`)
4. Decide **email confirmation** on/off for MVP launch.
5. Review auth email templates later.

After SQL in the editor:

```sql
NOTIFY pgrst, 'reload schema';
```

### Pre-deploy smoke

Local:

```bash
npm run dev
node scripts/smoke.mjs
```

Without dev server, smoke still checks env, Supabase tables, and stage readiness scripts. Route checks require `npm run dev` or `SMOKE_BASE_URL=https://your-preview.vercel.app node scripts/smoke.mjs`.

Optional E2E (Playwright, slower):

```bash
node scripts/stage45-habits-qa.mjs
node scripts/stage6-branches-qa.mjs
node scripts/stage7-plan-qa.mjs
node scripts/stage55-progress-qa.mjs
```

### Vercel deploy flow

1. Push to GitHub.
2. Import project in Vercel; add env vars above.
3. Deploy preview → run smoke against preview URL if needed.
4. Deploy production → connect custom domain (see below).
5. Update Supabase Site URL / redirect URLs to production domain.
6. Register a test user and walk the core loop on production.

## Deployment on Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add all variables from the checklist above (`DEMO_PREMIUM_ENABLED=false` in production).
4. Use the default build command:

```bash
npm run build
```

5. Deploy.
6. Register a test user and run the core flow above in production.

## Domain Connection

In Vercel:

1. Open Project Settings -> Domains.
2. Add your domain.
3. Add the DNS records shown by Vercel at your DNS provider.
4. Wait for DNS propagation.
5. Verify SSL is issued.
6. Set the domain as primary.

## Checks

```bash
npm run lint
npm run build
node scripts/smoke.mjs
node scripts/stage3-readiness.mjs
node scripts/stage4-readiness.mjs
node scripts/stage6-readiness.mjs
node scripts/stage7-readiness.mjs
node scripts/stage45-habits-qa.mjs
node scripts/stage7-plan-qa.mjs
```
