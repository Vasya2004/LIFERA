# Product Flow Map — Lifera

Lifera — персональная Life RPG-система для управления жизнью.

Формула продукта:

```text
Цель → Челлендж / Привычка → Прогресс → XP → Уровень → Достижения → AI-рекомендация
```

Привычки в Lifera — это регулярные ритуалы прокачки сфер жизни, связанные с целями, навыками, прогрессом и RPG-механикой, а не обычный habit tracker.

## Почему Lifera — не task-manager, habit-tracker и не календарь

| Тип продукта | Фокус | Позиция Lifera |
| --- | --- | --- |
| Task manager | Список дел и дедлайны | Действия появляются **из цели и челленджа**, а не как бесконечный inbox |
| Habit tracker | Streak и ежедневные галочки | Привычки — **ритуалы сфер жизни**, связанные с целями, навыками и XP |
| Calendar-first | Расписание и слоты времени | Время задаёт **миссия (челлендж)** и стратегия (цель), не календарная сетка |

Lifera строится вокруг **Life RPG-цикла**: стратегический результат → ограниченная миссия или регулярный ритуал → измеримый прогресс → геймификация → рекомендация следующего шага.

Legacy-маршруты `/tasks`, `/calendar`, `/projects`, `/actions` намеренно ведут на `/dashboard`, чтобы не возвращать старую task/calendar-логику в ядро продукта.

## Роли сущностей

| Сущность | Роль |
| --- | --- |
| Цель | Стратегический результат |
| Челлендж | Ограниченная по времени миссия / спринт |
| Привычка | Регулярный ритуал прокачки сферы жизни |
| Прогресс | Аналитика движения (XP, уровни, Life Score) |
| XP / уровни / достижения | Взрослая RPG-геймификация |
| AI Ассистент | Стратегический помощник по данным пользователя |
| План | Публично: Free / Pro / Ultra; в приложении demo: Free / Premium до payment provider |

### Цели, челленджи и привычки в одном цикле

- **Цель** задаёт направление: «к чему движемся» в выбранной сфере жизни.
- **Челлендж** переводит цель в ограниченный спринт с этапами и явным XP за завершение этапов.
- **Привычка** поддерживает цель между спринтами: короткий повторяемый ритуал с привязкой к цели, навыку или активному челленджу.

На Stage 1 маршрут `/habits` и навигация зафиксированы. **Stage 4** добавил полноценную бизнес-логику привычек (completion, XP, streak, achievements, dashboard/progress integration, Free limit 5 active).

## Публичный путь пользователя

```text
Лендинг (/) → Регистрация (/register) или Вход (/login)
  → Onboarding (/onboarding) — сферы жизни, первая цель, стартовый челлендж
  → Dashboard (/dashboard)
```

Альтернативные входы:

- `/pricing` — сравнение Free, Pro и Ultra до регистрации (CTA → `/register`, `/register?plan=pro`, `/register?plan=ultra`).
- `/privacy`, `/terms` — юридические страницы.

После регистрации middleware направляет незавершивших onboarding на `/onboarding`. После завершения — на `/dashboard`.

## Production flow (verified)

Production на [https://lifera.app](https://lifera.app) проверен end-to-end:

```text
landing (/) → register → onboarding → dashboard
  → goals / challenges / habits / progress / skills / health / finance / plan
```

- Auth redirects работают через `lifera.app` (`/dashboard` → `/login?next=…`).
- Demo Pro/Ultra отключён на production (`DEMO_PREMIUM_ENABLED=false`, `activate-demo` → 403).
- Smoke: `SMOKE_BASE_URL=https://lifera.app node scripts/smoke.mjs` — passed.

Deploy reference: `docs/DEPLOYMENT.md`.

**Stage 2:** лендинг (`/`) объясняет ценность и ведёт на `/register` или `/pricing`. Auth после входа проверяет `onboarding_completed` и направляет в `/onboarding` или `/dashboard`. Onboarding идемпотентен: повторный submit не создаёт дубли целей/челленджей.

**Stage 3:** `/goals` и `/challenges` — полноценное ядро (квесты, миссии, шаги). Завершение шага через `POST /api/challenges/:id/stages/:stageId/complete` начисляет XP один раз (`xp_transactions` unique по `user_id + source_type + source_id`), обновляет level (`floor(xp_total/500)+1`), прогресс миссии и цели, проверяет achievements server-side.

**Stage 3 — server requirements**

- `SUPABASE_SERVICE_ROLE_KEY` обязателен только на сервере для: insert в `xp_transactions`, update `user_profiles`, unlock `achievements`.
- Route Handlers не отдают service role клиенту; при отсутствии ключа API возвращает понятную 503.
- Dashboard выбирает **активный** шаг (`challenge_stages.status = active`) для primary challenge, не locked-этапы других миссий.
- Free limits: 3 active goals, 2 active challenges — ответ `403` с `code: PLAN_LIMIT` и `upgradeHref: /plan`.
- Plan model: backend `free` / `pro` / `ultra` (migration `0005`; legacy `premium` → `pro`).

**Stage 4 — Habits as RPG Rituals**

- `/habits` — создание, редактирование, архивирование, completion ритуалов.
- `POST /api/habits/:id/complete` — `habit_logs`, XP once per day, streak, achievements via `checkAchievements`.
- Free limit: **5 active habits** — `PLAN_LIMIT` + `/plan` CTA.
- Dashboard block «Ритуалы прокачки»; `/progress` — недельная аналитика ритуалов.
- Migration `0003_habit_achievements.sql` required for habit achievement rows (backfill: `node scripts/apply-migration-0003.mjs`).
- Rule-based AI recommendations include habits (no LLM).

**Stage 5 — Progress / Analytics**

- `/progress` — аналитический центр: Life Score, level, XP (total/weekly/by source), цели, челленджи, привычки, сферы жизни, недельная активность, достижения, rule-based AI insight.
- Domain: `src/lib/domain/progress.ts` → `getProgressData`, `buildProgressInsight`.
- Без demoProfile для авторизованных пользователей; loading/error/empty states.

**Stage 6 — Skills / Health / Finance Branches**

- `/skills` — ветка компетенций: CRUD навыков, archive, связи с goals/challenges/habits, rule-based insight.
- `/health` — wellness-ветка (не медицина): energy/sleep/activity/recovery, wellness score, disclaimer, health life_area activities.
- `/finance` — финансовая ветка (не банк): savings/target/income/expenses snapshot, finance score, disclaimer, finance life_area activities.
- Domain: `skills.ts`, `health.ts`, `finance.ts`, `branches.ts`.
- Migration `0004_branch_extensions.sql` — `skills.status`, notes on metrics tables.
- Readiness: `node scripts/stage6-readiness.mjs`; QA: `node scripts/stage6-branches-qa.mjs`.

**Stage 7 — Plan / Subscription Alignment**

- Единая модель **Free / Pro / Ultra** в landing, `/pricing`, `/plan` и `subscriptions.plan`.
- Migration `0005_subscription_plans.sql` — `premium` → `pro`, `user_profiles.intended_plan`.
- `/register?plan=pro|ultra` сохраняет **намерение**, не оплаченный доступ; после onboarding редирект на `/plan?selected=…`.
- Server-side gates: core limits, premium templates, AI weekly limit (Free), AI generation (Pro+), progress history 7 days (Free).
- Demo Pro/Ultra: `POST /api/subscription/activate-demo` только при `DEMO_PREMIUM_ENABLED=true`.
- Readiness: `node scripts/stage7-readiness.mjs`; QA: `node scripts/stage7-plan-qa.mjs`.

**Stage 3 — duplicate onboarding**

Текущий onboarding идемпотентен. Старые дубли не удаляются автоматически — см. `docs/STAGE3_DUPLICATE_CLEANUP.md`.

## Основной app flow

```text
1. Цель (/goals)
     ↓
2. Челлендж (/challenges) или Привычка (/habits) — ритуал прокачки
     ↓
3. Завершение шага челленджа (server-side XP, один раз на шаг) **или** выполнение ритуала привычки (server-side XP, один раз в день)
     ↓
4. Прогресс (/progress) — XP, уровень, динамика
     ↓
5. Достижения (/achievements) — milestones
     ↓
6. AI-рекомендация (/ai-assistant) — следующий шаг по контексту
```

Сферы и модули расширяют контекст, но не заменяют ядро:

- `/skills` — компетенции, связанные с целями и ритуалами.
- `/health` — wellness-журнал и health-активности (не медицинский сервис).
- `/finance` — финансовые цели и snapshots (не банковский трекер).

## Публичные тарифы (лендинг)

| План | Назначение | Ключевые ограничения / ценность |
| --- | --- | --- |
| **Free** | Старт и знакомство с ядром Life RPG | 3 цели, 2 челленджа, 5 привычек; 3 AI-рекомендации/нед.; история 7 дней |
| **Pro** | Полноценное регулярное использование | Без лимитов по ядру; расширенная аналитика; AI-декомпозиция и генерация; premium-шаблоны; полная история |
| **Ultra** | Глубокий AI, стратегии и отчёты | Всё из Pro + продвинутый AI Ассистент, анализ просадок, персональные стратегии, AI-отчёты, Life Score |

Компонент: `src/components/landing/pricing-section.tsx`. CTA ведут на регистрацию с query `plan`. Query param = **intended plan**, не оплаченный доступ. Реальная оплата — future stage.

## Free / Pro / Ultra flow (in-app)

```text
Pricing (/pricing) → Register (/register?plan=pro|ultra) → intended_plan saved
  → Onboarding → Free active plan (subscriptions.plan = free)
  → Upgrade gate в UI (лимиты, premium templates, AI limits)
  → План (/plan, canonical) или технический alias (/billing)
  → Demo Pro/Ultra (/api/subscription/activate-demo) if DEMO_PREMIUM_ENABLED=true
  → [future] Payment provider webhook → subscriptions.plan = pro|ultra
```

Free лимиты и Pro/Ultra gates проверяются на сервере в `src/lib/domain/subscription.ts`. UI не является источником правды для плана.

## Данные пользователя

```text
Supabase Auth user
  → user_profiles (onboarding, level, XP, life areas, theme)
  → goals
  → challenges → challenge_stages
  → habits → habit_logs (Stage 4: completion, XP, streak, achievements)
  → xp_transactions
  → achievements
  → ai_recommendations
  → subscriptions (plan, provider, demo / future provider ids)
  → skills, health_metrics, finance_metrics (по мере развития модулей)
```

## Навигация (зафиксировано Stage 1)

Основное меню:

1. Главная — `/dashboard`
2. Цели — `/goals`
3. Челленджи — `/challenges`
4. Привычки — `/habits`
5. Прогресс — `/progress`
6. Достижения — `/achievements`
7. Навыки — `/skills`
8. Финансы — `/finance`
9. Здоровье — `/health`
10. AI Ассистент — `/ai-assistant`

Нижний блок sidebar:

11. Профиль — `/profile`
12. Настройки — `/settings`
13. План — `/plan` (canonical; `/billing` — технический alias)

## Legacy redirects

| Legacy route | Redirect |
| --- | --- |
| `/tasks` | `/dashboard` |
| `/calendar` | `/dashboard` |
| `/projects` | `/dashboard` |
| `/actions` | `/dashboard` |
| `/ai-coach` | `/ai-assistant` |

`/habits` не редиректится — это часть финальной IA.
