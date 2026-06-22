# Lifera App Structure

Stage 1 зафиксировал текущую информационную архитектуру и product flow. См. также `PRODUCT_FLOW.md` и `TECH_ARCHITECTURE.md`.

Формула продукта:

```text
Цель → Миссия → Прогресс → XP → Уровень → Достижения → AI-рекомендация
```

Технический маршрут `/habits` в интерфейсе называется **Миссии**. Это регулярные действия пользователя, а не отдельный generic habit tracker.

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Premium SaaS landing |
| `/pricing` | Free / Pro / Ultra plans (public pricing UI) |
| `/login` | Sign in |
| `/register` | Sign up |
| `/onboarding` | Initial life areas, first goal and starter mission |
| `/privacy` | Privacy policy |
| `/terms` | Terms |

Публичная модель тарифов (UI на `/` и `/pricing`, без backend gates):

- **Free** — старт с лимитами и 7-дневной историей
- **Pro** — полноценная личная система без лимитов по ядру
- **Ultra** — глубокий AI, стратегии и расширенная аналитика

## App Routes (core navigation)

| Route | Label | Purpose |
| --- | --- | --- |
| `/dashboard` | Главная | Ecosystem overview, Life Score, XP, next step |
| `/goals` | Цели | Goal CRUD and life area linkage |
| `/goals/[id]` | Цель | Main goal workspace: plan, missions, progress, motivation, recommendation |
| `/goals/wishes` | Карта желаний | Section tab inside goals |
| `/habits` | Миссии | Regular actions powered by the existing habits data layer |
| `/skills` | Навыки | Hard/soft skill context |
| `/health` | Здоровье | Wellness, energy and recovery life-area dashboard |
| `/finance` | Финансы | Financial stability and movement toward goals |
| `/achievements` | Достижения | Locked/unlocked achievements |
| `/ai-assistant` | Ассистент | Rule-based recommendations |
| `/profile` | Профиль | Account, level, XP, life areas |
| `/settings` | Настройки | Account, appearance, privacy, data, plan |
| `/plan` | План | Free/Premium state and demo activation (canonical) |
| `/billing` | — | Technical alias of `/plan` |

## Sidebar layout

**Основное:** Главная, Цели, Миссии, Навыки, Здоровье, Финансы, Достижения, Ассистент.

**Нижний блок:** План, Профиль, Настройки.

Конфигурация: `src/config/navigation.ts`. Рендер: `Sidebar`, `MobileNav` (подмножество: Главная, Цели, Миссии, Навыки, Ещё; в `Ещё` показаны Здоровье, Финансы, Достижения, Ассистент, План, Профиль, Настройки).

## Hidden legacy / internal routes

| Route | Role |
| --- | --- |
| `/challenges` and `/challenges/[id]` | Internal goal-plan/stage layer retained for existing flows |
| `/progress` | Hidden legacy analytics route retained for regression |
| `/wishes` | Redirects to `/goals/wishes` |

## Legacy routes

Middleware redirects (authenticated):

| Route | Target |
| --- | --- |
| `/tasks` | `/dashboard` |
| `/calendar` | `/dashboard` |
| `/projects` | `/dashboard` |
| `/actions` | `/dashboard` |
| `/ai-coach` | `/ai-assistant` |

`/habits` is **not** a legacy route — it is part of core navigation.

## API routes

See `README.md` and `TECH_ARCHITECTURE.md` for the Route Handler list.
