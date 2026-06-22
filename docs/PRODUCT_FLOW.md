# Product Flow Map — Lifera

Lifera — персональная Life RPG-система для управления жизнью.

## Терминология UI (Stage 1)

| В коде / БД | В интерфейсе |
| --- | --- |
| goal | **Цель** |
| challenge | Internal goal-plan/stage layer |
| habit / `/habits` | **Миссия** |
| xp | **Опыт** |
| level | **Уровень** |
| life_score | **Индекс жизни** |
| achievement | **Достижение** |
| progress | Контекстный прогресс внутри разделов; `/progress` hidden legacy |
| wish / `/goals/wishes` | **Желание** / **Карта желаний** |
| ai-assistant | **Ассистент Lifera** |
| free / pro / ultra | **Free / Pro / Ultra** |

Единые presentation labels: `src/lib/domain/labels.ts`.

Формула продукта:

```text
Цель → Миссия → Прогресс → Опыт → Уровень → Достижения → Рекомендация ассистента
```

Технический `/habits` в интерфейсе называется **Миссии**. Миссии — регулярные действия пользователя, связанные с прогрессом, XP и рекомендациями Lifera, а не обычный habit tracker.

**Stage 1 — IA cleanup:** пользовательский продукт строится вокруг Главной, Целей,
Миссий, Навыков, Здоровья, Финансов, Достижений, Ассистента, Плана, Профиля
и Настроек. Карта желаний живёт внутри целей (`/goals/wishes`). `/progress`,
`/challenges` и legacy `/wishes` не являются пунктами основного меню.

## Почему Lifera — не task-manager, habit-tracker и не календарь

| Тип продукта | Фокус | Позиция Lifera |
| --- | --- | --- |
| Task manager | Список дел и дедлайны | Действия появляются **из целей и миссий**, а не как бесконечный inbox |
| Habit tracker | Streak и ежедневные галочки | Миссии — регулярные действия в системе развития, а не отдельный habit tracker |
| Calendar-first | Расписание и слоты времени | Время и регулярность поддерживают цель, но не становятся календарной сеткой |

Lifera строится вокруг **Life RPG-цикла**: стратегический результат → миссия → измеримый прогресс → геймификация → рекомендация следующего шага.

Legacy-маршруты `/tasks`, `/calendar`, `/projects`, `/actions` намеренно ведут на `/dashboard`, чтобы не возвращать старую task/calendar-логику в ядро продукта.

## Роли сущностей

| Сущность | Роль |
| --- | --- |
| Цель | Стратегический результат |
| Челлендж | Внутренний technical layer для существующих goal-plan stages |
| Миссия | Регулярное действие пользователя; технически хранится в `habits` |
| Желание | Визуальный мотиватор, который позже связывается с целью |
| Прогресс | Аналитика движения (XP, уровни, Life Score) |
| XP / уровни / достижения | Взрослая RPG-геймификация |
| AI Ассистент | **Ассистент Lifera** — рекомендательный слой по данным пользователя |
| План | Публично: Free / Pro / Ultra; в приложении demo: Free / Premium до payment provider |

### Цели и миссии в одном цикле

- **Цель** задаёт направление: «к чему движемся» в выбранной сфере жизни.
- **План цели** может использовать существующий challenge/stage backend, но не показывается как отдельный пользовательский раздел.
- **Миссия** поддерживает движение регулярным действием и начисляет XP за выполнение.

На Stage 1 маршрут `/habits` остаётся техническим, а пользовательский label фиксируется как **Миссии**.

## Публичный путь пользователя

```text
Лендинг (/) → Регистрация (/register) или Вход (/login)
  → Onboarding (/onboarding) — 5-step setup: фокус → цель → миссия → ритуалы → проверка
  → Dashboard (/dashboard) или /plan?selected=… при intended_plan pro/ultra
```

Альтернативные входы:

- `/pricing` — сравнение Free, Pro и Ultra до регистрации (CTA → `/register`, `/register?plan=pro`, `/register?plan=ultra`).
- `/privacy`, `/terms` — юридические страницы.

После регистрации middleware направляет незавершивших onboarding на `/onboarding`. После завершения — на `/dashboard`.

## Production flow (verified)

Production на [https://lifera.app](https://lifera.app) проверен end-to-end:

```text
landing (/) → register → onboarding → dashboard
  → goals / goals/wishes / habits / skills / health / finance / achievements / plan
```

- Auth redirects работают через `lifera.app` (`/dashboard` → `/login?next=…`).
- Demo Pro/Ultra отключён на production (`DEMO_PREMIUM_ENABLED=false`, `activate-demo` → 403).
- Smoke: `SMOKE_BASE_URL=https://lifera.app node scripts/smoke.mjs` — passed.
- Stage 10: `node scripts/production-qa.mjs`, `node scripts/diploma-qa.mjs` — production MVP + diploma readiness.

Deploy reference: `docs/DEPLOYMENT.md`. Demo script: `docs/DEMO_SCRIPT.md`.

**Stage 2:** лендинг (`/`) объясняет ценность и ведёт на `/register` или `/pricing`. Auth после входа проверяет `onboarding_completed` и направляет в `/onboarding` или `/dashboard`. Onboarding идемпотентен: повторный submit не создаёт дубли целей/миссий.

**Stage 5 — Onboarding upgrade:** `/onboarding` — premium 5-step wizard (фокус → цель → миссия → ритуалы → preview). Dedicated shell без public nav. `POST /api/onboarding/complete` принимает `starter_rituals[]` (до 3) и создаёт habits только если у пользователя ещё нет записей; XP за создание не начисляется. Recommended mission: «7 дней системного старта» (5 этапов). QA: `node scripts/onboarding-qa.mjs`.

**Stage 3:** `/goals` и internal `/challenges` layer — существующее ядро плана цели и этапов. Завершение шага через `POST /api/challenges/:id/stages/:stageId/complete` начисляет XP один раз (`xp_transactions` unique по `user_id + source_type + source_id`), обновляет level (`floor(xp_total/500)+1`), прогресс плана и цели, проверяет achievements server-side.

**Stage 3 — server requirements**

- `SUPABASE_SERVICE_ROLE_KEY` обязателен только на сервере для: insert в `xp_transactions`, update `user_profiles`, unlock `achievements`.
- Route Handlers не отдают service role клиенту; при отсутствии ключа API возвращает понятную 503.
- Dashboard выбирает **активный** шаг (`challenge_stages.status = active`) для primary challenge, не locked-этапы других миссий.
- Free limits: 3 active goals, 2 active challenges — ответ `403` с `code: PLAN_LIMIT` и `upgradeHref: /plan`.
- Plan model: backend `free` / `pro` / `ultra` (migration `0005`; legacy `premium` → `pro`).

**Stage 4 — Habits as Missions**

- `/habits` — создание, редактирование, архивирование, completion миссий.
- `POST /api/habits/:id/complete` — `habit_logs`, XP once per day, streak, achievements via `checkAchievements`.
- Free limit: **5 active habits** — `PLAN_LIMIT` + `/plan` CTA.
- Dashboard missions block; `/progress` — hidden legacy analytics.
- Migration `0003_habit_achievements.sql` required for habit achievement rows (backfill: `node scripts/apply-migration-0003.mjs`).
- Rule-based AI recommendations include habits (no LLM).

**Stage 5 — Progress / Analytics (hidden legacy route after Stage 1)**

- `/progress` — hidden analytics route retained for regression: Life Score, level, XP, goals, missions, life areas, achievements, rule-based AI insight.
- Domain: `src/lib/domain/progress.ts` → `getProgressData`, `buildProgressInsight`.
- Без demoProfile для авторизованных пользователей; loading/error/empty states.

**Stage 6 — Skills / Health / Finance Branches**

- `/skills` — ветка компетенций: hero «Профиль компетенций», product cards, modal edit, «Фокус развития», «Связанные действия», rule-based «Следующий шаг».
- `/health` — ветка состояния (не медицина): hero «Индекс состояния», журнал, «Ритм недели», disclaimer, health life_area activities.
- `/finance` — ветка устойчивости (не банк): hero «Индекс устойчивости», динамика, история снимков, ₽ formatting, disclaimer, finance life_area activities.
- Domain: `skills.ts`, `health.ts`, `finance.ts`, `branches.ts`.
- Migration `0004_branch_extensions.sql` — `skills.status`, notes on metrics tables.
- Readiness: `node scripts/stage6-readiness.mjs`; QA: `node scripts/stage6-branches-qa.mjs`.

**Stage 6 — Pricing & Plan Value Pass (product)**

- Value model: Free = «Стартовая система», Pro = «Полная Life OS», Ultra = «AI-стратег».
- Shared catalog: `src/lib/domain/plan-catalog.ts` — roles, prices, matrix, coming soon.
- Public `/pricing` + landing `PricingSection` — honest copy, no fake payment.
- In-app `/plan` — `CurrentPlanHero`, `PlanValueCard`, `PlanFeatureMatrix`, `SelectedPlanNotice`, `PlanPaymentNotice`.
- Оплата не подключена; `intended_plan` сохраняет намерение; demo только при `DEMO_PREMIUM_ENABLED=true`.
- QA: `node scripts/plan-qa.mjs` (alias: `stage7-plan-qa.mjs`).

**Stage 7 — Plan / Subscription Alignment (backend)**

- Единая модель **Free / Pro / Ultra** в landing, `/pricing`, `/plan` и `subscriptions.plan`.
- Migration `0005_subscription_plans.sql` — `premium` → `pro`, `user_profiles.intended_plan`.
- `/register?plan=pro|ultra` сохраняет **намерение**, не оплаченный доступ; после onboarding редирект на `/plan?selected=…`.
- Server-side gates: core limits, premium templates, AI weekly limit (Free), AI generation (Pro+), progress history 7 days (Free).
- Demo Pro/Ultra: `POST /api/subscription/activate-demo` только при `DEMO_PREMIUM_ENABLED=true`.
- Readiness: `node scripts/stage7-readiness.mjs`; QA: `node scripts/plan-qa.mjs`.

**Stage 3 — duplicate onboarding**

Текущий onboarding идемпотентен. Старые дубли не удаляются автоматически — см. `docs/STAGE3_DUPLICATE_CLEANUP.md`.

## Основной app flow

```text
1. Цель (/goals)
     ↓
2. Миссия (/habits) или план цели (internal `/challenges` layer)
     ↓
3. Завершение этапа плана (server-side XP, один раз на шаг) **или** выполнение миссии (server-side XP, один раз в день)
     ↓
4. Прогресс — XP, уровень, динамика внутри dashboard/целей/миссий
     ↓
5. Достижения (/achievements) — milestones
     ↓
6. AI-рекомендация (/ai-assistant) — следующий шаг по контексту
```

Сферы и модули расширяют контекст, но не заменяют ядро:

- `/skills` — компетенции как branch dashboard: hero, cards, modal settings, связи с целями/миссиями/ритуалами.
- `/health` — журнал состояния и ритм недели (не медицинский сервис).
- `/finance` — финансовые снимки и прогресс к цели (не банковский трекер).

## Публичные тарифы (лендинг)

| План | Роль | Ключевая ценность |
| --- | --- | --- |
| **Free** | Стартовая система | До 3 целей, 2 миссий, 5 ритуалов; базовый прогресс; рекомендации Lifera; история 7 дней |
| **Pro** | Полная Life OS | Без лимитов ядра; полная история; Pro-шаблоны; rule-based генерация миссий; расширенные рекомендации |
| **Ultra** | AI-стратег | Всё из Pro + расширенный рекомендательный слой; стратегические отчёты и AI-режим — **Скоро** |

Компоненты: `src/components/landing/pricing-section.tsx`, `src/components/billing/*`, данные — `plan-catalog.ts`. CTA → `/register` / `?plan=pro|ultra`. Query = **intended plan**, не оплаченный доступ. Реальная оплата — future stage.

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
3. Миссии — `/habits`
4. Навыки — `/skills`
5. Здоровье — `/health`
6. Финансы — `/finance`
7. Достижения — `/achievements`
8. Ассистент — `/ai-assistant`

Нижний блок sidebar:

9. План — `/plan` (canonical; `/billing` — технический alias)
10. Профиль — `/profile`
11. Настройки — `/settings`

`/goals/wishes` — вкладка внутри раздела «Цели». Legacy `/wishes` редиректит на `/goals/wishes`.
`/progress` остаётся hidden legacy route. `/challenges` и `/challenges/[id]`
остаются internal technical layer для существующих stage/XP flows, но не являются
пунктами пользовательской навигации.

## Legacy redirects

| Legacy route | Redirect |
| --- | --- |
| `/tasks` | `/dashboard` |
| `/calendar` | `/dashboard` |
| `/projects` | `/dashboard` |
| `/actions` | `/dashboard` |
| `/ai-coach` | `/ai-assistant` |

`/habits` не редиректится — это часть финальной IA.

## Stage 10 — Final MVP QA & Diploma Readiness

Production MVP на [https://lifera.app](https://lifera.app) проверяется без изменения backend logic:

| Check | Command |
| --- | --- |
| Unified smoke | `SMOKE_BASE_URL=https://lifera.app node scripts/smoke.mjs` |
| Production routes + auth | `node scripts/production-qa.mjs` |
| Diploma orchestrator | `node scripts/diploma-qa.mjs` |
| Full local Playwright | `DIPLOMA_QA_FULL=1 node scripts/diploma-qa.mjs` |

Документация для защиты:

- `docs/DEMO_SCRIPT.md` — сценарий демонстрации 8–12 мин
- `docs/DIPLOMA_NOTES.md` — чеклист скриншотов, формулировки для ВКР
- `output/diploma/` — папка для финальных скриншотов

Ограничения production: `DEMO_PREMIUM_ENABLED=false`, demo activation → 403, без mock data для auth users.

## Stage B — Goal Detail Workspace

`/goals/[id]` становится главным рабочим пространством конкретной цели:

```text
Цель → План цели → Миссии → Прогресс → Желание/мотивация → Рекомендация ассистента
```

Правила Stage B:

- `/challenges` не удаляется: миссии остаются техническим route и API, но в IA воспринимаются как **план цели**.
- `/goals/[id]` показывает реальную цель текущего пользователя, связанные миссии, этапы, прогресс и rule-based рекомендацию.
- Завершение этапов и миссий использует существующие server-side XP flows.
- Карта желаний пока без migration: блок мотивации честно показывает место будущей связи желания с целью.
- Для auth users не использовать mock/demo data.
