# Technical Architecture

> **Stage 1 map:** see [`TECH_ARCHITECTURE.md`](./TECH_ARCHITECTURE.md) for the locked frontend/API/Supabase/domain/deployment diagram.

Lifera is a full-stack Next.js application using Supabase Auth and Supabase PostgreSQL.

## Application Layers

- `src/app` contains public pages, protected app pages and Route Handlers.
- `src/components` contains layout, auth, data and UI components.
- `src/lib/supabase` contains browser/server Supabase clients.
- `src/lib/auth` contains session helpers.
- `src/lib/domain` contains centralized business logic for subscription gates, gamification, challenges, dashboard and AI recommendations.
- `supabase/migrations` contains SQL schema and RLS policies.

## Backend Rules

Critical decisions are server-side:

- XP is awarded by `awardXpOnce`.
- Stage completion is handled by `completeStage`.
- Achievements are checked by `checkAchievements`.
- Free/Premium limits are checked by subscription domain helpers.
- AI recommendations are generated through a service layer, currently rule-based.

The UI is not a source of truth for XP, achievements, premium access or ownership.

## Auth And Data

Supabase Auth owns users. `user_profiles` extends auth users. A database trigger creates profile, subscription and starter achievements on registration.

All personal tables use `user_id` and RLS so users can read and mutate only their own data.

## Deployment

Vercel is the preferred runtime. Required env vars are documented in `.env.example` and `README.md`.

## Future: External Access Layer

Not implemented in the web MVP. Architecture is documented in:

- [`API_ACCESS_FUTURE.md`](./API_ACCESS_FUTURE.md) — Public API v1, tokens, scopes, OAuth roadmap
- [`MCP_FUTURE.md`](./MCP_FUTURE.md) — MCP Server v0.1, resources, tools, read-first rollout

Planned modules:

| Module | Role |
| --- | --- |
| **Public API v1** | Stable HTTP contract for mobile, bots, agents |
| **MCP Server** | Agent-native resources and tools over same domain logic |
| **API Tokens** | User-scoped Bearer auth with granular scopes |
| **Agent Action Logs** | Audit trail for write/complete operations |
| **OAuth** | Third-party app consent (post-MVP) |

Clients: web (current), mobile, desktop, Telegram bots, external AI agents.

All external entry points call `src/lib/domain/*` — no duplicate gamification or subscription rules.

**Plans (Stage 6 value pass):** presentation copy and feature matrix live in `src/lib/domain/plan-catalog.ts`. Server gates remain in `subscription.ts` (`FREE_LIMITS`, AI weekly limit, progress history). Payment provider not connected; `intended_plan` stores registration intent only.

