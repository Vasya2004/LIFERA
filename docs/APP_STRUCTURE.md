# Lifera App Structure

Stage 1 зафиксировал финальную информационную архитектуру и product flow. См. также `PRODUCT_FLOW.md` и `TECH_ARCHITECTURE.md`.

Формула продукта:

```text
Цель → Челлендж / Привычка → Прогресс → XP → Уровень → Достижения → AI-рекомендация
```

Привычки в Lifera — регулярные ритуалы прокачки сфер жизни, а не обычный habit tracker.

## Public Routes

| Route | Purpose |
| --- | --- |
| `/` | Premium SaaS landing |
| `/pricing` | Free / Pro / Ultra plans (public pricing UI) |
| `/login` | Sign in |
| `/register` | Sign up |
| `/onboarding` | Initial life areas, first goal and starter challenge |
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
| `/challenges` | Челленджи | Challenge CRUD and staged progress |
| `/habits` | Привычки | Rituals linked to goals/skills/challenges (full module later) |
| `/progress` | Прогресс | XP, level and progress overview |
| `/achievements` | Достижения | Locked/unlocked achievements |
| `/skills` | Навыки | Skills preview / summary |
| `/finance` | Финансы | Finance summary (manual/demo) |
| `/health` | Здоровье | Wellness summary |
| `/ai-assistant` | AI Ассистент | Rule-based recommendations |
| `/profile` | Профиль | Account, level, XP, life areas |
| `/settings` | Настройки | Account, appearance, privacy, data, plan |
| `/plan` | План | Free/Premium state and demo activation (canonical) |
| `/billing` | — | Technical alias of `/plan` |

## Sidebar layout

**Основное:** Главная.

**Ядро продукта:** Цели, Челленджи, Привычки, Прогресс, Достижения.

**Сферы:** Навыки, Финансы, Здоровье.

**Интеллект:** AI Ассистент.

**Нижний блок:** Профиль, Настройки, План.

Конфигурация: `src/config/navigation.ts`. Рендер: `Sidebar`, `MobileNav` (подмножество: Главная, Цели, Челленджи, Привычки, AI Ассистент).

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
