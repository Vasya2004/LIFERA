# Demo Script — Lifera MVP (диплом / ВКР)

Production URL: [https://lifera.app](https://lifera.app)

Длительность: **8–12 минут**

Подготовка: чистый браузер или incognito, viewport desktop 1280px + mobile 390px для финала.

---

## 1. Вход и ценность (1–2 мин)

1. Открыть **/** — лендинг Lifera.
2. Кратко: «Lifera — personal OS для прогресса: цели, миссии, ритуалы, опыт, уровень, достижения».
3. Показать **/pricing** — Free / Pro / Ultra, честные лимиты, без fake payment.
4. **/register** — создать аккаунт (или заранее подготовленный demo-аккаунт).

**Сказать:** продукт не task-manager и не календарь — это Life RPG loop.

---

## 2. Onboarding — сбор системы (2 мин)

1. Пройти **/onboarding** (5 шагов):
   - сфера фокуса;
   - первая цель;
   - стартовая миссия «7 дней системного старта»;
   - 2–3 ритуала;
   - preview + подтверждение.
2. После submit — redirect на **/dashboard** (или `/plan?selected=…` при intended plan).

**Сказать:** система создаёт реальные сущности в Supabase, без demoProfile на клиенте.

---

## 3. Command center — Dashboard (1–2 мин)

1. **/dashboard** — Фокус дня (hero), индекс жизни, пульс недели.
2. Отметить ритуал из блока «Ритуалы на сегодня» — toast «Ритуал выполнен», +опыт.
3. Показать активную миссию и рекомендацию ассистента.

**Сказать:** за 5 секунд видно — что главное, какой прогресс, что делать дальше.

---

## 4. Core loop (3–4 мин)

| Шаг | Маршрут | Действие |
| --- | --- | --- |
| Цели | `/goals` | Показать карту целей, связь с миссией |
| Миссии | `/challenges` | Continue block, открыть миссию |
| Этап | `/challenges/[id]` | Завершить этап → toast, прогресс, опыт |
| Ритуалы | `/habits` | Checklist «Сегодня», ритм недели |
| Прогресс | `/progress` | Индекс жизни, неделя, сферы |
| Достижения | `/achievements` | Открытое достижение после этапа |
| Ассистент | `/ai-assistant` | Честная рекомендация без fake LLM |

**Сказать:** XP начисляется только на сервере; повторное завершение не даёт duplicate XP.

---

## 5. Ветки и план (1–2 мин)

1. **/skills** — навык + связанные активности (compact branch).
2. **/health** — снимок состояния, disclaimer (не medical app).
3. **/finance** — ₽ метрики, disclaimer (не banking terminal).
4. **/plan** — текущий план, матрица возможностей, CTA «Открыть план» при лимите.

---

## 6. Mobile pass (30 сек)

1. Viewport **390px**.
2. Bottom nav: Главная / Цели / Миссии / Ритуалы / Ещё.
3. Нет horizontal scroll; toast выше nav.

---

## 7. Архитектура (устно, 1 мин)

- Next.js App Router + Supabase Auth/PostgreSQL + RLS.
- Route Handlers для XP, achievements, plan limits.
- Rule-based **Ассистент Lifera** (OPENAI reserved for future).
- Deploy: Vercel, domain lifera.app.

---

## Скриншоты для приложения к ВКР

См. чеклист в `docs/DIPLOMA_NOTES.md` (раздел «Скриншоты MVP»).

Рекомендуемые файлы в `output/diploma/`:

- `01-landing-desktop.png`
- `02-register.png`
- `03-onboarding-focus.png`
- `04-dashboard-focus.png`
- `05-habits-complete-toast.png`
- `06-challenge-stage-complete.png`
- `07-progress.png`
- `08-achievements.png`
- `09-assistant.png`
- `10-plan-mobile.png`

---

## QA перед защитой

```bash
SMOKE_BASE_URL=https://lifera.app node scripts/smoke.mjs
node scripts/production-qa.mjs
node scripts/diploma-qa.mjs
# Полный локальный suite (dev server + .env.local):
DIPLOMA_QA_FULL=1 node scripts/diploma-qa.mjs
```
