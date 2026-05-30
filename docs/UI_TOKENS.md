# UI Tokens: Lifera

## Назначение

Этот документ фиксирует базовый theme token baseline для Lifera Core MVP. Токены нужны, чтобы public routes, internal app shell и будущие экраны использовали одну визуальную основу в направлении Adult Gamified Personal OS.

Это не финальная дизайн-система. Это минимальная light/dark-ready база для аккуратной разработки UI без подключения shadcn/ui, next-themes или сторонних библиотек.

## Theme tokens

Базовые CSS variables находятся в `src/app/globals.css`.

Основные токены:

- `--background` - общий фон приложения.
- `--foreground` - основной цвет текста.
- `--surface` - базовые карточки и панели.
- `--surface-muted` - вторичные поверхности и спокойные hover states.
- `--surface-elevated` - более заметные поверхности.
- `--border` - тонкие границы.
- `--border-strong` - более выраженные границы.
- `--border-primary-subtle` - мягкая warm orange граница для active/progress/focus containers.
- `--border-primary-strong` - более заметная warm orange граница для selected/important states.
- `--muted` - приглушенная поверхность.
- `--muted-foreground` - вторичный текст.
- `--overlay` - затемнение под modal, drawer и command palette.
- `--primary` - warm amber / burnt orange акцент для главного CTA, active navigation, selected state, XP/Level highlight и редких milestone moments.
- `--primary-hover` - hover/pressed state для primary.
- `--primary-soft` - мягкий warm orange для highlights.
- `--primary-subtle` - спокойный warm orange фон.
- `--primary-foreground` - текст на primary.
- `--accent-warm` - amber highlight.
- `--accent-copper` - copper accent для глубоких premium highlights.
- `--accent-gold` - muted gold accent для редких milestone/premium moments.
- `--success`, `--success-subtle`, `--success-foreground` - выполнено, положительная динамика и completion progress.
- `--warning`, `--warning-subtle`, `--warning-foreground` - риск, внимание, перегруз, просрочка или статус в работе.
- `--danger`, `--danger-subtle`, `--danger-foreground` - ошибки, critical risk и destructive states.
- `--ring` - focus ring.
- `--shadow-soft` - мягкая тень карточек.
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` - уровни теней для surface/elevation system.
- `--glow-primary-subtle`, `--glow-primary-md` - редкий warm glow для progress, milestones и focused states.
- `--focus-ring` - явный warm focus state для keyboard navigation.
- `--radius-card` - радиус карточек.
- `--radius-control` - радиус форм и кнопок.

## Light theme

Light theme использует warm neutral base: off-white / warm gray background, white cards, dark text, спокойные borders и точечный warm amber/orange accent.

Цель light theme - ощущение чистой premium productivity системы, не скучного корпоративного SaaS.

Base tokens:

```css
:root {
  --background: #F7F5F2;
  --foreground: #111111;

  --surface: #FFFFFF;
  --surface-muted: #F0ECE7;
  --surface-elevated: #FFFFFF;
  --overlay: rgba(17, 17, 17, 0.48);

  --border: #E5DED6;
  --border-strong: #D6CABC;
  --border-primary-subtle: rgba(234, 88, 12, 0.24);
  --border-primary-strong: rgba(234, 88, 12, 0.48);

  --muted: #F0ECE7;
  --muted-foreground: #6F6860;

  --primary: #EA580C;
  --primary-hover: #C2410C;
  --primary-soft: #FB923C;
  --primary-subtle: #FFEDD5;
  --primary-foreground: #FFFFFF;

  --accent-warm: #F59E0B;
  --accent-copper: #B85C1A;
  --accent-gold: #D99A2B;

  --success: #16A34A;
  --success-subtle: #DCFCE7;
  --success-foreground: #14532D;
  --warning: #D97706;
  --warning-subtle: #FEF3C7;
  --warning-foreground: #78350F;
  --danger: #DC2626;
  --danger-subtle: #FEE2E2;
  --danger-foreground: #7F1D1D;

  --ring: #EA580C;
  --focus-ring: 0 0 0 3px rgba(234, 88, 12, 0.24);

  --shadow-sm: 0 1px 2px rgba(17, 17, 17, 0.06);
  --shadow-md: 0 8px 24px rgba(17, 17, 17, 0.08);
  --shadow-lg: 0 18px 48px rgba(17, 17, 17, 0.12);

  --glow-primary-subtle: 0 0 0 1px rgba(234, 88, 12, 0.18), 0 8px 24px rgba(234, 88, 12, 0.12);
  --glow-primary-md: 0 0 0 1px rgba(234, 88, 12, 0.28), 0 12px 36px rgba(234, 88, 12, 0.18);
}
```

## Dark theme

Dark theme использует near-black / graphite command center base, dark charcoal cards, off-white text, тонкие borders и warm orange highlights.

Цель dark theme - command center feeling без кислотного neon, cyberpunk overload и декоративного glow.

Base tokens:

```css
.dark {
  --background: #090909;
  --foreground: #F6F3EE;

  --surface: #121212;
  --surface-muted: #191817;
  --surface-elevated: #211F1C;
  --overlay: rgba(0, 0, 0, 0.62);

  --border: #2A2723;
  --border-strong: #3A342D;
  --border-primary-subtle: rgba(249, 115, 22, 0.26);
  --border-primary-strong: rgba(249, 115, 22, 0.52);

  --muted: #1A1816;
  --muted-foreground: #9B948B;

  --primary: #F97316;
  --primary-hover: #EA580C;
  --primary-soft: #FDBA74;
  --primary-subtle: #3A1F0F;
  --primary-foreground: #FFF7ED;

  --accent-warm: #F59E0B;
  --accent-copper: #C46A22;
  --accent-gold: #F6C56B;

  --success: #22C55E;
  --success-subtle: #123D24;
  --success-foreground: #DCFCE7;
  --warning: #F59E0B;
  --warning-subtle: #3A2B13;
  --warning-foreground: #FEF3C7;
  --danger: #EF4444;
  --danger-subtle: #3F1212;
  --danger-foreground: #FEE2E2;

  --ring: #F97316;
  --focus-ring: 0 0 0 3px rgba(249, 115, 22, 0.28);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 10px 28px rgba(0, 0, 0, 0.32);
  --shadow-lg: 0 22px 56px rgba(0, 0, 0, 0.42);

  --glow-primary-subtle: 0 0 0 1px rgba(249, 115, 22, 0.18), 0 10px 30px rgba(249, 115, 22, 0.14);
  --glow-primary-md: 0 0 0 1px rgba(249, 115, 22, 0.32), 0 16px 48px rgba(249, 115, 22, 0.22);
}
```

## Surface, border, shadow and glow tokens

Эти tokens поддерживают Lifera Design System v0.2: graphite-поверхности, warm borders, мягкую глубину и редкий warm glow.

Surface roles:

- `--background` - Level 0, общий фон приложения.
- `--surface` - Level 1, обычные cards, lists, form sections.
- `--surface-muted` - вторичные rows, muted blocks, inactive tabs и subtle hover areas.
- `--surface-elevated` - important dashboard cards, modal, dropdown, command palette, toast и onboarding card.
- `--overlay` - затемнение контекста под modal, drawer, command palette и full-screen focus state.

Border roles:

- `--border` - regular card/list/table separation.
- `--border-strong` - elevated surfaces, modal/dialog, dropdown и stronger container separation.
- `--border-primary-subtle` - active navigation, focus/progress containers и selected cards.
- `--border-primary-strong` - точечные important states, major milestones и selected/critical progress moments.

Shadow roles:

- `--shadow-sm` - regular card в light theme или subtle hover elevation.
- `--shadow-md` - important card, toast, dropdown и dashboard focus card.
- `--shadow-lg` - modal, command palette, drawer и high-priority overlay surfaces.

Glow roles:

- `--glow-primary-subtle` - редкий warm accent для active navigation, key progress highlight, XP/Level highlight и AI Ассистент card, если он остается warm.
- `--glow-primary-md` - milestone, achievement unlock, onboarding completion или focused system message.

Focus:

- `--focus-ring` должен использоваться для keyboard-visible focus states в interactive controls.

Rules:

- Dark theme чаще использует border + surface contrast, а не тяжелые shadows.
- Light theme может использовать soft shadows, но не wall of floating cards.
- Glow означает focus, progress или achievement. Если glow не помогает понять важность элемента, он не нужен.
- Не использовать neon borders, crypto-style glassmorphism, heavy dark shadows, glowing logo everywhere или orange outline у каждой карточки.

## Warm accent tokens

Цветовая система Lifera разделяет neutral base, primary action accent и semantic status colors. Warm amber / burnt orange является акцентом для главного действия, выбора, active navigation, XP/Level highlight и редких milestone moments. Он не является дефолтным цветом всех progress bars, badges, borders, cards или dashboard highlights.

Primary orange должен занимать примерно 5-8% экрана. Если orange визуально доминирует над контентом, значит он используется слишком часто.

Primary / Action / Progress / Achievement accent:

```css
--primary: #F97316;
--primary-hover: #EA580C;
--primary-soft: #FDBA74;
--primary-subtle: #FFEDD5;
--primary-foreground: #FFFFFF;

--accent-warm: #F59E0B;
--accent-copper: #C46A22;
--accent-gold: #F6C56B;
```

Status colors:

```css
--success: #22C55E;
--success-subtle: #123D24;
--success-foreground: #DCFCE7;
--warning: #F59E0B;
--warning-subtle: #3A2B13;
--warning-foreground: #FEF3C7;
--danger: #EF4444;
--danger-subtle: #3F1212;
--danger-foreground: #FEE2E2;
```

Primary orange использовать:

- один главный CTA на экране;
- active navigation state;
- selected tab/control;
- XP/Level highlight;
- редкий milestone/achievement accent;
- focus label или key focus CTA;
- key chart point, если это главный график.

Primary orange не использовать:

- для всех progress bars;
- для всех badges;
- для всех borders/cards/icons;
- для обычного статуса “в работе”;
- для всех highlights на dashboard;
- как фон больших блоков без необходимости.

Semantic usage:

- completion/day/goal progress: `--success`;
- in progress/attention/risk: `--warning`;
- secondary progress: `--muted` / `--surface-muted`;
- destructive/error: `--danger`;
- XP/Level или редкий milestone: `--primary` или `--accent-gold`.

## Theme switching baseline

Сейчас темы работают через:

- light tokens в `:root`;
- dark tokens через `@media (prefers-color-scheme: dark)`;
- будущую возможность manual override через `.dark` или `[data-theme="dark"]`.

Полноценный переключатель темы пока не реализован.

## Typography tokens

Технические typography tokens должны поддерживать Lifera Design System v0.1 и использоваться как основа для headings, body text, navigation, buttons, labels, forms, dashboard metrics и AI Ассистент text.

```css
:root {
  --font-logo: Oxanium, sans-serif;
  --font-sans: Geist, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 40px;
  --text-5xl: 48px;

  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.65;

  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

Роли:

- `--font-logo` - только для wordmark LIFERA в логотипе.
- `--font-sans` - основной UI font для всего интерфейса.
- `--text-xs` - малые labels, badges, microcopy.
- `--text-sm` - small body, descriptions, navigation.
- `--text-base` - основной body text и input text.
- `--text-lg` - card titles.
- `--text-xl` / `--text-2xl` - section titles и compact metrics.
- `--text-3xl` / `--text-4xl` / `--text-5xl` - page titles и dashboard metrics.

Рекомендуемая шкала:

- Page title: 32px / 40px / 650-700.
- Page subtitle: 15-16px / 24px / 400.
- Section title: 22-24px / 30-32px / 600-650.
- Card title: 17-18px / 24-26px / 600.
- Body text: 15-16px / 24px / 400.
- Small body: 14px / 20px / 400.
- Label: 12-13px / 16-18px / 500-600.
- Navigation text: 14-15px / 20px / 500, active 600.
- Button text: 14-15px / 20px / 600.
- Numeric metric: 32-48px / 1.05-1.15 / 650-750.

Responsive rules:

- Desktop page title: 32px.
- Desktop major metrics: 40-48px.
- Tablet page title: 28-32px.
- Tablet major metrics: 36-40px.
- Mobile page title: 24-28px.
- Mobile section title: 20-22px.
- Mobile card title: 16-18px.
- Mobile body: 15-16px.
- Mobile nav/bottom tab: 11-13px.
- На mobile не уменьшать body text ниже 14px.

Text color rules:

- Main text: `var(--foreground)`.
- Secondary text: `var(--muted-foreground)`.
- Labels: `var(--muted-foreground)`.
- Interactive/progress text: `var(--primary)`.
- AI-related text accents: `var(--primary)` by default; optional subtle indigo only as rare detail.
- Achievement/milestone accents: `var(--primary)`, `var(--accent-warm)`, `var(--accent-copper)` или `var(--accent-gold)`.

Typography restrictions:

- Не использовать Oxanium для всего интерфейса.
- Не делать весь UI uppercase.
- Не использовать декоративные или sci-fi fonts для body text.
- Не делать XP/Level игровыми.
- Не использовать случайные размеры без токенов.
- Не использовать маленький серый текст с плохим контрастом.
- Не использовать italic как декоративный стиль без необходимости.

## Spacing, layout and radius tokens

Технические tokens для spacing, layout dimensions и radius system должны поддерживать Lifera Design System v0.1 и обеспечивать единый rhythm для dashboard, public routes, app shell, cards, forms и navigation.

```css
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  --page-padding-desktop: 32px;
  --page-padding-tablet: 24px;
  --page-padding-mobile: 16px;

  --sidebar-width: 280px;
  --sidebar-width-collapsed: 80px;
  --sidebar-padding: 24px;
  --nav-item-height: 42px;
  --topbar-height: 72px;
  --topbar-padding-x: 32px;
  --right-rail-width: 360px;

  --content-max-width: 1200px;
  --content-wide-max-width: 1440px;
  --auth-card-width: 440px;
  --onboarding-max-width: 1120px;

  --grid-gap: 24px;
  --grid-gap-compact: 16px;
  --section-gap: 32px;

  --card-padding-sm: 16px;
  --card-padding-md: 24px;
  --card-padding-lg: 32px;
  --card-gap: 16px;

  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 999px;

  --radius-card: 20px;
  --radius-card-lg: 24px;
  --radius-control: 12px;
  --radius-badge: 999px;
  --radius-progress: 999px;

  --button-height-sm: 36px;
  --button-height-md: 42px;
  --button-height-lg: 48px;

  --input-height-md: 44px;
  --input-height-lg: 48px;
}
```

Spacing rules:

- Мелкие элементы: 4-8px.
- Элементы внутри карточек: 12-16px.
- Card padding: 20-24px.
- Gap между карточками: 16-24px.
- Gap между крупными секциями: 32-48px.
- Page padding на desktop: 24-32px.

Layout dimensions:

- Desktop sidebar: 280px.
- Future collapsed sidebar: 80px.
- Topbar: 72px.
- Right AI Ассистент rail: 360px.
- Public shell max-width: 1200px.
- Wide content max-width: 1440px.
- Auth card width: 440px.
- Onboarding max-width: 1120px.

Radius usage:

- Regular cards: 18-20px.
- Large hero cards: 22-24px.
- Compact cards: 14-16px.
- Buttons, inputs, selects and nav items: 12px.
- Badges, progress chips, status pills and progress bars: 999px.

Component sizing:

- Button small height: 36px.
- Button medium height: 42px.
- Button large height: 48px.
- Input medium height: 44px.
- Input large/search height: 48px.
- Badges height: 24-28px.
- Nav items height: 40-44px.
- Nav icons: 18-20px.
- Card icons: 20-24px.
- Compact icons: 16px.
- Feature/metric icons: 24-28px.

Responsive layout rules:

- Desktop >= 1280px: fixed sidebar 280px, topbar 72px, dashboard can use main area + right rail, grid gap 24px.
- Laptop 1024-1279px: sidebar can stay 260-280px, right rail may become narrower or move below, grid can become 2-column.
- Tablet 768-1023px: sidebar can collapse or become drawer, dashboard becomes 2-column or stacked, right rail moves below main content.
- Mobile < 768px: no fixed sidebar, use bottom navigation, content stacked vertically, page padding 16px, cards full width, bottom nav height 64-72px.

Spacing/radius restrictions:

- Не использовать случайные spacing значения без системы.
- Не делать разные card padding в одинаковых компонентах.
- Не делать sidebar/topbar разных размеров на разных страницах без причины.
- Не использовать слишком большие radius, из-за которых UI становится игрушечным.
- Не делать все элементы pill-shaped.
- Не делать dashboard стеной одинаковых плиток.
- Не хардкодить layout через absolute positioning без необходимости.

## Базовые UI-компоненты

Минимальные reusable primitives находятся в `src/components/ui`:

- `Button` - primary, secondary, ghost; размеры `sm`, `md`.
- `Card` - базовая карточка с `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`.
- `Input` - поле формы с optional `label`, `error`, disabled state.
- `Badge` - default, primary, success, warning, muted.
- `StatusBlock` - компактный блок для `Status: planned` и списков будущих функций.
- `Progress` - progress bar 0-100 для XP, goals, habits и onboarding.

Компоненты простые, без `class-variance-authority`, Radix UI и shadcn/ui. Для точечных случаев можно передавать `className`, но новые экраны должны сначала использовать существующие варианты.

## Component-level token references

Этот раздел фиксирует token references для Lifera Design System v0.2. Он не означает, что все компоненты уже реализованы в коде. Если component primitive еще отсутствует, будущая реализация должна опираться на эти rules.

Global component tokens:

- Surface: `--surface`, `--surface-muted`, `--surface-elevated`.
- Text: `--foreground`, `--muted-foreground`, `--primary-foreground`.
- Borders: `--border`, `--border-strong`, `--border-primary-subtle`, `--border-primary-strong`.
- Actions: `--primary`, `--primary-hover`, `--primary-subtle`, `--primary-soft`.
- Status: `--success`, `--warning`, `--danger`.
- Elevation: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--glow-primary-subtle`.
- Focus: `--focus-ring`.
- Radius: `--radius-card`, `--radius-card-lg`, `--radius-control`, `--radius-badge`, `--radius-progress`.
- Sizing: `--button-height-sm`, `--button-height-md`, `--button-height-lg`, `--input-height-md`, `--input-height-lg`.

### Button token usage

Primary button:

- background: `--primary`;
- hover background: `--primary-hover`;
- color: `--primary-foreground`;
- focus: `--focus-ring`;
- height: `--button-height-sm`, `--button-height-md`, `--button-height-lg`;
- radius: `--radius-control`.

Secondary button:

- background: `--surface`;
- border: `--border`;
- text: `--foreground`;
- hover surface: `--surface-muted`;
- hover border: `--border-strong`;
- no glow.

Ghost button:

- background: transparent;
- text: `--muted-foreground` or `--foreground`;
- hover background: `--surface-muted`;
- focus: `--focus-ring`.

Danger button:

- use `--danger` only for destructive actions;
- keep neutral confirmation layout unless danger emphasis is required.

### Card token usage

Default card:

- surface: `--surface`;
- border: `--border`;
- shadow: none or `--shadow-sm`;
- radius: `--radius-card`.

Muted card:

- surface: `--surface-muted`;
- border: `--border`;
- shadow: none;

Elevated card:

- surface: `--surface-elevated`;
- border: `--border-strong`;
- shadow: `--shadow-md`;
- radius: `--radius-card-lg`.

Highlight card:

- border: `--border-primary-subtle`;
- optional glow: `--glow-primary-subtle`;
- use only for key progress, current level, milestone or main focus states.

### Form control token usage

Input, Textarea and Select:

- background: `--surface`;
- border: `--border`;
- text: `--foreground`;
- placeholder/help text: `--muted-foreground`;
- focus: `--focus-ring`;
- radius: `--radius-control`;
- input height: `--input-height-md` or `--input-height-lg`;
- error border/text: `--danger`.

Select dropdown:

- surface: `--surface-elevated`;
- border: `--border-strong`;
- shadow: `--shadow-md` or `--shadow-lg`;
- active option: `--primary-subtle` only when selection/focus needs emphasis.

### Badge and status pill token usage

Badge:

- default: `--surface` + `--border` + `--foreground`;
- muted: `--surface-muted` + `--muted-foreground`;
- primary: `--primary-subtle` + `--primary`;
- success/warning/danger: use only for semantic states;
- radius: `--radius-badge`.

Status pill:

- active: `--primary-subtle` + `--primary`;
- completed: success treatment;
- paused/draft/locked: muted treatment;
- missed/risk: warning or danger treatment depending on severity.

### Progress token usage

Progress bar:

- track: `--surface-muted` or muted surface;
- fill primary: `--primary`;
- fill success: `--success`;
- fill warning: `--warning`;
- radius: `--radius-progress`;
- glow: none by default;
- optional glow only for current level, milestone or important progress event.

Recommended heights:

- compact: 6px;
- regular: 8-10px;
- large: 12px.

### Tabs and segmented control token usage

Tabs:

- inactive text: `--muted-foreground`;
- active text: `--primary` or `--foreground`;
- active underline/border: `--primary`;
- contained active surface: `--primary-subtle`.

Segmented control:

- container surface: `--surface-muted`;
- selected surface: `--surface-elevated` or `--primary-subtle`;
- selected text: `--foreground` or `--primary`;
- border: `--border`.

### Metric card token usage

Metric card:

- surface: `--surface`;
- value text: `--foreground`;
- label/detail: `--muted-foreground`;
- key highlight: `--primary`;
- delta success/warning/danger only when the metric has real semantic movement;
- avoid arcade counters, decorative glow and excessive gold.

### Overlay component token usage

Modal/Dialog:

- overlay: `--overlay`;
- surface: `--surface-elevated`;
- border: `--border-strong`;
- shadow: `--shadow-lg`;
- radius: `--radius-card-lg`;
- focus: `--focus-ring`.

Dropdown/Tooltip/Toast:

- surface: `--surface-elevated`;
- border: `--border-strong`;
- shadow: `--shadow-md` or `--shadow-lg`;
- no glow by default.

### Row and list item token usage

Table row:

- border-bottom: `--border`;
- hover surface: `--surface-muted`;
- selected surface: `--primary-subtle`;
- no glow.

List item:

- surface: transparent or `--surface`;
- hover surface: `--surface-muted`;
- minimum tap target: 44px on mobile;
- status through Status Pill, not arbitrary color blocks.

### Component usage restrictions

- Components should be neutral by default.
- Primary orange is reserved for action, progress, selection, focus and achievement.
- Do not use orange on every card, icon, badge, border or progress bar at the same time.
- Do not use fantasy medals, RPG frames, arcade counters, heavy glow, confetti overload or reward-shop aesthetics.
- Do not rely only on color; status text and labels must remain clear.
- Loading, error and disabled states must not resize the component or break layout.

## Navigation token references

Этот раздел фиксирует token references для Navigation System v0.2. Он не означает, что route structure уже изменена в коде.

Core sidebar order:

1. Главная.
2. Действия.
3. Проекты.
4. Календарь.
5. Цели.
6. Достижения.
7. Навыки.
8. Финансы.
9. Здоровье.
10. AI Ассистент.
11. Настройки.
12. Профиль / user block.

Layout tokens:

- desktop sidebar width: `--sidebar-width`;
- collapsed sidebar width: `--sidebar-width-collapsed`;
- sidebar padding: `--sidebar-padding`;
- nav item height: `--nav-item-height`;
- topbar height: `--topbar-height`;
- mobile bottom nav height: 64-72px;
- nav icon size: 18-20px.

Sidebar item:

- default text: `--muted-foreground`;
- default surface: transparent;
- hover surface: `--surface-muted`;
- hover text: `--foreground`;
- active surface: `--primary-subtle` or subtle warm surface;
- active text/icon: `--primary`;
- active border/indicator: `--border-primary-subtle`;
- focus: `--focus-ring`;
- no heavy glow by default.

Topbar:

- surface: `--surface` or `--surface-elevated`;
- border-bottom: `--border`;
- title text: `--foreground`;
- context/subtitle text: `--muted-foreground`;
- primary action: Button primary rules;
- command/search input: Input large/search rules.

Mobile bottom navigation:

- item count: 4-5 max;
- recommended items: Главная, Действия, Календарь, Цели, AI Ассистент;
- active state: `--primary` + subtle background;
- inactive state: `--muted-foreground`;
- tap target: at least 44px;
- no glow.

Page tabs:

- inactive text: `--muted-foreground`;
- active text: `--primary` or `--foreground`;
- active underline/border: `--primary`;
- contained selected surface: `--primary-subtle`;
- max recommended tab count: 3-5.

Breadcrumbs:

- use only on detail/nested pages;
- text: `--muted-foreground`;
- current page: `--foreground`;
- separator: muted.

Command/Search:

- placeholder: "Поиск или команда ⌘K";
- focus: `--focus-ring`;
- surface: `--surface`;
- dropdown/palette surface: `--surface-elevated`;
- command palette shadow: `--shadow-lg`;
- no heavy glow.

Navigation restrictions:

- Do not use old UI label `AI Coach`; use `AI Ассистент`.
- Do not make Задачи, Привычки or Желания top-level sidebar items.
- Do not make Аналитика, Рефлексия, Сферы жизни, Магазин or Хранилище top-level Core Navigation v0.2 items.
- Do not use glowing sidebar, neon nav, game menu style or random colored icons.

## Data visualization, motion and accessibility token notes

Data visualization:

- primary data highlight: `--primary`;
- secondary data: `--muted-foreground` / muted surface treatment;
- positive trend: `--success`;
- warning/risk: `--warning`;
- negative/destructive: `--danger`;
- chart surfaces: `--surface` or `--surface-elevated`;
- chart grid lines: `--border`;
- progress radius: `--radius-progress`;
- progress glow: none by default; `--glow-primary-subtle` only for milestone/current level.

Iconography:

- nav icons: 18-20px;
- mobile nav icons: 20-22px;
- card icons: 20-24px;
- feature/metric icons: 24-28px;
- small inline icons: 14-16px;
- recommended stroke: 1.75-2px;
- use outline icons by default.

Motion:

- hover transitions: 150-180ms;
- dropdown/modal transitions: 180-220ms;
- optional page transition: 200-250ms;
- progress animation: 300-600ms only where useful;
- easing: ease-out;
- no bounce/elastic by default;
- respect `prefers-reduced-motion`.

Accessibility:

- focus: `--focus-ring`;
- minimum mobile tap target: 44px;
- status must not rely on color only;
- progress elements need accessible label/value;
- disabled text must remain readable.

## Что пока не реализовано

- `next-themes`.
- shadcn/ui.
- полноценный manual theme toggle.
- финальная дизайн-система.
- сложные animation tokens.
- production-ready form validation components.
- часть primitives из Блока 7: Textarea, Select, Tabs, Segmented Control, Metric Card, Empty State, Modal/Dialog, Toast, Tooltip, Dropdown, Table Row, List Item.

## Правила использования

- Новые экраны должны использовать tokens, а не hardcoded цвета.
- Предпочитать base tokens: `bg-surface`, `text-foreground`, `text-muted`, `border-border`.
- Для основного progress/action/achievement слоя использовать `--primary`, `--primary-hover`, `--primary-soft`, `--primary-subtle`.
- Для warm highlights использовать `--accent-warm`, `--accent-copper`, `--accent-gold`.
- AI Ассистент следует общей warm premium системе; optional subtle indigo detail допустим только отдельным решением, если не ломает warm graphite стиль.
- Для редких случаев можно использовать arbitrary values: `bg-[var(--surface)]`, `shadow-[var(--shadow-md)]`, `rounded-[var(--radius-card)]`.
- Dark и light theme должны сохранять одинаковую UX-структуру.
- Геймификация должна отображаться через progress, badges и milestones, а не через игровую визуальную стилистику.
- Warm amber / burnt orange является главным смысловым акцентом Lifera, потому что связан с целями, действиями, прогрессом, XP, Level, milestones и достижениями.
- `--warning` / amber остается системным warning color; не смешивать warning states и primary orange actions без смысла.

## Что нельзя делать с цветами

- Использовать teal/cyan как главный брендинговый цвет.
- Использовать violet-blue как основной primary color.
- Делать весь интерфейс фиолетовым, бронзовым, оранжевым, зеленым или teal-залитым.
- Использовать indigo для всего прогресса или как заметный AI SaaS слой.
- Использовать цветные акценты без semantic role.
- Перекрашивать логотип под каждый раздел.
- Уводить интерфейс в crypto-dashboard, banking-dashboard, medical-dashboard, game UI или cyberpunk aesthetic.
