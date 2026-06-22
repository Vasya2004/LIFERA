# Design Direction

> **Stage 1 IA lock (2026):** пользовательская IA включает Главную, Цели, Миссии, Навыки, Здоровье, Финансы, Достижения, Ассистента, План, Профиль и Настройки. Карта желаний находится внутри целей (`/goals/wishes`). `/progress` hidden legacy, `/challenges` internal technical layer. См. `APP_STRUCTURE.md` и `PRODUCT_FLOW.md`.

## 1. Название направления

Minimal Premium Life Performance OS

Alternative naming:

Warm Graphite Personal Command Center

## 2. Краткое описание

Lifera должен выглядеть как серьезная персональная операционная система для управления целями, миссиями, сферами жизни, прогрессом, достижениями и AI-рекомендациями.

Lifera не должен выглядеть как игра. Геймификация должна быть встроена как слой данных, который помогает видеть развитие, регулярность и накопительный прогресс, а не как игровой визуальный стиль.

## 3. Главная формула дизайна

Premium productivity SaaS + executive analytics + warm graphite command center + subtle gamification

Color strategy:

Minimal premium neutral interface with warm amber / burnt orange performance accent.

Русская формулировка:

Минималистичная премиальная дизайн-система на warm graphite базе с warm amber / burnt orange акцентом действия, прогресса и достижения.

Визуальное направление:

Minimal Premium Life Performance OS / Warm Graphite Personal Command Center.

## 4. Принципы визуального стиля

- Премиальность: интерфейс должен ощущаться собранным, дорогим и доверительным, без визуального шума и случайных декоративных решений.
- Чистота: экраны должны быть понятными с первого взгляда, с ясной иерархией, аккуратной типографикой и предсказуемыми состояниями.
- Много воздуха: Lifera работает с личными целями и прогрессом, поэтому интерфейс не должен давить плотностью или перегружать пользователя.
- Понятная структура: каждый экран должен быстро отвечать на вопросы "где я", "что важно сейчас" и "какое действие следующее".
- Сильная визуализация прогресса: прогресс по целям, миссиям, XP, уровням и сферам жизни должен быть видимым, но не агрессивным.
- Взрослая геймификация: достижения, streak и уровни должны выглядеть как система персонального роста, а не как детская игра.
- Технологичность без киберпанка: AI и данные должны ощущаться современно, но без перегруза neon-эффектами, сетками, хаотичным glow и sci-fi клише.
- Пригодность для ежедневного использования: интерфейс должен оставаться спокойным, удобным и не утомлять при регулярной работе.
- Теплая энергия: primary accent должен поддерживать фокус, действие, progress momentum и достижения, но не заливать весь интерфейс.

## 5. Dark Theme

Dark theme должен быть основным визуальным направлением для ощущения личного command center, но без ухода в киберпанк.

Принципы:

- near-black / graphite фон;
- темные карточки и панели;
- поверхности чуть светлее базового фона;
- warm amber / burnt orange accent для действия, фокуса, прогресса, XP, Level и milestones;
- bronze/gold оттенки входят в warm accent family для редких premium moments;
- optional subtle indigo detail допустим только для AI Ассистента, если не ломает warm graphite стиль;
- restrained glow только для важных highlights, charts и progress states;
- тонкие borders для разделения поверхностей;
- светлый текст с хорошим контрастом;
- приглушенные secondary-тексты;
- не кислотный neon;
- не cyberpunk overload.

## 6. Light Theme

Light theme должен быть чистым, спокойным и премиальным, без ощущения скучного корпоративного SaaS.

Принципы:

- off-white / warm gray фон;
- белые или слегка теплые карточки;
- мягкие shadows вместо тяжелых рамок там, где нужно отделить поверхность;
- темный текст с ясной иерархией;
- warm amber / burnt orange accent для действий, фокуса, progress highlights и достижений;
- optional subtle indigo detail допустим только для AI Ассистента;
- Apple-like clean feeling;
- аккуратные borders для таблиц, списков и карточек;
- достаточно воздуха между смысловыми блоками;
- не стерильный enterprise-интерфейс;
- не декоративная landing-page композиция.

## 7. Единая theme-система

Dark и light theme должны быть двумя вариантами одной дизайн-системы. Нельзя делать две разные версии интерфейса.

Компоненты должны использовать theme tokens: background, foreground, surface, border, muted, primary warm accent, warm secondary accents, success, warning, danger и progress-related tokens. Логика, сетка, компоненты, размеры, состояния и UX-паттерны должны оставаться одинаковыми. Меняются только цвета, контраст, тени и акценты.

## 8. Геймификация

Геймификация в Lifera - это слой данных, а не декоративная игровая оболочка.

Ключевые элементы:

- XP;
- уровни;
- streak;
- achievements;
- progress bars;
- milestones;
- progress by life areas.

Геймификация должна помогать пользователю видеть развитие, регулярность, долгосрочную динамику и связь действий с целями. Она не должна превращать интерфейс в игру, отвлекать от задач или подменять продуктивность декоративными наградами.

## 9. Что запрещено в дизайне

В Lifera v0.1 запрещены:

- fantasy RPG;
- мечи;
- сундуки;
- монстры;
- мультяшные персонажи;
- кислотные цвета;
- детские награды;
- cyberpunk overload;
- crypto dashboard;
- перегруз карточками;
- рекламный landing-style UI;
- хаотичные glow-эффекты.

## 10. Базовые UI-компоненты

### Sidebar

Sidebar должен быть спокойной навигационной основой приложения. Он показывает структуру продукта, активный раздел и не конкурирует с контентом. Активное состояние должно быть заметным, но не кричащим.

### Topbar

Topbar должен помогать пользователю понимать текущий контекст: раздел, статус, быстрые действия в будущем. Он не должен превращаться в рекламный header или перегруженную панель.

### Dashboard cards

Dashboard должен ощущаться как персональный command center, а не как стена одинаковых карточек. Главная страница использует dominant Hero / Focus Block, краткую сводку XP / Level / Streak, рабочие блоки целей и миссий, рекомендацию Ассистента и поддерживающие widgets достижений и прогресса.

Карточки dashboard должны быть плотными по смыслу, но визуально спокойными. Каждая карточка должна иметь понятную роль в иерархии: главный фокус, ключевая метрика, рабочий список, рекомендация или supporting widget.

Dashboard должен отвечать за 5 секунд: что сегодня главное, какой прогресс, что делать дальше, что держится, что достигнуто и где есть риск просадки.

Не делать 12 одинаковых dashboard cards, случайные графики, crypto-dashboard, game dashboard, перегруженный analytics screen, medical cockpit или finance terminal.

### Branch dashboards (Skills / Health / Finance)

Ветки — compact branch dashboards внутри Lifera OS, не отдельные продукты.

- Общая структура: hero → branch blocks → связанные действия → следующий шаг; create panel в sidebar.
- Skills: neutral/orange accent, level/progress metrics, modal settings, без fake skill tree.
- Health: muted wellness rhythm, compact disclaimer, без medical cockpit.
- Finance: large ₽ metrics, progress to target, без banking terminal imitation.

Не давать медицинских или финансовых обещаний. Не показывать raw keys и EN labels (`Wellness score`, `Target`, `Stability score`).

### Goal cards

Goal cards должны показывать название цели, сферу жизни, статус, прогресс и ближайшее действие. Визуальный акцент - на движении к результату, а не на декоративности.

### Mission cards

Mission cards должны быть простыми, быстрыми для сканирования и удобными для отметки выполнения. Регулярность, streak, XP и статус должны читаться без лишнего текста.

### Progress bars

Progress bars - один из ключевых визуальных паттернов Lifera. Они должны быть точными, спокойными и хорошо работать в dark/light theme. Важны подписи, проценты и контекст прогресса.

### Achievement badges

Achievement badges должны выглядеть как взрослые milestones. Это не игровые медали для детей, а лаконичные маркеры пройденных этапов, уровня и прогресса.

### AI Ассистент cards

AI Ассистент cards должны выглядеть как умные рекомендации, а не чат-игрушка. Важны ясный заголовок, причина рекомендации, ожидаемое действие и возможность принять, отклонить или применить совет в будущем.

### Status badges

Status badges должны быть небольшими, читаемыми и системными. Они используются для статусов миссий, целей, AI-рекомендаций и onboarding.

### Primary/secondary buttons

Primary button используется для главного действия на экране. Secondary button поддерживает альтернативные действия. Кнопки должны быть предсказуемыми, доступными и одинаково работать в обеих темах.

### Empty states

Empty states должны помогать сделать следующий шаг. Тон - спокойный и практичный. Empty state не должен быть маркетинговым блоком, иллюстративной заглушкой или длинным обучающим текстом.

## 11. Навигация

Для Core MVP используется структура:

- sidebar для desktop;
- topbar для текущего контекста;
- mobile navigation для мобильных экранов.

Основные разделы Stage 1:

- Главная;
- Цели;
- Миссии;
- Навыки;
- Здоровье;
- Финансы;
- Достижения;
- Ассистент;
- План;
- Профиль;
- Настройки.

Карта желаний не является пунктом sidebar: она живёт внутри целей. `/progress` не является пунктом sidebar: прогресс встроен в контекстные страницы и hidden legacy route. `/challenges` не является пользовательским разделом: это internal technical layer. Старое UI-название AI Coach не использовать; в интерфейсе использовать "Ассистент".

## 12. Auth и onboarding стиль

Будущие страницы `/auth`, `/register` и `/onboarding` должны соответствовать Adult Gamified Personal OS.

Принципы:

- быть чище и спокойнее, чем основной dashboard;
- поддерживать dark/light theme;
- не использовать OAuth-иконки, пока OAuth не реализован;
- не копировать чужие референсы буквально;
- не превращаться в landing page;
- объяснять ценность коротко, через продуктовый словарь Lifera;
- вести пользователя к первому осмысленному действию.

Словарь Lifera для auth/onboarding:

- вход в систему;
- персональный прогресс;
- первая цель;
- AI Ассистент;
- уровень;
- XP.

## 13. Принципы будущей реализации

- Сначала структура и читаемость, потом декоративные детали.
- Не добавлять сложные анимации до появления рабочей логики.
- Не делать финальный UI всех экранов до реализации основных модулей.
- Улучшать дизайн итерационно после появления реальных данных.
- Любые новые экраны сверять с `docs/DESIGN_DIRECTION.md`.
- Не добавлять визуальные паттерны, которые противоречат Adult Gamified Personal OS.
- Сначала проверять основной пользовательский путь, затем усиливать визуальную выразительность.

## 14. Терминология интерфейса (Stage Q1)

- **Цели** и **миссии** — основные сущности ядра.
- **Опыт** и **уровень** — продуктовые термины геймификации (не «XP» / «Level» в UI).
- **Индекс жизни** — сводный показатель экосистемы (не «Life Score»).
- **Достижения** — milestones без англоязычного «Milestone» в UI.
- **Ассистент Lifera** — честный рекомендательный режим; не называть LLM там, где его нет.
- Планы: **Free / Pro / Ultra**; расширенный доступ вместо «Premium» в пользовательских текстах.

Glossary: `src/lib/domain/labels.ts`.

**Stage 1 (2026):** premium dark command center — layered graphite surfaces, orange accent for focus/progress only, compact app shell, nav «Миссии» at technical route `/habits`.

**Stage 8 (2026):** microinteractions & premium feel — unified toast feedback layer (`ToastProvider`), subtle motion utilities (`motion-lift`, toast slide/fade), loading labels on primary actions, XP/achievement feedback только из API. Toast: dark graphite, orange progress accent, muted red errors, positioned above mobile bottom nav. No confetti, bounce, or RPG motion.

**Stage 9 (2026):** mobile experience pass — centralized `--mobile-page-padding-bottom`, safe-area bottom nav, compact topbar, collapsible challenge detail sidebar on mobile, sheet-style edit modals, `.touch-target` for action menus, horizontal scroll guard (`overflow-x: clip`, `min-w-0`). QA: `node scripts/mobile-qa.mjs` across 375–430px.

## 15. Текущий статус

DESIGN_DIRECTION — актуализирован после Product Quality Pass (Stage Q1 cleanup).

Это не финальная дизайн-система, а зафиксированное направление для разработки Lifera.
