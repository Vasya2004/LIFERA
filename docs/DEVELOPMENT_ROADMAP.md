# Development Roadmap

## Stage 1 — Architecture & Product Flow Lock (completed)

- Final IA: dashboard, goals, challenges, habits, progress, achievements, skills, finance, health, AI assistant; sidebar footer: profile, settings, plan.
- Navigation config, sidebar, mobile nav, middleware (`/habits` protected; legacy redirects unchanged).
- Canonical plan route `/plan`; `/billing` kept as technical alias.
- `docs/PRODUCT_FLOW.md` and `docs/TECH_ARCHITECTURE.md` added.

## Completed Foundation

- Next.js App Router remains the core stack.
- Product navigation focuses on goals, challenges, habits, progress, achievements and AI.
- Supabase clients, middleware and env example added.
- Initial SQL migration with RLS added.
- Route Handlers added for profile, onboarding, goals, challenges, stages, XP, achievements, dashboard, AI and subscription.
- Demo Premium activation added.
- Landing, pricing, login, register, onboarding, dashboard, goals, challenges, progress, achievements, AI, profile, settings and billing pages added or updated.

## Next Work

1. Apply Supabase migration in a real project.
2. Fill `.env.local`.
3. Verify registration, login and onboarding against real Supabase Auth.
4. Add richer edit/delete UI for goals and challenges.
5. Add stage completion controls inside challenge detail pages.
6. Add real OpenAI provider behind the existing AI service interface.
7. Add production analytics and optional Stripe integration.

