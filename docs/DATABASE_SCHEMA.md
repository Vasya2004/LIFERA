# Database Schema

Migrations in `supabase/migrations/` (apply in order):

```text
0001_lifera_foundation.sql
0002_habits_foundation.sql
0003_habit_achievements.sql   — habit achievement seeds + updated signup trigger
0004_branch_extensions.sql    — skills.status, health/finance notes (Stage 6)
0005_subscription_plans.sql — Free / Pro / Ultra plans, intended_plan (Stage 7)
0006_achievement_uniqueness.sql — dedupe + unique index on achievements (pre-deploy)
```

Apply `0003` after `0002` for habit-related achievements (`Первый ритуал`, streak milestones). Idempotent backfill script: `node scripts/apply-migration-0003.mjs`.

Apply `0004` after `0003` for Skills / Health / Finance branches (`skills.status`, optional `note` on metrics). Readiness: `node scripts/stage6-readiness.mjs`.

Apply `0005` after `0004` for subscription alignment (`premium` → `pro`, plan check `free/pro/ultra`, `user_profiles.intended_plan`). Script: `node scripts/apply-migration-0005.mjs`.

Apply `0006` after `0005` to prevent duplicate achievements per user (`achievements_user_condition_unique` partial unique index).

## Tables

### Core (0001)

- `user_profiles`: profile, XP, level, life score, selected life areas, plan (`free`/`pro`/`ultra`), `intended_plan` (registration intent, 0005), onboarding status.
- `goals`: user goals linked to life area and optional skill.
- `challenges`: user challenges and system templates.
- `challenge_stages`: ordered challenge stages with locked/active/completed status.
- `xp_transactions`: immutable XP ledger with idempotency by `(user_id, source_type, source_id)`.
- `achievements`: per-user locked/unlocked achievements.
- `skills`: skill progress — title, category, level, progress, xp_total, status (active/archived, 0004).
- `health_metrics`: manual wellness metrics — metric_type, value, date, optional note (0004).
- `finance_metrics`: manual finance metrics — metric_type, value, date, optional note (0004).
- `ai_recommendations`: generated recommendations.
- `subscriptions`: Free / Pro / Ultra state and provider metadata (`demo`, `manual`, future payment providers).

### Habits (0002)

- `habits`: regular life-area rituals — title, description, `life_area`, `frequency`, `status`, `xp_reward`, `streak_current`, `streak_best`, `linked_goal_id`, `linked_skill_id`, `linked_challenge_id`, `last_completed_at`.
- `habit_logs`: daily completion ledger — `habit_id`, `completed_on` (date), `xp_awarded`. Unique `(habit_id, completed_on)` prevents duplicate XP per day.

### Habit achievements (0003)

Adds four achievement definitions per user:

| Title | condition_type | condition_value |
| --- | --- | --- |
| Первый ритуал | `habit_completions` | 1 |
| Серия 3 дня | `habit_streak` | 3 |
| Серия 7 дней | `habit_streak` | 7 |
| Стабильная прокачка | `habit_completions` | 10 |

Updates `create_lifera_profile()` trigger so new registrations receive habit achievements.

## Free plan limits (server-side)

Enforced in `src/lib/domain/subscription.ts`:

- 3 active goals
- 2 active challenges
- 5 active habits
- 3 AI recommendations per week (Free)
- 7 days progress history display (Free)

Pro and Ultra remove core entity limits, premium templates gate, AI generation gate, and progress history cutoff. Ultra-specific features are mostly **coming soon** in MVP UI.

## Security

RLS is enabled for all personal tables. Owner policies use `auth.uid() = user_id`.

`habits` and `habit_logs` have owner SELECT/INSERT/UPDATE/DELETE (habits) policies.

XP transactions, achievement unlocks, habit completion XP and subscriptions are modified by server/business logic (service role where required), not arbitrary UI code.

## External API / MCP (future)

No `api_tokens`, `agent_action_logs` or MCP tables yet — see `docs/API_ACCESS_FUTURE.md`.
