# Lifera UX Patterns

## Терминология (Stage 1)

В app-части используйте русские product labels: **цели**, **миссии** (user-facing label для технического `/habits`), **карта желаний** внутри целей, **навыки**, **здоровье**, **финансы**, **опыт**, **уровень**, **индекс жизни**, **достижения**, **Ассистент Lifera**. App shell — premium dark command center (`globals.css`, `.app-shell-bg`).

## 1. Назначение документа

Этот документ фиксирует UX-паттерны для Lifera Core MVP на основе анализа реальных интерфейсов login, signup, onboarding, dashboard, productivity apps, AI assistant apps и habit tracking apps.

Документ не является финальным UI-дизайном. Это набор UX-ориентиров, которые нужно использовать при дальнейшей разработке `/auth`, `/register`, `/onboarding`, dashboard и связанных экранов Core MVP.

## 2. Общий UX-подход Lifera

Lifera должен ощущаться как premium personal operating system: серьезная, понятная и ежедневная система для управления целями, миссиями, прогрессом, сферами жизни, достижениями и AI-рекомендациями.

Ключевые установки:

- интерфейс должен быть взрослым, спокойным и пригодным для ежедневного использования;
- геймификация должна быть сдержанной и работать как слой данных;
- **Ассистент Lifera** должен помогать пользователю выбрать следующий практический шаг;
- dashboard должен давать понимание текущего прогресса за 5 секунд;
- визуальная система должна поддерживать ощущение контроля, ясности и накопительного развития.

## 3. Подходящие layout-паттерны

### 1. Split layout для auth/register

Подходит для `/auth` и `/register`.

Паттерн:

- слева смысловой блок Lifera;
- справа компактная форма;
- визуально подходит для premium SaaS;
- помогает объяснить ценность продукта без перегруза;
- не должен выглядеть как агрессивный лендинг.

### 2. Centered card для простого входа

Подходит для быстрого `/auth`, если нужно сделать максимально простой экран входа.

Паттерн:

- одна центральная карточка;
- минимальная форма;
- фокус на действии;
- мало текста;
- вторичные ссылки не конкурируют с primary button.

### 3. Onboarding wizard

Подходит для первичной настройки Lifera.

Паттерн:

- 3-4 шага;
- progress indicator;
- один главный шаг на экране;
- ясное действие для продолжения;
- без игровой "кампании" и без tutorial-стилистики.

### 4. Dashboard command center

Подходит для внутреннего dashboard.

Паттерн:

- sidebar;
- topbar;
- dominant focus block;
- compact progress summary;
- working blocks for actions, habits and goals;
- optional right rail for AI Ассистент;
- ключевые зоны: фокус дня, цели, миссии, XP, сферы жизни, AI Ассистент, Достижения;
- dashboard ощущается как рабочий центр управления, а не как витрина продукта.

### 5. Progress-first layout

Подходит для dashboard и связанных экранов прогресса.

Паттерн:

- крупная сводка прогресса сверху;
- задачи и привычки ниже;
- прогресс является главным смысловым слоем;
- пользователь быстро видит, что изменилось и что делать дальше.

### 6. AI side panel / recommendation card

Подходит для AI Ассистента в первой версии.

Паттерн:

- AI Ассистент показывается как спокойная рекомендация;
- рекомендация объясняет следующий шаг;
- ответ AI не занимает весь экран;
- в первой версии не нужно делать AI Ассистента большим чатом на весь экран.

### 7. Navigation system v0.2

Подходит для основного app shell.

Паттерн:

- desktop использует fixed sidebar + topbar;
- mobile использует bottom navigation только для ключевых разделов;
- topbar показывает контекст и действия, а не заменяет sidebar;
- page tabs используются внутри разделов;
- breadcrumbs появляются только на detail pages;
- command/search input предусмотрен как future pattern.

Stage 1 sidebar order:

1. Главная.
2. Цели.
3. Миссии.
4. Навыки.
5. Здоровье.
6. Финансы.
7. Достижения.
8. Ассистент.
9. План.
10. Профиль.
11. Настройки.

Правила:

- Миссии являются top-level и используют технический `/habits` backend, но не должны превращаться в generic habit tracker.
- Карта желаний доступна только внутри целей: `/goals/wishes`.
- `/challenges` и `/progress` не выводятся в основной UI; это hidden/internal legacy routes.
- Здоровье и Финансы являются top-level life-area разделами.
- Навыки являются top-level разделом.
- AI Coach как UI label не использовать.

## 4. UX-паттерны для /auth

Экран `/auth` должен быть спокойным, прямым и быстрым.

Рекомендуемый паттерн:

- короткий заголовок: "Вход в Lifera";
- отдельная карточка формы;
- минимум полей: email и password;
- ссылка на регистрацию;
- forgot password добавить позже, когда будет реальная auth-логика;
- временная dev-ссылка на dashboard допустима только на этапе разработки;
- не использовать OAuth-кнопки, пока OAuth не реализован;
- визуально: спокойный фон, тонкий border, один primary button.

Основной смысл экрана: пользователь возвращается в свою систему прогресса.

## 5. UX-паттерны для /register

Экран `/register` должен использовать ту же публичную оболочку, что и `/auth`. Регистрация должна ощущаться частью одного продуктового потока, а не отдельной маркетинговой страницы.

Смысловой блок может объяснять Lifera через продуктовый словарь:

- персональный прогресс;
- первая цель;
- AI Ассистент;
- XP.

Форма справа:

- имя;
- email;
- password;
- repeat password.

Правила:

- один CTA: "Создать аккаунт";
- ссылка: "Уже есть аккаунт? Войти";
- не добавлять OAuth-кнопки до реализации OAuth;
- signup не должен выглядеть как агрессивный маркетинговый экран;
- текст должен быть коротким и ориентированным на первый шаг пользователя.

## 6. UX-паттерны для /onboarding

Onboarding — premium setup flow: пользователь собирает стартовую систему прогресса, а не заполняет обычную форму.

**Stage 5 wizard (5 шагов):**

1. **Фокус** — одна сфера жизни (карточки с selected state, orange accent).
2. **Цель** — название + краткий контекст, сфера из шага 1.
3. **Миссия** — рекомендованная стартовая миссия «7 дней системного старта» (5 этапов, без fake-выбора шаблонов).
4. **Миссии** — до 3 рекомендованных регулярных миссий по сфере; создаются через onboarding API, если у пользователя ещё нет habits.
5. **Проверка** — preview системы + checkbox подтверждения + CTA «Создать систему».

Оболочка:

- отдельный onboarding shell (dark premium, lava background, Lifera mark, «Выйти»);
- без public nav / pricing / EN tagline;
- stepper: progress bar + «Шаг N из 5» на mobile;
- loading: «Собираем вашу систему…» → «Система создана» → redirect.

Принципы:

- один главный шаг на экране;
- Lifera-терминология: цель, миссия, опыт, фокус дня;
- без Life RPG / MVP / fake AI;
- idempotent submit — повтор не создаёт дубли goal/mission/rituals.

## 6.1 UX-паттерны для /pricing и /plan

**Value tiers (единый язык):**

- Free — «Стартовая система»
- Pro — «Полная Life OS» (recommended)
- Ultra — «AI-стратег» (subtle premium accent; future AI — «Скоро»)

**/pricing (public):** dark premium cards, цены 0 / 499 / 999 ₽, CTA → register flow, блок «Оплата пока не подключена».

**/plan (in-app):** не billing screen — hero текущего плана, comparison cards, feature matrix, honest «Оплата скоро», без raw provider/status.

**Intended plan:** после `?plan=pro|ultra` — notice «Вы выбрали …, доступ Free до оплаты».

## 7. UX-паттерны для dashboard

Dashboard должен быть сканируемым за 5 секунд и сразу отвечать на вопросы:

- какой главный фокус сегодня;
- какой общий прогресс;
- какие цели активны;
- какие действия нужно выполнить;
- какие привычки держатся;
- что уже достигнуто;
- что рекомендует AI Ассистент;
- какие сферы требуют внимания.

Главная Lifera - это не обычная сетка widgets. Это иерархичная рабочая поверхность, которая отвечает на вопрос: "Что сейчас важно и что мне делать дальше?"

Dashboard hierarchy:

1. Hero / Focus Block - главный блок.
2. XP / Level / Streak - ключевые метрики.
3. Today Tasks, Habits, Goals Progress, AI Ассистент - рабочие блоки.
4. Achievements, nearest reward, life areas / future widgets - поддерживающий долгосрочный прогресс.
5. Health, finance, skills — compact branch dashboards (hero + journal/trend + linked activities + next step), не CRUD-формы на первом экране.

## Branch pages (Skills / Health / Finance)

Единая структура веток:

1. `PageTitle` + primary CTA + «Смотреть прогресс».
2. Branch hero (`PageHeroCard` + metrics).
3. Branch-specific blocks (competencies / journal / trend).
4. `Связанные действия` — goals/missions/rituals по life area.
5. `Следующий шаг` — rule-based recommendation с рабочим CTA.

Позиционирование:

- `/health` — состояние и ритуалы, compact disclaimer «не медицинская рекомендация».
- `/finance` — финансовая устойчивость, `formatCurrency()` (₽), «не финансовая рекомендация».
- `/skills` — развитие компетенций, edit через modal, без inline `<details>` edit.

Верхняя сводка:

- Фокус дня;
- уровень;
- XP;
- streak;
- progress today.

Основная сетка:

- фокус дня;
- активные действия;
- календарный контекст;
- активные цели;
- habit checklist;
- AI Ассистент recommendation;
- achievements / milestones.

Принципы:

- один главный dominant block;
- 2-3 medium-priority blocks;
- остальные compact widgets;
- карточки должны быть функциональными, не декоративными;
- AI Ассистент лучше показывать как next best action;
- XP и achievements показывать как метрики прогресса, а не игровые награды;
- важные показатели должны быть видимыми без чтения длинного текста;
- dashboard не должен превращаться в набор равнозначных карточек без приоритета.

Preferred desktop layout:

- main column: Focus Block, Goals Progress, Today Tasks + Habits, Achievements;
- right rail: AI Ассистент, XP / Level / Streak, Calendar preview / nearest reward.

Mobile order:

1. Focus Block.
2. XP / Level / Streak.
3. AI Ассистент recommendation.
4. Today Tasks.
5. Habits.
6. Goals Progress.
7. Achievements.
8. Future widgets.

Не делать:

- 12 одинаковых карточек;
- случайные графики;
- декоративные widgets без пользы;
- crypto-dashboard;
- game dashboard;
- перегруженный analytics screen;
- medical cockpit;
- finance terminal.

## 8. Dark и Light UX

Dark и light theme должны иметь одинаковую UX-структуру.

Правила:

- меняются только tokens, contrast, shadows и accents;
- нельзя делать разные UX-версии для разных тем;
- структура экранов, сетка, иерархия и компоненты остаются одинаковыми;
- dark theme может ощущаться как command center;
- light theme должна быть чистой, спокойной и Apple-like;
- обе темы должны поддерживать долгую ежедневную работу без визуальной усталости.

## 9. Что нельзя использовать

В Lifera нельзя использовать:

- fantasy RPG visual;
- мечи;
- сундуки;
- персонажи;
- монстры;
- мультяшные бейджи;
- кислотные цвета;
- heavy neon / cyberpunk;
- crypto dashboard aesthetics;
- слишком много glow;
- перегруз карточками;
- лендинговые hero-блоки внутри app screens;
- "level up" как визуальный шум.

Геймификация должна помогать видеть развитие, а не превращать интерфейс в игру.

## 10. 5 ключевых UX-принципов Lifera

1. Один экран - одно главное действие.
2. Прогресс должен быть видимым, но спокойным.
3. AI Ассистент должен помогать выбрать следующий шаг.
4. Dark и light theme должны иметь одинаковую UX-структуру.
5. Dashboard должен быть сканируемым за 5 секунд.

## 11. UX-паттерны Design System v0.2

### Data visualization

Визуализация данных должна помогать принять решение, а не украшать экран. Progress bars, rings, charts, streaks, XP timeline и future finance/health/skills charts должны быть спокойными, читаемыми и не похожими на crypto dashboard или rainbow analytics.

Правила:

- primary orange только для key progress/highlight;
- muted gray для secondary data;
- green/red только для реального статуса;
- charts не должны быть декоративными;
- glow только для milestone/current level.

### Gamification

XP, Level, streak, achievements, milestones и personal rewards должны выглядеть как аналитика личного прогресса.

Запрещено:

- fantasy RPG;
- сундуки;
- мечи;
- персонажи;
- battle pass;
- arcade counters;
- excessive gold;
- confetti overload.

### AI Ассистент

AI Ассистент должен выглядеть как аналитик и планировщик, а не как магический чат.

Паттерны:

- recommendation card;
- insight panel;
- next best action;
- goal breakdown;
- habit suggestions;
- calm loading/error states.

AI-рекомендации должны быть конкретными и связанными с целью, проектом, задачей или привычкой.

### Forms, auth и onboarding

Auth/register/onboarding должны быть спокойными и системными.

Правила:

- labels above fields;
- placeholder не заменяет label;
- error text under field;
- primary CTA orange;
- no OAuth buttons until OAuth is implemented;
- onboarding = настройка персональной ОС, не tutorial игры.

### Empty, loading, error states

Empty state должен вести к действию, а не просто сообщать "пусто".

Examples:

- "Создайте первую цель";
- "Добавьте первую задачу";
- "AI Ассистенту нужны данные";
- "Достижения появятся по мере прогресса".

Loading:

- dashboard uses skeleton;
- forms use button loading;
- AI uses calm loading text.

Error:

- объяснить проблему;
- дать следующий шаг;
- no stack traces;
- no dramatic language.

### Responsive

Mobile не должен быть урезанной версией. Он должен быть проще, но не беднее по смыслу.

Rules:

- desktop: sidebar + topbar + optional right rail;
- tablet: right rail moves below hero;
- mobile: bottom nav, stacked cards, full-width forms;
- body text не меньше 14px;
- tap target минимум 44px.

### Iconography and motion

Иконки:

- outline;
- consistent stroke;
- no cartoon/fantasy/game icons;
- lucide-react можно рассмотреть позже без подключения в рамках docs-задачи.

Motion:

- calm;
- 150-220ms для большинства UI transitions;
- ease-out;
- no bounce;
- no confetti by default;
- respect `prefers-reduced-motion`.

### Feedback system (Stage 8)

Единый feedback layer для ключевых действий пользователя.

**Toast types:**

| variant | use |
| --- | --- |
| `success` | сохранение, создание сущности, достижение |
| `progress` | XP, завершение ритуала/этапа, level up |
| `warning` | plan limit, мягкое предупреждение |
| `error` | ошибка API / сети |
| `info` | повторное действие без XP |

**Toast rules:**

- dark graphite surface, subtle border;
- orange accent для progress/success/action;
- muted red для error;
- auto-dismiss ~4s;
- mobile: viewport выше bottom nav (`bottom: calc(5.5rem + safe-area)`);
- текст на русском, без icon-only meaning;
- optional CTA link (например «Открыть план»).

**XP feedback rules:**

- XP показывается только из API response;
- не начислять XP на client;
- при `alreadyCompleted` — info toast «Повторный опыт не начисляется»;
- achievement unlock — отдельный toast только если API вернул `achievements[]`;
- level up — toast только если level вырос по данным API.

**Loading states:**

- disabled + loading label на русском;
- no double submit;
- examples: «Отмечаем...», «Сохраняем...», «Создаём...», «Завершаем...».

**Inline feedback:**

- plan limit — `PlanLimitAlert` + toast;
- form validation — inline error под полем;
- submit result — toast, не каждый input change.

**Adult gamification microinteractions:**

- subtle motion only: card hover lift 1px, progress bar smooth fill, toast slide/fade;
- no confetti, bounce, particle loops;
- progression moments: button state change, toast +XP, progress refresh — без game voice.

### Mobile layout (Stage 9)

**Viewport targets:** 375, 390, 414, 430px width — no horizontal scroll, no clipped CTAs.

**App shell:**

- bottom nav fixed with safe-area inset;
- `.app-page` adds mobile bottom padding via `--mobile-page-padding-bottom`;
- topbar compact on mobile: truncated title, compact XP pill, «Создать» hidden below `md`;
- primary bottom nav labels: Главная / Цели / Миссии / Навыки / Ещё.
- More menu order starts with Здоровье, Финансы, then Достижения, Ассистент, План, Профиль, Настройки. Карта желаний остаётся вкладкой внутри целей, не пунктом mobile menu.

**More menu:**

- opens above bottom nav;
- scrollable if content exceeds viewport;
- closes on overlay tap / Escape.

**Touch targets:**

- `.touch-target` utility: min 44×44px for icon-only triggers;
- action menus use sheet-style modals on mobile (`place-items-end` + safe-area padding).

**Forms:**

- full-width inputs;
- modal forms scroll inside `.mobile-sheet-panel`;
- submit buttons remain visible; loading labels on submit.

**Toast placement:**

- viewport anchored above `--mobile-nav-height`;
- width `min(22rem, calc(100vw - 2rem))`.

**Page hierarchy on mobile:**

- current state / hero first;
- create forms in sidebar or lower on page;
- destructive actions in menus;
- challenge detail: stages first, edit/manage collapsed by default.

**QA command:** `node scripts/mobile-qa.mjs`

### Accessibility

Baseline:

- sufficient contrast;
- visible focus ring;
- keyboard navigation;
- aria labels for icon-only buttons;
- no color-only status;
- tap targets >= 44px;
- reduced motion support.

### Content style

Основной язык интерфейса - русский.

Tone:

- спокойный;
- взрослый;
- конкретный;
- без инфобизнеса;
- без game voice;
- без токсичной мотивации.

CTA должны быть конкретными: "Создать цель", "Добавить задачу", "Продолжить", "Получить план", "Сохранить".

### Visual QA

Перед сдачей экрана проверить:

- понятна ли иерархия;
- нет ли стены одинаковых карточек;
- primary orange не перегружает экран;
- mobile не ломается;
- light/dark readable;
- empty/loading/error states есть;
- focus visible;
- экран не выглядит как game UI, crypto dashboard, cyberpunk, medical app или random admin template.

## 12. Как использовать этот документ дальше

Перед созданием новых экранов нужно сверяться с `docs/UX_PATTERNS.md` и `docs/DESIGN_DIRECTION.md`.

Практические правила:

- `/auth`, `/register` и `/onboarding` делать по описанным UX-паттернам;
- dashboard проектировать как command center, а не как landing page;
- не добавлять лишние функции до Core MVP;
- не превращать геймификацию в игровой интерфейс;
- AI Ассистент в первой версии показывать как рекомендацию следующего шага;
- навигацию строить по IA: Главная, Цели, Миссии, Навыки, Здоровье, Финансы, Достижения, Ассистент, План, Профиль, Настройки;
- новые UI-решения должны поддерживать Adult Gamified Personal OS.
