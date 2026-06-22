# Lifera Brand Foundation v0.2

## 1. Positioning

Lifera - персональная операционная система для управления личным развитием, прогрессом и ключевыми сферами жизни с AI Ассистентом и взрослой геймификацией.

Продукт помогает пользователю видеть цели, задачи, привычки, прогресс, уровни, достижения и рекомендации в одной структурной системе.

## 2. Brand Name

Основное название продукта: Lifera.

В логотипе используется uppercase-написание: LIFERA.

В тексте интерфейса и документации используется обычное написание: Lifera.

Lowercase-вариант lifera не используется как основное бренд-написание.

Пример:

- Логотип: LIFERA
- Текст интерфейса: "Lifera помогает управлять целями, привычками и прогрессом."

## 3. Domains

Основные домены:

- lifera.app
- lifera.ru

lifera.app подходит для product-first SaaS-позиционирования. lifera.ru можно использовать для русскоязычной версии, редиректа или локального лендинга.

## 4. Tone of Voice

Тон коммуникации Lifera: спокойный, точный, взрослый, помогающий сфокусироваться на следующем действии.

Примеры:

- "Сфокусируйтесь на одном ключевом действии сегодня."
- "До следующего уровня осталось 360 XP."
- "Создайте первую цель, чтобы начать видеть прогресс."
- "AI Ассистент поможет разбить цель на понятные шаги."

Tone of voice не должен быть игровым, агрессивно-мотивационным или инфобизнесовым.

## 5. Visual Character

Визуальный характер Lifera - premium personal operating system: чистый, спокойный, технологичный и структурный интерфейс.

Визуал должен передавать:

- контроль;
- ясность;
- движение вперед;
- прогресс;
- собранность;
- ощущение личной системы.

Геймификация отображается через метрики, progress bars, XP, уровни, streak и достижения, но не превращает продукт в игру.

## 6. Lifera Is Not A Game

Геймификация в Lifera нужна не ради развлечения, а ради мотивации и наглядного прогресса.

Допустимы:

- XP;
- уровни;
- streak;
- achievements;
- progress bars;
- milestones;
- прогресс по сферам жизни.

Недопустимы:

- fantasy RPG-стилистика;
- мечи;
- сундуки;
- монстры;
- игровые персонажи;
- детские награды;
- агрессивный neon;
- cyberpunk overload.

## 7. Adult Gamified Personal OS

Adult Gamified Personal OS - это серьезная персональная система управления жизнью, где цели, привычки, здоровье, финансы, навыки и прогресс собраны в одном месте.

Геймификация используется аккуратно: как способ видеть развитие, а не как игровой визуальный стиль.

Ключевая формула:

Premium productivity SaaS + AI dashboard + subtle gamification

## 8. Блок 2 - Логотип и базовая айдентика

### 8.1. Основной логотип

Основной логотип Lifera - это связка DNA-like mark + wordmark LIFERA.

Брендовые SVG-ассеты хранятся в `public/brand/`.

Текущий набор:

- `public/brand/lifera-logo.svg` - основной горизонтальный логотип: DNA-like mark + wordmark LIFERA.
- `public/brand/lifera-wordmark.svg` - текстовый wordmark LIFERA.
- `public/brand/lifera-mark.svg` - compact mark без текста.

`lifera-logo.svg` используется как основной горизонтальный логотип в большинстве интерфейсных сценариев:

- desktop sidebar;
- public header;
- auth, register и onboarding screens;
- brand sections;
- презентационные и документационные материалы.

`lifera-wordmark.svg` используется только там, где mark уже присутствует рядом или где нужен текстовый бренд без иконки:

- редкие брендовые композиции;
- документация;
- презентационные блоки;
- случаи, где mark визуально перегружает интерфейс.

Wordmark не используется как основной app icon или favicon.

`lifera-mark.svg` используется как compact mark:

- favicon base;
- app icon base;
- mobile compact header;
- collapsed sidebar;
- small brand badge;
- loading/splash state;
- места, где полный логотип не помещается.

Правило написания:

- в логотипе используется uppercase: LIFERA;
- в обычном тексте интерфейса и документации используется Lifera;
- lowercase `lifera` не используется как основное бренд-написание.

### 8.2. Compact mark

Compact mark - это отдельная DNA-like иконка Lifera без текста.

Mark можно использовать отдельно без wordmark в следующих случаях:

- favicon;
- app icon;
- PWA icon;
- mobile header;
- collapsed sidebar;
- small loading state;
- compact navigation;
- social/avatar/icon usage;
- brand watermark, если он не мешает UI.

Mark нельзя использовать как декоративную игровую награду, achievement badge или RPG-иконку.

Минимальные размеры:

- sidebar/collapsed navigation: 28-32 px по высоте;
- mobile header: 28-32 px;
- favicon: 16x16 / 32x32, при необходимости использовать упрощенную и оптически проверенную версию;
- app icon master: 1024x1024 px;
- PWA icons: 192x192 и 512x512;
- apple-touch-icon: 180x180.

Для маленьких размеров важно проверять читаемость mark. Если в 16x16 детали теряются, favicon можно делать в более простой и контрастной версии.

### 8.3. Clear space

Минимальный отступ вокруг логотипа должен быть не меньше высоты одного внутреннего элемента mark или примерно 25% от высоты логотипа.

Практическое правило:

- вокруг horizontal logo оставлять минимум 12-16 px свободного пространства в UI;
- вокруг mark оставлять минимум 20-24% от размера иконки;
- не ставить логотип вплотную к краям экрана, карточкам, тексту или кнопкам;
- не размещать логотип на визуально шумном фоне без достаточного контраста.

Для app icon:

- safe area: 16-20% от каждого края;
- mark должен занимать примерно 60-68% площади иконки;
- не растягивать mark до краев.

### 8.4. Размеры

Рекомендуемые размеры в интерфейсе:

Desktop sidebar:

- horizontal logo height: 28-32 px;
- mark height внутри logo: около 28-32 px;
- wordmark подстраивается пропорционально;
- sidebar logo block padding: 20-24 px.

Public header:

- horizontal logo height: 28-36 px;
- использовать `lifera-logo.svg`;
- не делать логотип слишком крупным относительно nav/action buttons.

Mobile header:

- preferred: `lifera-mark.svg` 28-32 px;
- если места достаточно, можно использовать compact horizontal logo;
- не использовать длинный wordmark в очень узких местах.

Auth / Register / Onboarding screens:

- использовать `lifera-logo.svg`;
- logo height: 36-48 px;
- можно размещать в верхней части public shell или в brand panel;
- не добавлять лишние декоративные эффекты.

Collapsed sidebar:

- использовать только `lifera-mark.svg`;
- size: 28-32 px;
- центрировать внутри navigation rail.

Favicon / App icon:

- использовать `lifera-mark.svg` как основу;
- не использовать полный wordmark LIFERA внутри app icon;
- master app icon: 1024x1024 px;
- recommended corner radius for icon previews: 22-24%;
- main app icon version: deep graphite background + white DNA mark;
- alternative app icon: light background + black DNA mark;
- optional brand version: deep graphite background + warm amber/orange mark.

### 8.5. Цветовые правила

Основной принцип: логотип в интерфейсе должен быть преимущественно монохромным. Цветовая индивидуальность Lifera должна проявляться через UI accents: primary, AI accent, premium/milestone accent.

На светлом фоне:

- использовать black/dark logo;
- рекомендуемый цвет: `#101418` или близкий к foreground;
- не использовать слабый серый, если падает контраст.

На темном фоне:

- использовать white/light logo;
- рекомендуемый цвет: `#F4F7F6` или близкий к foreground;
- не использовать чисто цветной wordmark как основной вариант.

Цветной mark допускается только как secondary usage:

- app icon;
- splash screen;
- favicon, если хорошо читается;
- promo / brand visuals;
- презентационные материалы;
- selected brand moments.

Допустимые цветные варианты:

- warm amber/orange mark для selected brand moments;
- subtle warm amber/orange gradient для app icon или splash;
- teal/cyan не использовать как основной цвет логотипа;
- indigo не использовать как основной цвет логотипа;
- bronze/gold не использовать как цвет wordmark в основном UI.

Primary accent background под mark можно использовать только в специальных случаях:

- app icon;
- onboarding brand card;
- empty state illustration;
- loading/splash;
- promo block.

В обычном UI лучше использовать монохромный логотип без цветной подложки.

Инвертирование SVG:

- разрешено использовать black/white версии SVG для light/dark theme;
- не инвертировать SVG случайно через CSS filter, если это ломает контраст или цветовую точность;
- лучше хранить или использовать явные версии: logo black, logo white, mark black, mark white.

### 8.6. Запреты

Нельзя:

- растягивать логотип по ширине или высоте;
- менять пропорции mark и wordmark;
- использовать lowercase `lifera` как логотип;
- перекрашивать логотип в случайные цвета;
- делать весь логотип teal/indigo/bronze/orange в основном интерфейсе;
- использовать оранжевый как цвет логотипа;
- добавлять тени/glow к wordmark без явной причины;
- добавлять сильный neon/glow вокруг логотипа;
- использовать mark как игровую медаль, badge, achievement icon или RPG-элемент;
- помещать логотип на шумный фон без контраста;
- ставить логотип вплотную к краям;
- использовать полный wordmark внутри favicon/app icon;
- смешивать несколько версий логотипа на одном экране без необходимости;
- изменять форму DNA mark;
- добавлять обводки, 3D, bevel, glass effects или декоративные искажения.

Итоговое правило:

- основной интерфейс Lifera использует black logo в light theme;
- основной интерфейс Lifera использует white logo в dark theme;
- цветные версии mark допустимы только для app icon, splash, favicon, promo и специальных брендовых моментов.

Названия файлов пишутся lowercase. В UI для логотипа используется alt-текст `LIFERA`, а в интерфейсном тексте используется `Lifera`.

## 9. Блок 3 - Цветовая система

Color strategy:

Minimal premium neutral interface with warm amber / burnt orange performance accent.

Русская формулировка:

Минималистичная премиальная дизайн-система на warm graphite базе с warm amber / burnt orange акцентом действия, прогресса и достижения.

Основное направление:

Minimal Premium Life Performance OS.

Alternative naming:

Warm Graphite Personal Command Center.

Lifera - взрослая персональная операционная система с минималистичной нейтральной базой, теплым amber/orange акцентом, строгой dashboard-структурой и взрослой геймификацией через данные: XP, Level, streak, milestones, progress.

Характер:

- premium;
- minimal;
- focused;
- warm;
- serious;
- energetic;
- analytical;
- adult;
- not playful;
- not childish;
- not fantasy;
- not crypto;
- not medical.

Главное ощущение: не "игра жизни", а "панель управления личной эффективностью и прогрессом".

Lifera больше не должна строиться вокруг teal/cyan как главного DNA/progress accent. Новая система более цельная: neutral warm base + один главный warm performance accent.

Актуальная цветовая логика Lifera v0.2:

- neutral base - основа интерфейса;
- warm amber / burnt orange - главный акцент целей, действий, прогресса и достижений;
- green - success / положительная динамика;
- red - danger / ошибка / просадка;
- muted gray - вторичные элементы;
- indigo может использоваться только как optional/rare AI detail, если не ломает warm graphite стиль.

Lifera не должна выглядеть как игра, crypto-dashboard, banking-dashboard, medical-dashboard или generic AI SaaS. Цвета должны работать как semantic system, а не как случайная палитра.

### 9.1. Роли цветов

Neutral base используется для:

- background;
- surfaces;
- cards;
- borders;
- text;
- muted text.

Смысл neutral base: спокойная премиальная основа интерфейса.

Warm amber / burnt orange - главный смысловой акцент Lifera. Используется для:

- primary buttons;
- active navigation;
- selected tabs;
- focus states;
- progress highlights;
- XP / Level highlights;
- key charts;
- streak indicators;
- milestone cards;
- achievement accents;
- important CTA.

Смысл warm amber/orange: энергия, действие, движение, фокус, прогресс, достижение, momentum, premium milestone.

Дополнительные warm accents:

- `--accent-warm` - amber для теплых highlights;
- `--accent-copper` - copper для глубоких premium highlights;
- `--accent-gold` - muted gold для редких milestone/premium moments.

AI Ассистент следует общей warm premium системе. Очень subtle indigo detail допустим только как optional/rare AI detail, если он не ломает общее warm graphite направление. Primary CTA внутри AI Ассистента остается orange.

Achievements используют orange/amber/gold family и должны выглядеть как premium milestones, а не игровые медали.

Status colors:

- success = выполнено / успешная динамика;
- warning = риск / внимание / перегруз;
- danger = ошибка / критический риск / удаление.

### 9.2. Распределение цветов на экране

Примерное соотношение:

- 75-85% - neutral warm graphite / off-white base;
- 5-12% - warm amber/orange accent;
- 2-5% - status / secondary highlights.

Правило: orange должен помогать понять действие, прогресс и важность момента, а не создавать визуальный шум. Нельзя заливать весь интерфейс orange.

### 9.3. Base light theme tokens

```css
:root {
  --background: #F7F5F2;
  --foreground: #111111;

  --surface: #FFFFFF;
  --surface-muted: #F0ECE7;
  --surface-elevated: #FFFFFF;

  --border: #E5DED6;
  --border-strong: #D6CABC;

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
  --warning: #D97706;
  --danger: #DC2626;

  --ring: #EA580C;
}
```

### 9.4. Base dark theme tokens

```css
.dark {
  --background: #090909;
  --foreground: #F6F3EE;

  --surface: #121212;
  --surface-muted: #191817;
  --surface-elevated: #211F1C;

  --border: #2A2723;
  --border-strong: #3A342D;

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
  --warning: #F59E0B;
  --danger: #EF4444;

  --ring: #F97316;
}
```

### 9.5. Правила использования цветов

Primary / warm amber-orange:

- использовать для primary buttons;
- active navigation;
- selected tabs;
- focus states;
- progress highlights;
- XP / Level highlights;
- key charts;
- streak indicators;
- milestone cards;
- achievement accents;
- important CTA.

Не использовать primary для:

- всех карточек;
- всего фона;
- всего текста;
- всех borders;
- всех иконок подряд;
- больших оранжевых заливок без смысла.

Charts/progress:

- primary chart highlight = orange/amber;
- inactive chart bars/lines = muted gray;
- positive status can remain green;
- danger remains red;
- avoid rainbow charts unless data requires it.

AI Ассистент:

- следует той же warm premium системе;
- optional very subtle indigo detail allowed only if it does not break the overall warm graphite style;
- primary CTA remains orange.

Success / warning / danger:

- success: выполнено, хорошая динамика, привычка закрыта;
- warning: риск перегруза, внимание, просадка;
- danger: ошибка, критический риск, удаление.

### 9.6. Theme strategy

- По умолчанию Lifera использует системную тему пользователя через `prefers-color-scheme`.
- Light и dark theme должны иметь одинаковую структуру и одинаковые компоненты.
- Отличаются только colors, shadows, borders и contrast.
- Пока не подключать сложный theme provider без отдельной необходимости.
- Позже можно добавить ручной переключатель: Системная / Светлая / Темная.

Light theme direction:

- off-white / warm gray background;
- white cards;
- dark text;
- orange accents;
- minimal and clean.

Dark theme direction:

- near-black / graphite background;
- dark charcoal cards;
- off-white text;
- warm orange highlights;
- very restrained glow.

### 9.7. Логотип и цвет

Логотип Lifera остается преимущественно монохромным.

Правила:

- light theme: dark/black logo;
- dark theme: white/light logo;
- не перекрашивать логотип постоянно в orange;
- основной UI: logo должен быть нейтральным;
- акцентный orange живет в интерфейсе, кнопках, active states, charts и highlights.

Orange mark допустим только в специальных брендовых случаях:

- app icon;
- splash screen;
- promo materials;
- selected presentation moments.
- active loading/splash state, если это оправдано.

Не делать:

- glowing logo в каждом экране;
- orange wordmark везде;
- gradient logo без причины;
- logo as game badge.

### 9.8. UI style rules

Интерфейс должен быть:

- minimal;
- clean;
- premium;
- warm dark;
- structured;
- readable;
- dashboard-like;
- serious;
- not playful.

Desktop layout:

- left sidebar;
- topbar;
- central command surface;
- optional right AI/insight rail;
- no wall of equal cards.

Sidebar:

- dark/neutral surface;
- active item uses primary orange accent;
- icons neutral by default;
- active icon/text can use primary;
- no excessive glow.

Topbar:

- search/command input;
- profile;
- primary action;
- subtle borders;
- no heavy decoration.

Cards:

- dark theme cards: graphite surfaces with subtle warm borders/glow only where needed;
- light theme cards: white/off-white surfaces with subtle warm accent;
- card radius remains as previously defined;
- use orange only for key data, CTA, active state, chart highlights.

### 9.9. Что нельзя делать

Нельзя:

- использовать teal/cyan как главный брендинговый цвет;
- строить весь интерфейс вокруг violet-blue / generic AI SaaS palette;
- делать весь интерфейс фиолетовым;
- делать весь интерфейс оранжевым;
- делать весь интерфейс бронзовым/золотым;
- использовать кислотный neon;
- использовать кислотный orange;
- делать crypto-dashboard aesthetic;
- делать banking-dashboard aesthetic;
- делать medical-dashboard aesthetic;
- делать game UI / RPG / fantasy style;
- использовать цветные акценты без роли;
- делать стену одинаковых карточек;
- делать heavy glow или cyberpunk overload.

### 9.10. Старые решения, которые заменены

Если в старых документах или задачах было указано:

- primary = violet-blue;
- primary = teal/cyan;
- teal/cyan как главный DNA/progress accent;
- contextual section accents как основная цветовая стратегия;
- AI = indigo как заметный цветовой слой;
- achievements = bronze как отдельная сильная палитра;
- один глобальный случайный decorative color без связи с целями/достижениями;

то это заменяется на новую логику:

Neutral warm graphite / off-white base + warm amber / burnt orange as action, progress and achievement accent.

Памятка по выбору:

Lifera - сервис, главная задача которого помочь пользователю двигаться к целям, фиксировать прогресс и достигать важных результатов. Ключевые сущности продукта: цели, достижения, прогресс, фокус, действия, milestones, личный рост.

Warm amber / orange становится главным смысловым акцентом, потому что:

- orange / amber = энергия, действие, движение, фокус;
- bronze / gold оттенки = достижение, ценность, результат, статус;
- вместе они связывают цели, прогресс и достижения в единую визуальную систему.

Это не случайный оранжевый. Это цвет результата, движения и достижения.

### 9.11. Разделение brand rules и technical tokens

В `BRAND_FOUNDATION.md` фиксируются продуктовые правила и смысл цветов.

В `docs/UI_TOKENS.md` фиксируются технические CSS tokens и правила их применения в интерфейсе.

## 10. Блок 4 - Typography / Типографика

Типографика Lifera Design System v0.1 должна поддерживать ощущение premium personal command center для целей, задач, привычек, здоровья, финансов, навыков, достижений и AI Ассистента.

Типографика должна быть:

- современной;
- чистой;
- хорошо читаемой;
- SaaS-oriented;
- не игровой;
- не cyberpunk;
- не декоративной;
- пригодной для light и dark theme;
- удобной для dashboard-интерфейса с метриками, карточками, навигацией и AI-рекомендациями.

### 10.1. Основные шрифты

Logo font:

- Oxanium.
- Используется только для wordmark LIFERA в логотипе.
- Не используется как основной UI font.
- Не используется для body text, labels, navigation и длинных текстов.

UI font:

- Geist.
- Используется как основной интерфейсный шрифт для всего приложения:
  - headings;
  - body;
  - navigation;
  - buttons;
  - labels;
  - cards;
  - forms;
  - dashboard metrics;
  - AI Ассистент text.

Fallback:

```css
font-family: Geist, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Причина: Geist выглядит современно, чисто, технологично и хорошо подходит для SaaS/web-app интерфейса. Oxanium остается только для логотипа, чтобы интерфейс не стал похож на панель управления космолетом.

### 10.2. Общий принцип типографики

Типографика строится на иерархии:

- Page title - главный заголовок страницы.
- Page subtitle - пояснение к странице.
- Section title - заголовок секции.
- Card title - заголовок карточки.
- Body text - основной текст.
- Muted text - вторичный текст.
- Label - подписи полей, статусов и малых элементов.
- Navigation text - пункты меню.
- Button text - текст кнопок.
- Numeric metric - большие числовые показатели: XP, Level, проценты, streak.

Главные правила:

- не использовать слишком много разных размеров;
- не делать метрики похожими на игровые счетчики;
- не делать заголовки слишком декоративными;
- не использовать uppercase для всего интерфейса;
- сохранять спокойную, взрослую, premium SaaS-иерархию.

### 10.3. Размеры текста

Page title:

- size: 32px;
- line-height: 40px;
- font-weight: 650-700;
- usage: название главной страницы, например "Фокус дня", "Мой прогресс", "Обзор".

Page subtitle:

- size: 15-16px;
- line-height: 24px;
- font-weight: 400;
- color: muted-foreground;
- usage: пояснение под главным заголовком.

Section title:

- size: 22-24px;
- line-height: 30-32px;
- font-weight: 600-650;
- usage: крупные секции dashboard.

Card title:

- size: 17-18px;
- line-height: 24-26px;
- font-weight: 600;
- usage: заголовки карточек: "Цели", "Привычки", "AI Ассистент".

Body text:

- size: 15-16px;
- line-height: 24px;
- font-weight: 400;
- usage: основной текст интерфейса.

Small body:

- size: 14px;
- line-height: 20px;
- font-weight: 400;
- usage: вторичные описания, подписи внутри карточек.

Label:

- size: 12-13px;
- line-height: 16-18px;
- font-weight: 500-600;
- usage: статусы, подписи, badges, form labels.

Navigation text:

- size: 14-15px;
- line-height: 20px;
- font-weight: 500;
- active state font-weight: 600;
- usage: sidebar navigation.

Button text:

- size: 14-15px;
- line-height: 20px;
- font-weight: 600;
- usage: primary/secondary buttons.

Numeric metric:

- size: 32-48px depending on context;
- line-height: 1.05-1.15;
- font-weight: 650-750;
- usage: Level, XP, проценты, streak, ключевые dashboard-метрики.

Large dashboard metric:

- size: 40-48px;
- line-height: 48-56px;
- font-weight: 700;
- usage: главный показатель на странице.

Medium metric:

- size: 28-32px;
- line-height: 36-40px;
- font-weight: 650-700;
- usage: карточки среднего уровня.

Small metric:

- size: 20-24px;
- line-height: 28-32px;
- font-weight: 600-650;
- usage: компактные widgets.

### 10.4. Typography tokens

Технические typography tokens фиксируются в `docs/UI_TOKENS.md`.

Базовая модель:

```css
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
```

### 10.5. Правила для dashboard

Dashboard должен быть сканируемым за 5 секунд.

Иерархия:

- Page title должен быть самым заметным текстом в верхней части.
- Главный фокус дня или общий прогресс должен иметь самый сильный визуальный вес.
- Метрики XP/Level должны быть крупными, но не игровыми.
- Card titles должны быть понятными и спокойными.
- Body text должен быть читаемым, не мелким.
- Labels и badges не должны спорить с основным контентом.

Для XP / Level:

- использовать крупный размер;
- не использовать arcade/game style;
- не использовать агрессивный glow;
- не делать цифры похожими на игровой счетчик;
- можно использовать font-weight 700, но без декоративных эффектов.

Пример:

- Level 7 - крупно, спокойно, premium SaaS style.
- 1 640 XP - крупная метрика, но без RPG-визуала.

### 10.6. Правила для AI Ассистента

AI Ассистент должен выглядеть как аналитик и планировщик, а не как магический чат.

Typography:

- title: 18px / 600;
- recommendation text: 15-16px / 24px / 400;
- insight labels: 12-13px / 500;
- CTA button: 14-15px / 600.

Не использовать:

- слишком крупные кавычки;
- декоративный AI text;
- чрезмерный italic;
- uppercase для рекомендаций.

AI Ассистент text должен быть спокойным, ясным и полезным.

### 10.7. Правила для navigation

Sidebar:

- section labels: 11-12px, uppercase или small caps допустимо, но очень аккуратно;
- section label color: muted-foreground;
- nav item text: 14-15px;
- active nav item: 600 weight;
- inactive nav item: 500 weight;
- не делать navigation text слишком крупным.

Пример секций:

- Главное;
- Прогресс;
- Сферы жизни, если этот аналитический слой будет возвращен позже;
- Интеллект;
- Система.

### 10.8. Правила для buttons

Button text:

- size: 14-15px;
- weight: 600;
- line-height: 20px;
- не использовать uppercase в кнопках по умолчанию.

Primary button examples:

- "Новая цель";
- "Продолжить";
- "Получить план".

Secondary button examples:

- "Перенести";
- "Подробнее";
- "Смотреть все".

### 10.9. Правила для forms

Input label:

- 13-14px;
- weight: 500-600.

Input text:

- 15-16px;
- weight: 400.

Placeholder:

- 15-16px;
- muted-foreground;
- не делать слишком низкий контраст.

Error text:

- 13-14px;
- danger color;
- line-height: 18-20px.

Help text:

- 13-14px;
- muted-foreground.

### 10.10. Правила для text color

Использовать semantic tokens:

- Main text: `var(--foreground)`.
- Secondary text: `var(--muted-foreground)`.
- Labels: `var(--muted-foreground)`.
- Interactive/progress text: `var(--primary)`.
- AI-related text accents: `var(--primary)` by default; optional subtle indigo only as rare detail.
- Achievement/milestone accents: `var(--primary)`, `var(--accent-warm)`, `var(--accent-copper)` или `var(--accent-gold)`.

Не использовать случайные HEX-цвета в компонентах. Текст должен ссылаться на semantic tokens.

### 10.11. Responsive typography

Desktop:

- page title: 32px;
- major metrics: 40-48px.

Tablet:

- page title: 28-32px;
- major metrics: 36-40px.

Mobile:

- page title: 24-28px;
- section title: 20-22px;
- card title: 16-18px;
- body: 15-16px;
- nav/bottom tab: 11-13px.

Важно:

- на mobile не уменьшать body text ниже 14px;
- читаемость важнее попытки втиснуть все на экран.

### 10.12. Запреты

Нельзя:

- использовать Oxanium для всего интерфейса;
- делать весь UI uppercase;
- использовать слишком много разных font weights;
- использовать декоративные шрифты;
- использовать sci-fi fonts для body text;
- делать XP/Level игровыми;
- делать маленький серый текст с плохим контрастом;
- использовать случайные размеры без токенов;
- делать каждый блок с разной типографикой;
- использовать italic как декоративный стиль без необходимости.

### 10.13. Разделение brand rules и technical tokens

В `BRAND_FOUNDATION.md` фиксируются продуктовые правила типографики.

В `docs/UI_TOKENS.md` фиксируются технические typography tokens и правила применения в интерфейсе.

## 11. Блок 5 - Spacing, Layout Grid и Radius System

Spacing, layout grid и radius system Lifera Design System v0.1 должны создавать предсказуемую основу для всех экранов. Lifera не должна собираться из случайных отступов, разной ширины layout-зон и несогласованных скруглений.

Интерфейс должен быть:

- чистым;
- современным;
- премиальным;
- хорошо читаемым;
- не перегруженным;
- не игровым;
- не похожим на crypto-dashboard;
- пригодным для light и dark theme;
- удобным для desktop, tablet и mobile.

### 11.1. Основной принцип layout

Lifera использует структуру:

- desktop: fixed left sidebar + topbar + central content area + optional right AI Ассистент rail;
- tablet: compact sidebar или collapsed navigation;
- mobile: bottom navigation + stacked content.

Основной desktop shell:

- fixed sidebar слева;
- topbar сверху;
- центральная рабочая область;
- правая AI Ассистент / insight rail только там, где она нужна.

Не делать:

- стену одинаковых карточек;
- хаотичные отступы;
- слишком плотный dashboard;
- слишком большие пустоты без смысла;
- разные radius/spacing для одинаковых компонентов.

### 11.2. Spacing scale

Использовать 4px-based spacing scale.

Рекомендуемые spacing tokens:

```css
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
```

Правило:

- мелкие элементы: 4-8px;
- элементы внутри карточек: 12-16px;
- card padding: 20-24px;
- gap между карточками: 16-24px;
- gap между крупными секциями: 32-48px;
- page padding: 24-32px на desktop.

### 11.3. Page padding

Desktop:

- page horizontal padding: 28-32px;
- page vertical padding: 24-32px;
- если экран широкий, контент не должен прилипать к краям.

Tablet:

- page horizontal padding: 20-24px;
- page vertical padding: 20-24px.

Mobile:

- page horizontal padding: 16px;
- page vertical padding: 16-20px;
- bottom padding должен учитывать bottom navigation: минимум 80-96px.

Tokens:

```css
--page-padding-desktop: 32px;
--page-padding-tablet: 24px;
--page-padding-mobile: 16px;
```

### 11.4. App shell dimensions

Desktop sidebar:

- width: 280px;
- compact/collapsed width в будущем: 80px;
- sidebar padding: 20-24px;
- nav item height: 40-44px;
- nav item gap: 4-6px;
- section gap: 20-24px.

Tokens:

```css
--sidebar-width: 280px;
--sidebar-width-collapsed: 80px;
--sidebar-padding: 24px;
--nav-item-height: 42px;
```

Topbar:

- height: 72px;
- horizontal padding: 24-32px;
- должен содержать title/context, search/command, primary action, level/profile.

Tokens:

```css
--topbar-height: 72px;
--topbar-padding-x: 32px;
```

Right AI Ассистент rail:

- width: 340-380px;
- preferred: 360px;
- gap до main content: 24px;
- на tablet/mobile уходит ниже контента или становится drawer.

Token:

```css
--right-rail-width: 360px;
```

### 11.5. Content max-width

Dashboard:

- full app width используется внутри shell;
- main content должен быть гибким;
- не задавать слишком маленький max-width для dashboard.

Public/auth/onboarding screens:

- auth form max-width: 420-460px;
- onboarding content max-width: 960-1120px;
- public shell content max-width: 1120-1200px.

Tokens:

```css
--content-max-width: 1200px;
--content-wide-max-width: 1440px;
--auth-card-width: 440px;
--onboarding-max-width: 1120px;
```

### 11.6. Layout grid

Desktop dashboard grid:

- использовать 12-column mental model;
- gap: 20-24px;
- главный блок должен занимать больше пространства, чем вторичные карточки;
- не делать все блоки одинакового размера.

Рекомендуемая dashboard структура:

- main content area: 2/3 ширины;
- right AI rail: 1/3 или фиксированная 360px;
- внутри main content:
  - hero/focus block: full width;
  - secondary modules: 2-column или 3-column grid;
  - lower sections: full-width или mixed layout.

CSS-подход:

- использовать CSS Grid/Flex;
- не хардкодить пиксельные позиции;
- не делать absolute layout для основных блоков.

Dashboard grid tokens:

```css
--grid-gap: 24px;
--grid-gap-compact: 16px;
--section-gap: 32px;
```

### 11.7. Card padding

Large cards / hero cards:

- padding: 28-32px;
- gap внутри: 20-24px.

Regular cards:

- padding: 20-24px;
- gap внутри: 16px.

Compact cards:

- padding: 14-16px;
- gap внутри: 10-12px.

Mobile cards:

- padding: 16px;
- gap внутри: 12px.

Tokens:

```css
--card-padding-sm: 16px;
--card-padding-md: 24px;
--card-padding-lg: 32px;
--card-gap: 16px;
```

### 11.8. Radius system

Lifera должна выглядеть мягко и современно, но не игрушечно.

Не делать все элементы слишком круглыми. Не делать полностью pill-style интерфейс везде. Скругления должны быть взрослыми, premium SaaS, аккуратными.

Radius tokens:

```css
--radius-xs: 6px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 999px;
```

Использование:

- Cards: regular cards 18-20px, large hero cards 22-24px, compact cards 14-16px.
- Controls: buttons, inputs, selects и nav items 12px.
- Badges / pills: small badges 999px или 10-12px; progress chips и status pills 999px.
- Progress bars: 999px.
- App icon: master 1024x1024; visual corner radius 22-24%; safe area 16-20%.

Recommended tokens:

```css
--radius-card: 20px;
--radius-card-lg: 24px;
--radius-control: 12px;
--radius-badge: 999px;
--radius-progress: 999px;
```

### 11.9. Component sizing

Buttons:

- small height: 36px;
- medium height: 42px;
- large height: 48px;
- small horizontal padding: 12-14px;
- medium horizontal padding: 16-18px;
- large horizontal padding: 20-24px.

Tokens:

```css
--button-height-sm: 36px;
--button-height-md: 42px;
--button-height-lg: 48px;
```

Inputs:

- medium height: 44px;
- large/search input: 48px;
- padding x: 14-16px.

Tokens:

```css
--input-height-md: 44px;
--input-height-lg: 48px;
```

Badges:

- height: 24-28px;
- padding x: 8-12px.

Nav items:

- height: 40-44px;
- padding x: 12-14px;
- icon size: 18-20px.

Icons:

- nav icon: 18-20px;
- card icon: 20-24px;
- compact icon: 16px;
- feature/metric icon: 24-28px.

### 11.10. Responsive layout rules

Desktop >= 1280px:

- fixed sidebar 280px;
- topbar 72px;
- dashboard can use main area + right rail;
- grid gap 24px.

Laptop 1024-1279px:

- sidebar can stay 260-280px;
- right AI rail may become narrower or move below;
- grid can become 2-column.

Tablet 768-1023px:

- sidebar can collapse or become drawer;
- topbar remains;
- dashboard becomes 2-column or stacked;
- right AI rail moves below main content.

Mobile < 768px:

- no fixed sidebar;
- use bottom navigation;
- content stacked vertically;
- page padding 16px;
- cards full width;
- right AI panel becomes normal section;
- sticky bottom nav height 64-72px.

### 11.11. Layout hierarchy rules

Dashboard hierarchy:

- one dominant hero/focus block;
- one progress summary area;
- secondary modules below;
- AI Ассистент rail should be visually important but not overpower the main focus;
- achievements should be compact and premium, not huge game cards.

Do not:

- make all cards equal weight;
- make all blocks same size;
- create 12 similar dashboard tiles;
- use too many nested cards;
- place key action too far from focus block.

### 11.12. Light/Dark compatibility

Spacing and radius must be identical in light and dark themes. Only colors, contrast, borders and shadows change.

Light theme:

- cards can use softer shadows;
- borders can be subtle;
- surfaces should be clean and calm.

Dark theme:

- rely more on borders and surface contrast;
- shadows should be subtle;
- glow only for important accents and not as default card styling.

### 11.13. Suggested CSS tokens

Technical CSS tokens for spacing, layout dimensions and radius are fixed in `docs/UI_TOKENS.md`.

### 11.14. Запреты

Нельзя:

- использовать случайные spacing значения без системы;
- делать разные card padding в одинаковых компонентах;
- делать sidebar разной ширины на разных страницах без причины;
- делать topbar разной высоты без причины;
- использовать слишком большие radius, из-за которых UI становится игрушечным;
- делать все элементы pill-shaped;
- делать карточки слишком плотными;
- делать dashboard стеной одинаковых плиток;
- ломать layout между light/dark themes;
- хардкодить layout через absolute positioning без необходимости.

### 11.15. Разделение brand rules и technical tokens

В `BRAND_FOUNDATION.md` фиксируются продуктовые правила spacing, layout grid и radius system.

В `docs/UI_TOKENS.md` фиксируются технические CSS tokens и правила применения в интерфейсе.

## 12. Блок 6 - Surfaces, Borders, Shadows, Glow и Elevation System

Этот блок фиксирует визуальную глубину интерфейса Lifera Design System v0.2.

Контекст:

Lifera - Minimal Premium Life Performance OS / Warm Graphite Personal Command Center.

Продукт должен выглядеть как:

- минималистичная premium personal OS;
- теплый graphite command center;
- серьезный dashboard для целей, прогресса и достижений;
- взрослый SaaS-интерфейс;
- не игра;
- не crypto dashboard;
- не cyberpunk;
- не medical dashboard.

Главная задача блока: описать, какие поверхности используются, как они отделяются друг от друга, где допустимы тени и glow, а где интерфейс должен оставаться плоским, спокойным и структурным.

Основной принцип:

Lifera использует graphite-поверхности, тонкие warm borders, мягкую глубину и редкий warm glow только для важных состояний прогресса, действия или достижения.

Финальная формулировка:

Surfaces в Lifera создают спокойную иерархию: background задает контекст, cards группируют смысл, elevated surfaces выделяют важные действия и рекомендации. Borders и shadows используются для структуры, а glow - только как редкий warm progress/accent state. Интерфейс должен ощущаться как персональный command center, но без neon, crypto-dashboard и cyberpunk overload.

### 12.1. Surface levels

#### Background

Базовый фон приложения.

Dark theme:

- near-black / graphite base;
- не чисто черный;
- должен быть мягким и глубоким.

Light theme:

- warm off-white base;
- не чисто белый;
- должен быть спокойным и премиальным.

Use cases:

- общий фон приложения;
- фон app shell;
- фон публичных страниц.

#### Surface

Основные панели и карточки.

Use cases:

- обычные dashboard cards;
- sidebar sections;
- простые widgets;
- form cards;
- list containers.

Принцип: surface должен быть чуть заметнее background, но не спорить с контентом.

#### Surface Muted

Вторичные блоки, списки, hover-зоны и muted containers.

Use cases:

- nested rows;
- secondary list items;
- muted info blocks;
- inactive tabs;
- subtle hover areas;
- secondary cards.

Принцип: surface muted используется для спокойного разделения внутри карточек.

#### Surface Elevated

Важные карточки, dashboard-блоки, modal/dialog surfaces.

Use cases:

- главный focus block;
- important dashboard card;
- AI Ассистент rail/card;
- modal;
- dropdown;
- command palette;
- toast;
- onboarding card.

Принцип: surface elevated должен ощущаться важнее обычной карточки, но не "парить" как рекламный баннер.

#### Overlay

Затемнение под modal, drawer, command palette.

Use cases:

- modal overlay;
- drawer overlay;
- command palette overlay;
- full-screen focus state.

Принцип: overlay должен затемнять контекст, не превращая экран в драматическую сцену.

### 12.2. Surface tokens

Технические tokens фиксируются в `docs/UI_TOKENS.md`.

Light theme:

```css
:root {
  --background: #F7F5F2;
  --surface: #FFFFFF;
  --surface-muted: #F0ECE7;
  --surface-elevated: #FFFFFF;
  --overlay: rgba(17, 17, 17, 0.48);
}
```

Dark theme:

```css
.dark {
  --background: #090909;
  --surface: #121212;
  --surface-muted: #191817;
  --surface-elevated: #211F1C;
  --overlay: rgba(0, 0, 0, 0.62);
}
```

Правила:

- нельзя делать много случайных оттенков серого;
- каждый surface level должен иметь понятную роль;
- если нужен новый оттенок, сначала проверить, нельзя ли использовать существующий token;
- light и dark theme должны иметь одинаковую структуру surface levels.

### 12.3. Borders

Borders должны быть тонкими, системными и спокойными.

Основной принцип:

Border отделяет структуру, а не пытается быть главным визуальным эффектом.

Light theme tokens:

```css
:root {
  --border: #E5DED6;
  --border-strong: #D6CABC;
  --border-primary-subtle: rgba(234, 88, 12, 0.24);
  --border-primary-strong: rgba(234, 88, 12, 0.48);
}
```

Dark theme tokens:

```css
.dark {
  --border: #2A2723;
  --border-strong: #3A342D;
  --border-primary-subtle: rgba(249, 115, 22, 0.26);
  --border-primary-strong: rgba(249, 115, 22, 0.52);
}
```

Rules:

- обычные карточки используют subtle neutral border;
- активные элементы могут использовать warm border через primary orange с низкой прозрачностью;
- важные progress / milestone blocks могут иметь warm border;
- AI Ассистент может иметь subtle warm border, если он часть общего warm graphite style;
- error / success / warning borders используются только для статусов;
- нельзя использовать neon borders;
- нельзя делать все карточки с яркой orange-рамкой;
- нельзя использовать border как основной декоративный эффект.

Use cases:

- regular card: `var(--border)`;
- elevated card: `var(--border-strong)`;
- active card: `var(--border-primary-subtle)`;
- selected/important state: `var(--border-primary-strong)`, но только точечно.

### 12.4. Shadows

Тени должны быть мягкими, дорогими и редкими.

Основной принцип:

Light theme может использовать мягкие shadows для отделения карточек. Dark theme чаще использует border + surface contrast, а не тяжелые shadows.

Tokens:

```css
:root {
  --shadow-sm: 0 1px 2px rgba(17, 17, 17, 0.06);
  --shadow-md: 0 8px 24px rgba(17, 17, 17, 0.08);
  --shadow-lg: 0 18px 48px rgba(17, 17, 17, 0.12);
}

.dark {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 10px 28px rgba(0, 0, 0, 0.32);
  --shadow-lg: 0 22px 56px rgba(0, 0, 0, 0.42);
}
```

Rules:

- regular cards usually do not need strong shadows;
- elevated cards can use soft shadow;
- modals/dropdowns/command palette can use stronger shadow;
- dashboard не должен состоять из одинаково "парящих" карточек;
- dark theme не должен полагаться только на shadows;
- нельзя использовать harsh drop shadows;
- нельзя делать crypto-style glow вокруг каждой карточки;
- тени должны усиливать структуру, а не создавать визуальный шум.

Use cases:

- regular card: no shadow or `--shadow-sm`;
- important card: `--shadow-md`;
- modal/dialog/command palette: `--shadow-lg`;
- toast/dropdown: `--shadow-md` or `--shadow-lg` depending on context.

### 12.5. Glow

Glow допустим только как редкий смысловой акцент.

Основной принцип:

Glow должен означать фокус, прогресс или достижение, а не украшать интерфейс.

Цвет glow:

- warm amber/orange family;
- не neon;
- не кислотный;
- не фиолетовый по умолчанию;
- не cyberpunk.

Tokens:

```css
:root {
  --glow-primary-subtle: 0 0 0 1px rgba(234, 88, 12, 0.18), 0 8px 24px rgba(234, 88, 12, 0.12);
  --glow-primary-md: 0 0 0 1px rgba(234, 88, 12, 0.28), 0 12px 36px rgba(234, 88, 12, 0.18);
}

.dark {
  --glow-primary-subtle: 0 0 0 1px rgba(249, 115, 22, 0.18), 0 10px 30px rgba(249, 115, 22, 0.14);
  --glow-primary-md: 0 0 0 1px rgba(249, 115, 22, 0.32), 0 16px 48px rgba(249, 115, 22, 0.22);
}
```

Где можно использовать glow:

- active navigation state, очень мягко;
- primary progress highlight;
- current level / XP highlight;
- milestone или achievement unlock;
- primary CTA в hero/focus block;
- focused system message;
- AI Ассистент card, если glow очень мягкий и warm, а не фиолетовый.

Где нельзя использовать glow:

- вокруг всех карточек;
- вокруг логотипа на каждом экране;
- на каждом progress bar;
- в таблицах и списках;
- на каждом hover state;
- как декоративный cyberpunk-эффект;
- вокруг обычных form fields;
- вокруг всех icons.

Правило: если glow не помогает понять, что элемент важный, активный или достиженческий, glow не нужен.

### 12.6. Elevation levels

#### Level 0 - Page Background

Use cases:

- app background;
- public page background;
- base shell background.

Surface: background token.

Border: none.

Shadow: none.

Glow: none.

#### Level 1 - Regular Card / List Item

Use cases:

- обычные карточки;
- list containers;
- secondary widgets;
- form sections.

Surface: `var(--surface)`.

Border: `var(--border)`.

Shadow: none or `--shadow-sm` in light theme.

Glow: none.

#### Level 2 - Important Dashboard Card / Sidebar / Topbar Surface

Use cases:

- главный focus block;
- важные dashboard cards;
- sidebar surface;
- topbar surface;
- right rail container;
- highlighted progress card.

Surface: `var(--surface-elevated)` or `var(--surface)`.

Border: `var(--border)` or `var(--border-strong)`.

Shadow: `--shadow-sm` / `--shadow-md` depending on theme.

Glow: only if active/important, use `--glow-primary-subtle`.

#### Level 3 - Modal / Dropdown / Command Palette / Toast

Use cases:

- modal;
- dropdown;
- command palette;
- popover;
- toast;
- drawer.

Surface: `var(--surface-elevated)`.

Border: `var(--border-strong)`.

Shadow: `--shadow-lg`.

Glow:

- generally none;
- subtle glow allowed only for focused command palette or important system message.

#### Level 4 - Critical Overlay / Focused System Message

Use cases:

- critical modal;
- major achievement unlock;
- onboarding completion;
- important progress moment;
- destructive confirmation.

Surface: `var(--surface-elevated)`.

Border: status border or primary strong border depending on meaning.

Shadow: `--shadow-lg`.

Glow:

- `--glow-primary-md` only for achievement/progress moment;
- danger glow only if specifically defined later, not by default.

### 12.7. Hover / active / focus elevation

Hover / active / focus states должны быть спокойными.

Rules:

- hover слегка усиливает surface или border;
- active state может использовать primary orange;
- focus state всегда видимый через focus ring;
- hover не должен резко менять размер компонента;
- карточки не должны "подпрыгивать";
- elevation change должен быть спокойным;
- transform допустим максимум `translateY(-1px)`, но лучше не использовать как стандарт;
- transitions должны быть короткими и аккуратными.

Recommended behavior:

Neutral card hover:

- surface становится чуть светлее;
- border становится чуть сильнее.

Clickable card hover:

- border: `var(--border-strong)`;
- optional shadow: `--shadow-sm`.

Primary action hover:

- primary becomes deeper through `--primary-hover`.

Active nav:

- subtle primary surface;
- readable text;
- small warm border or accent line;
- no strong glow by default.

Focus state:

- use `--focus-ring`;
- focus must be visible in both light and dark themes.

Focus tokens:

```css
:root {
  --focus-ring: 0 0 0 3px rgba(234, 88, 12, 0.24);
}

.dark {
  --focus-ring: 0 0 0 3px rgba(249, 115, 22, 0.28);
}
```

### 12.8. Dashboard surface rules

Dashboard особенно важно не превратить в набор одинаковых карточек.

Rules:

- главный focus block может быть visually elevated;
- secondary metrics должны быть спокойнее;
- right rail / AI Ассистент может иметь отдельный elevated treatment;
- achievements и XP не должны превращаться в game panel;
- charts должны сидеть на спокойных поверхностях;
- key chart highlight can use orange;
- inactive chart elements should use muted colors;
- не делать все блоки одинаковой высоты, яркости и elevation.

Dashboard hierarchy:

1. Main focus/progress block - highest visual weight.
2. AI Ассистент/right rail - strong but secondary.
3. Goals/habits/metrics cards - regular elevation.
4. Achievements/milestones - warm accents, but compact.
5. Lists/tables - calm, flat, readable.

Specific:

- focus block can use surface-elevated + border-primary-subtle;
- progress/XP can use warm highlight;
- achievements can use warm glow only on unlock moment;
- regular dashboard cards should remain mostly flat;
- tables and lists should not glow.

### 12.9. Light theme rules

Light theme:

- background: warm off-white;
- cards: white or warm white;
- shadows: allowed, soft and subtle;
- borders: warm neutral;
- primary orange should be used for CTA/active/progress;
- avoid large orange blocks unless it is hero/brand moment;
- avoid low-contrast muted text.

Light theme recommended:

- regular card: white surface + neutral border + optional shadow-sm;
- elevated card: white surface + border-strong + shadow-md;
- active item: primary-subtle background + primary text/border.

### 12.10. Dark theme rules

Dark theme:

- background: near-black;
- cards: graphite surfaces;
- use border + surface contrast more than shadow;
- glow must be rare and warm;
- avoid pure black + pure white harsh contrast where possible;
- avoid blue/purple cyberpunk glow.

Dark theme recommended:

- regular card: surface + border;
- elevated card: surface-elevated + border-strong + shadow-sm/md;
- active item: dark primary-subtle + warm border/text;
- primary action: orange button;
- key metric: off-white text with warm accent.

### 12.11. Anti-patterns

Запрещено:

- cyberpunk neon glow;
- crypto-dashboard glassmorphism;
- excessive blur/backdrop effects;
- много translucent panels без причины;
- кислотные border highlights;
- heavy shadows в dark theme;
- glowing logo everywhere;
- карточки внутри карточек без причины;
- одинаковая elevation для всех блоков;
- случайные оттенки gray/black;
- "премиальность" через блеск вместо структуры;
- orange outline у каждой карточки;
- glow вокруг всех progress bars;
- фиолетовый AI glow по умолчанию;
- игровые achievement panels;
- 3D/glass/bevel effects в базовом UI.

### 12.12. Technical tokens

Technical CSS tokens для overlay, borders, shadows, glow и focus ring фиксируются в `docs/UI_TOKENS.md`.

Минимальный набор:

- `--overlay`;
- `--border-primary-subtle`;
- `--border-primary-strong`;
- `--shadow-sm`;
- `--shadow-md`;
- `--shadow-lg`;
- `--glow-primary-subtle`;
- `--glow-primary-md`;
- `--focus-ring`.

### 12.13. Разделение brand rules и technical tokens

В `BRAND_FOUNDATION.md` фиксируются продуктовые правила surface hierarchy, elevation, dashboard structure и anti-patterns.

В `docs/UI_TOKENS.md` фиксируются технические CSS tokens и правила их применения.

## 13. Блок 7 - Components / UI Primitives

Этот блок фиксирует базовые UI-компоненты Lifera Design System v0.2.

Контекст:

Lifera - Minimal Premium Life Performance OS / Warm Graphite Personal Command Center.

Продукт должен выглядеть как:

- минималистичная premium personal OS;
- теплый graphite command center;
- серьезный dashboard для целей, прогресса, привычек, достижений и AI Ассистента;
- взрослый SaaS-интерфейс;
- не игра;
- не fantasy RPG;
- не crypto dashboard;
- не cyberpunk;
- не medical dashboard.

Главная задача блока: сделать компоненты Lifera предсказуемыми, взрослыми и системными, чтобы интерфейс не распадался на случайные карточки, кнопки, badges и progress-блоки.

Основной принцип:

UI primitives в Lifera должны выглядеть как инструменты персональной операционной системы, а не как игровые элементы.

Primary orange используется для:

- действия;
- прогресса;
- выбора;
- фокуса;
- достижения;
- milestone;
- key CTA.

Neutral style используется для:

- структуры;
- вторичных действий;
- повседневных состояний;
- форм;
- списков;
- обычных dashboard cards.

Финальная формулировка:

Components в Lifera должны быть спокойными, системными и функциональными. Primary orange используется для действия, прогресса, выбора и достижения. Neutral surfaces остаются основой интерфейса. Даже XP, Level и Achievements должны выглядеть как аналитика персонального прогресса, а не как игровые награды.

### 13.1. Component list

Базовые UI primitives Lifera:

- Button;
- Card;
- Input;
- Textarea;
- Select;
- Badge;
- Status Pill;
- Progress Bar;
- Tabs;
- Segmented Control;
- Metric Card;
- Empty State;
- Modal / Dialog;
- Toast / Notification;
- Tooltip;
- Dropdown;
- Table Row;
- List Item.

Core MVP может реализовывать их постепенно, но дизайн-правила нужно зафиксировать заранее.

Если компонент еще не реализуется в коде, все равно нужно фиксировать правила в документации, чтобы будущая реализация не разъехалась по стилям.

### 13.2. Global component rules

Все компоненты должны:

- использовать design tokens, а не случайные HEX-цвета;
- поддерживать light и dark theme;
- иметь понятные states: default, hover, active, focus, disabled, loading where applicable;
- сохранять спокойный SaaS-вид;
- не использовать decorative glow без смысла;
- не быть слишком игровыми;
- не ломать responsive layout;
- иметь доступный focus state;
- использовать primary orange только там, где есть смысл действия, выбора, прогресса или достижения.

Запрещено:

- neon borders;
- excessive glow;
- glassmorphism без причины;
- fantasy/game icons;
- rainbow variants;
- разные стили одного компонента на разных страницах;
- кнопки и badges с произвольными цветами без semantic role;
- случайные gradients;
- сильные shadows на каждом компоненте;
- игровые achievement frames;
- arcade-style counters;
- декоративные 3D/bevel эффекты.

Компоненты должны опираться на текущие tokens.

Colors:

- `--background`;
- `--foreground`;
- `--surface`;
- `--surface-muted`;
- `--surface-elevated`;
- `--border`;
- `--border-strong`;
- `--primary`;
- `--primary-hover`;
- `--primary-soft`;
- `--primary-subtle`;
- `--primary-foreground`;
- `--success`;
- `--warning`;
- `--danger`;
- `--muted-foreground`.

Elevation:

- `--shadow-sm`;
- `--shadow-md`;
- `--shadow-lg`;
- `--glow-primary-subtle`;
- `--focus-ring`.

Radius:

- `--radius-card`;
- `--radius-card-lg`;
- `--radius-control`;
- `--radius-badge`;
- `--radius-progress`.

Sizing:

- `--button-height-sm`;
- `--button-height-md`;
- `--button-height-lg`;
- `--input-height-md`;
- `--input-height-lg`.

### 13.3. Button

Button - основной компонент действия.

Variants:

- `primary`;
- `secondary`;
- `ghost`;
- `danger`;
- `success`, только если реально нужен для статуса/подтверждения;
- `link`, опционально.

#### Primary Button

Использовать для главного действия на экране.

Examples:

- "Новая цель";
- "Добавить привычку";
- "Продолжить";
- "Получить план";
- "Сохранить";
- "Создать первую цель".

Style:

- background: `var(--primary)`;
- color: `var(--primary-foreground)`;
- hover: `var(--primary-hover)`;
- focus: `var(--focus-ring)`;
- border: transparent или primary border;
- loading: spinner + disabled interaction.

Rules:

- Primary orange нельзя использовать для всех кнопок подряд.
- На экране желательно иметь один главный primary CTA.
- Если на экране много orange-кнопок, значит иерархия сломана.
- Primary button должен быть заметным, но не кричащим.
- Glow для primary button допустим только в hero/focus block и очень мягкий.

#### Secondary Button

Использовать для альтернативных действий.

Examples:

- "Подробнее";
- "Отмена";
- "Смотреть все";
- "Изменить";
- "Пропустить";
- "Вернуться".

Style:

- neutral surface;
- border: `var(--border)`;
- color: `var(--foreground)`;
- hover: `var(--surface-muted)` или `var(--border-strong)`;
- no glow.

#### Ghost Button

Использовать для тихих действий:

- icon-only buttons;
- table actions;
- compact toolbar;
- sidebar utility actions;
- close buttons;
- secondary menu actions.

Rules:

- Ghost button не должен конкурировать с primary action.
- Hover должен быть мягким через surface-muted.
- Не использовать яркий orange background для ghost hover.

#### Danger Button

Использовать только для destructive actions:

- удалить цель;
- удалить привычку;
- сбросить данные;
- отключить интеграцию.

Rules:

- Danger не должен использоваться как декоративный red CTA.
- Для destructive confirmation лучше использовать спокойную визуальную подачу.
- Danger должен быть очевидным, но не драматичным.

#### Button sizes

Small:

- height: 36px;
- use cases: compact actions, table actions, toolbar.

Medium:

- height: 42px;
- default for forms/actions.

Large:

- height: 48px;
- onboarding/auth primary actions;
- hero/focus block CTA.

Recommended tokens:

- `--button-height-sm: 36px`;
- `--button-height-md: 42px`;
- `--button-height-lg: 48px`.

#### Button states

States:

- default;
- hover;
- active;
- focus;
- disabled;
- loading.

Loading state:

- текст может оставаться;
- spinner слева или справа;
- кнопка disabled;
- не менять размер кнопки;
- не прыгать layout;
- cursor/interaction disabled.

Disabled:

- opacity reduced;
- no hover glow;
- no active change;
- should remain readable enough.

### 13.4. Card

Card - основной контейнер смысла.

Variants:

- `default`;
- `muted`;
- `elevated`;
- `interactive`;
- `highlight`;
- `danger` только для критических состояний.

#### Default Card

Use cases:

- обычные dashboard widgets;
- list sections;
- form sections;
- regular content blocks.

Style:

- surface: `var(--surface)`;
- border: `var(--border)`;
- shadow: none или `var(--shadow-sm)`;
- radius: `var(--radius-card)`.

#### Muted Card

Use cases:

- вторичные блоки внутри страницы;
- nested rows;
- subtle info blocks;
- inactive panels.

Style:

- surface: `var(--surface-muted)`;
- border: subtle;
- no glow;
- minimal shadow.

#### Elevated Card

Use cases:

- focus block;
- AI Ассистент card;
- modal content;
- onboarding card;
- important dashboard card.

Style:

- surface: `var(--surface-elevated)`;
- border: `var(--border-strong)`;
- shadow: `var(--shadow-md)`;
- radius: `var(--radius-card-lg)`.

Rules:

- Elevated card должна быть важной по смыслу.
- Не делать все карточки elevated.

#### Interactive Card

Use cases:

- clickable goals;
- habits;
- tasks;
- achievement preview;
- life area cards.

Hover:

- border становится сильнее;
- surface slightly elevated;
- no strong glow;
- optional `translateY(-1px)` только если это принято системно;
- не делать карточки "прыгающими".

#### Highlight Card

Use cases:

- key progress state;
- milestone;
- current level;
- achievement unlock;
- main focus card.

Style:

- border: `var(--border-primary-subtle)`;
- optional very subtle warm glow;
- orange accent только точечно.

Rules:

- Нельзя делать все dashboard cards highlight.
- Highlight нужен только для важного состояния.
- Highlight не должен превращаться в игровую карточку.

#### Danger Card

Use cases:

- destructive confirmation;
- critical alert;
- major risk state.

Rules:

- использовать только по реальному смыслу;
- не использовать как красивый красный блок.

### 13.5. Input

Input используется для:

- auth;
- goals;
- tasks;
- habits;
- settings;
- search;
- command input.

Variants:

- `default`;
- `error`;
- `success`, редко;
- `disabled`;
- `read-only`.

Sizes:

- `md`: 44px;
- `lg`: 48px для search/command/auth.

States:

- default;
- hover;
- focus;
- error;
- disabled;
- loading/read-only.

Rules:

- label всегда выше поля;
- placeholder не заменяет label;
- error text под полем;
- help text ниже label или под полем;
- focus через `var(--focus-ring)`;
- error border только для ошибок;
- orange focus допустим, но не должен выглядеть как warning;
- input должен быть спокойным и не конкурировать с CTA.

Style:

- background: `var(--surface)`;
- border: `var(--border)`;
- color: `var(--foreground)`;
- placeholder: `var(--muted-foreground)`;
- radius: `var(--radius-control)`.

### 13.6. Textarea

Textarea используется для:

- описания целей;
- заметок;
- AI prompts;
- reflections;
- long-form user input.

Rules:

- minimum height: 96-120px;
- resize vertical можно разрешить;
- label обязателен;
- help/error text как у Input;
- не использовать auto-growing без необходимости;
- не делать textarea похожим на chat input, если это обычная форма;
- focus через `var(--focus-ring)`;
- не использовать glow.

### 13.7. Select

Select используется для выбора:

- сферы жизни;
- статуса;
- приоритета;
- периода;
- фильтра;
- режима отображения.

Variants:

- `default`;
- `error`;
- `disabled`.

Rules:

- должен выглядеть как form control, а не как badge;
- chevron icon справа;
- selected value readable;
- dropdown surface elevated;
- active option может использовать subtle primary background;
- не использовать яркие цвета для всех options;
- disabled должен быть очевиден.

Style:

- height similar to input;
- radius: `var(--radius-control)`;
- border: `var(--border)`;
- dropdown: `var(--surface-elevated)`, border-strong, shadow-md/lg.

### 13.8. Badge

Badge - компактный label, не кнопка.

Use cases:

- категория;
- тип;
- XP label;
- module status;
- milestone label;
- small metadata;
- tag;
- priority label.

Variants:

- `default`;
- `primary`;
- `muted`;
- `success`;
- `warning`;
- `danger`;
- `gold` optional для rare milestone.

Rules:

- badge не должен быть главным CTA;
- orange badge использовать для progress, XP, Level, milestone;
- success/warning/danger только по смыслу статуса;
- не делать badges слишком крупными;
- не использовать fantasy/game style;
- badge должен быть читаемым без зависимости только от цвета.

Recommended:

- height: 24-28px;
- padding x: 8-12px;
- radius: `var(--radius-badge)`;
- font-size: 12-13px.

### 13.9. Status Pill

Status pill показывает состояние объекта.

Use cases:

- goal status;
- task status;
- habit state;
- AI status;
- onboarding status;
- subscription/plan state.

Variants:

- `active`;
- `planned`;
- `completed`;
- `paused`;
- `missed`;
- `locked`;
- `draft`.

Rules:

- статус должен быть понятен по тексту, не только по цвету;
- completed может быть success;
- missed/risk может быть warning/danger;
- active может использовать primary-subtle;
- locked/draft - muted;
- не использовать яркие цвета без semantic reason.

Examples:

- Активна;
- Запланировано;
- Выполнено;
- На паузе;
- Пропущено;
- Заблокировано;
- Черновик.

### 13.10. Progress Bar

Progress bar - ключевой primitive Lifera.

Use cases:

- goal progress;
- habit completion;
- onboarding progress;
- XP to next level;
- life area progress;
- weekly progress.

Variants:

- `default`;
- `primary`;
- `success`;
- `warning`;
- `muted`.

Rules:

- orange использовать для ключевого прогресса;
- muted gray для secondary progress;
- green/red только для статусов;
- label и percentage должны быть доступны;
- progress не должен светиться по умолчанию;
- glow только для important milestone/current level;
- progress bar должен быть спокойным, не game HUD.

Recommended:

- height regular: 8-10px;
- height compact: 6px;
- height large: 12px;
- radius: `var(--radius-progress)`.

Examples:

- XP до следующего уровня - primary.
- Прогресс цели - primary или muted + primary fill.
- Выполнено успешно - success.
- Риск/отставание - warning.

### 13.11. Tabs

Tabs используются для переключения views внутри раздела.

Use cases:

- goals: active / completed / archived;
- tasks: today / upcoming / completed;
- achievements: earned / locked;
- settings groups;
- habit views.

Variants:

- `underline`;
- `contained`;
- `compact`.

Rules:

- active tab может использовать primary orange;
- inactive tabs neutral;
- tabs не должны выглядеть как игровые категории;
- tabs не использовать для основной app navigation, только внутри страницы;
- active state должен быть видимым в light и dark theme.

### 13.12. Segmented Control

Segmented control используется для короткого выбора режима.

Use cases:

- day/week/month;
- list/calendar;
- light/system/dark в будущем;
- priority filters;
- AI mode, если будет нужно.

Rules:

- 2-5 options максимум;
- selected state через primary-subtle или elevated surface;
- не использовать для длинных labels;
- не заменять tabs, если переключаются полноценные страницы;
- compact, calm, neutral by default.

### 13.13. Metric Card

Metric card показывает одну важную метрику.

Use cases:

- XP;
- Level;
- streak;
- today completion;
- goals count;
- habit consistency;
- weekly progress.

Structure:

- label;
- value;
- delta/detail;
- optional progress;
- optional icon.

Rules:

- metric value крупный, но не arcade/game;
- orange только для ключевого value или highlight;
- delta green/red только при реальной динамике;
- не делать все metric cards одинаково яркими;
- dashboard должен сканироваться за 5 секунд;
- XP/Level выглядят как personal analytics, не как RPG counter.

Metric typography:

- large metric: 40-48px;
- medium metric: 28-32px;
- small metric: 20-24px.

Examples:

- Level 7;
- 1 640 XP;
- 7 дней streak;
- 3 из 4 привычек.

### 13.14. Empty State

Empty state должен вести к следующему действию.

Use cases:

- empty goals;
- empty tasks;
- empty habits;
- no achievements;
- no AI recommendations;
- no finance data;
- no health records.

Structure:

- title;
- short explanation;
- primary action;
- optional secondary action;
- optional subtle icon.

Examples:

- "Создайте первую цель";
- "Добавьте привычку";
- "AI Ассистент появится после первой цели";
- "Пока нет достижений";
- "Добавьте первую задачу".

Rules:

- не писать просто "Пусто";
- не использовать маркетинговый hero;
- не использовать большие игровые иллюстрации;
- primary CTA orange, если это главное действие;
- icon должен быть subtle, line-style, не мультяшный;
- empty state должен быть helpful, not sad.

### 13.15. Modal / Dialog

Modal используется для focused action.

Use cases:

- create/edit goal;
- confirm destructive action;
- onboarding step;
- detail preview;
- command palette в будущем;
- settings confirmation.

Rules:

- surface elevated;
- overlay спокойный;
- title clear;
- primary/secondary actions in footer;
- ESC/close behavior;
- focus trap;
- не использовать modal для всего подряд;
- destructive modal должен быть спокойным, не драматичным;
- no heavy glow.

Structure:

- header/title;
- optional description;
- body/content;
- footer actions;
- close button.

Style:

- surface: `var(--surface-elevated)`;
- border: `var(--border-strong)`;
- shadow: `var(--shadow-lg)`;
- overlay: `var(--overlay)`.

### 13.16. Toast / Notification

Toast сообщает результат действия.

Variants:

- `success`;
- `info`;
- `warning`;
- `danger`.

Use cases:

- goal saved;
- task completed;
- habit logged;
- AI unavailable;
- network/offline notice;
- settings updated.

Rules:

- короткий текст;
- без confetti;
- без game voice;
- не использовать toast для длинных объяснений;
- toast не должен перекрывать важные действия;
- action inside toast optional;
- status color only if semantic.

Examples:

- "Цель сохранена";
- "Привычка отмечена";
- "AI Ассистент временно недоступен";
- "Нет соединения".

### 13.17. Tooltip

Tooltip объясняет icon/action.

Use cases:

- icon-only buttons;
- stats explanation;
- progress formula;
- locked feature reason;
- keyboard shortcuts.

Rules:

- короткий текст;
- не использовать tooltip вместо нормального label;
- delay небольшой;
- должен работать с keyboard focus;
- surface elevated;
- no glow;
- readable contrast;
- не помещать важную информацию только в tooltip.

### 13.18. Dropdown

Dropdown для меню действий и выбора.

Use cases:

- task actions;
- goal actions;
- profile menu;
- filters;
- more menu;
- sort options.

Rules:

- elevated surface;
- border-strong;
- shadow-md/lg;
- active item subtle;
- destructive item danger text;
- icons optional;
- no colorful menu unless semantic;
- keyboard navigation should be possible;
- items should have predictable height.

Style:

- surface: `var(--surface-elevated)`;
- border: `var(--border-strong)`;
- radius: `var(--radius-control)` или `var(--radius-card)`;
- shadow: `var(--shadow-md)`.

### 13.19. Table Row

Table row нужен для плотных списков в будущем.

Use cases:

- tasks;
- logs;
- history;
- XP events;
- settings/integrations;
- finance records.

Rules:

- calm surface;
- border-bottom;
- hover через surface-muted;
- selected через primary-subtle;
- no glow;
- status через status pill;
- row height predictable;
- не делать таблицы похожими на crypto trading terminal.

Recommended:

- row height: 48-56px;
- compact row: 40-44px;
- cell text readable;
- metadata muted.

### 13.20. List Item

List item - более mobile-friendly вариант table row.

Use cases:

- tasks;
- habits;
- recommendations;
- recent achievements;
- dashboard summaries;
- mobile views.

Rules:

- readable title;
- secondary metadata;
- optional status pill;
- optional progress;
- tap target минимум 44px;
- hover/active спокойные;
- no card nesting without reason;
- no excessive colored icons.

Structure:

- optional icon/checkbox;
- title;
- subtitle/metadata;
- optional status/progress/action.

### 13.21. Primary orange usage

Primary orange использовать для:

- primary CTA;
- active navigation;
- selected tab/control;
- progress highlight;
- XP / Level highlight;
- milestone / achievement accent;
- focus ring;
- key chart highlight;
- important focus state.

Не использовать для:

- всех карточек;
- всех иконок;
- всех badges;
- обычного текста;
- neutral metadata;
- secondary buttons;
- фоновых декоративных блоков;
- каждого hover state;
- всех borders;
- всех progress bars одновременно.

Rule:

Orange is a signal of action, progress, selection or achievement. Orange is not a decoration layer.

### 13.22. Neutral style usage

Neutral style использовать для:

- secondary actions;
- regular cards;
- form fields;
- list rows;
- metadata;
- inactive tabs;
- table rows;
- settings UI;
- future modules;
- non-critical AI text.

Neutral style - это основа Lifera. Orange - акцент, а не фон всей системы.

Components by default should be neutral. Components become orange only when semantic role requires it.

### 13.23. Components that must not feel game-like

Нельзя делать игровыми:

- Button;
- Card;
- Metric Card;
- Progress Bar;
- Badge;
- Achievement Badge;
- Level / XP display;
- Toast;
- Modal;
- AI Ассистент Card.

Запрещено:

- сундуки;
- fantasy medals;
- RPG frames;
- excessive gold;
- confetti overload;
- cartoon icons;
- arcade counters;
- neon outlines;
- heavy glow;
- "level up" как игровой экран;
- reward shop aesthetic;
- inventory UI;
- fantasy badges.

Правило:

Даже XP, Level и Achievements должны выглядеть как аналитика персонального прогресса, а не как игровые награды.

### 13.24. Accessibility rules

Все компоненты должны:

- иметь visible focus state;
- не полагаться только на цвет;
- иметь достаточный contrast;
- иметь readable text;
- поддерживать keyboard interaction where applicable;
- иметь tap target минимум 44px на mobile;
- не использовать disabled state с нечитаемым текстом;
- сохранять layout при loading/error state.

Focus:

- использовать `var(--focus-ring)`;
- focus state должен быть виден в light и dark theme;
- не удалять outline без замены.

### 13.25. Responsive rules

Desktop:

- components can use regular spacing and md/lg sizes;
- dashboard cards can be multi-column.

Tablet:

- cards can become 2-column or stacked;
- controls remain readable.

Mobile:

- buttons full-width where appropriate;
- cards full-width;
- list items instead of dense tables;
- minimum tap target: 44px;
- no tiny badges/actions;
- bottom nav should not be blocked by floating components.

### 13.26. Разделение brand rules и technical tokens

В `BRAND_FOUNDATION.md` фиксируются смысловые правила компонентов, variants, states, anti-game restrictions, accessibility и responsive behavior.

В `docs/UI_TOKENS.md` фиксируются component-level token references and usage notes.

## 14. Блок 8 - Navigation System

Этот блок фиксирует навигационную систему Lifera Design System v0.2.

Контекст:

Lifera - Minimal Premium Life Performance OS / Warm Graphite Personal Command Center.

Цель блока: зафиксировать навигацию Lifera так, чтобы пользователь всегда понимал:

- где он находится;
- какие разделы являются основными;
- какие разделы являются системными;
- какие сущности находятся внутри разделов;
- какие модули можно добавить позже без разрушения структуры.

Главный принцип:

Навигация Lifera должна ощущаться как структура персональной ОС: спокойная, предсказуемая, взрослая, без игровых меню, glowing nav, перегруженных разделов и хаотичного списка функций.

### 14.1. Основные элементы навигации

Navigation system состоит из:

1. Sidebar - основная desktop-навигация.
2. Topbar - текущий контекст страницы, быстрые действия, будущий search/command.
3. Mobile Bottom Navigation - мобильная навигация по ключевым разделам.
4. Collapsed Sidebar - будущий режим компактной desktop-навигации.
5. Page Tabs - локальная навигация внутри разделов.
6. Breadcrumbs - опционально, только для вложенных/detail pages.
7. Command/Search Input - будущий быстрый поиск и команды.

### 14.2. Актуальный порядок sidebar разделов

Core Navigation v0.2.

Основные рабочие разделы:

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

Системная нижняя зона:

11. Настройки.
12. Профиль.

Финальный порядок sidebar:

- Главная;
- Действия;
- Проекты;
- Календарь;
- Цели;
- Достижения;
- Навыки;
- Финансы;
- Здоровье;
- AI Ассистент;
- Настройки;
- Профиль.

Профиль находится в самом низу sidebar или представлен как user block в нижней части sidebar.

### 14.3. Смысл каждого раздела

#### Главная

Главная - основной dashboard приложения.

Пользователь за 5 секунд должен понять:

- что сейчас важно;
- какой общий прогресс;
- какие задачи/привычки активны;
- какие цели двигаются;
- какие ближайшие события или планы есть;
- что рекомендует AI Ассистент;
- какие достижения/XP/серия есть.

В коде может соответствовать `/dashboard` или `/overview`. В UI использовать название "Главная".

#### Действия

Действия - раздел для ежедневных и повторяемых действий пользователя.

Внутри раздела используются локальные page tabs:

- Задачи;
- Привычки.

Возможное расширение позже:

- Сегодня;
- Завершенные.

Смысл:

- Задачи = разовые действия.
- Привычки = повторяемые действия.

Раздел отвечает на вопрос: "Что мне нужно делать?"

#### Проекты

Проекты - раздел для крупных рабочих направлений.

Проекты объединяют задачи, привычки и цели в более крупные блоки работы.

Пример:

- Цель: Запустить Lifera MVP.
- Проект: Сделать дизайн-систему.
- Действия: описать цвета, меню, компоненты, страницы.

Проекты могут быть связаны с целями, задачами, календарем и достижениями.

#### Календарь

Календарь - раздел для планирования задач, привычек, проектов и фокуса во времени.

Календарь помогает понять, когда именно пользователь будет выполнять действия.

Календарь не должен сразу превращаться в полноценный Google Calendar.

MVP-логика:

- день;
- неделя;
- месяц позже;
- задачи по датам;
- привычки на день;
- фокус дня;
- связанные проекты;
- связанные цели;
- быстрый перенос задачи.

Внутри можно использовать page tabs:

- Сегодня;
- Неделя;
- Месяц.

#### Цели

Цели - раздел для управления долгосрочными результатами пользователя.

Внутри раздела используются локальные page tabs:

- Цели;
- Желания.

По умолчанию активна вкладка "Цели".

Вкладка "Цели" - основное пространство для управления долгосрочными целями пользователя.

Вкладка "Желания" - мотивационный слой, где пользователь хранит материальные и жизненные хотелки:

- машина;
- квартира;
- путешествия;
- техника;
- вещи;
- опыт;
- крупные покупки.

Желания могут быть связаны с целями, финансами, задачами, привычками, проектами, XP, серией и условиями разблокировки.

Желания не являются отдельным пунктом sidebar. Они находятся внутри раздела "Цели".

#### Достижения

Достижения - раздел для фиксации прогресса пользователя.

Показывает:

- milestones;
- XP-события;
- уровни;
- streaks;
- завершенные цели;
- личные рекорды;
- разблокированные награды;
- важные результаты.

Достижения должны выглядеть как взрослая система прогресса, а не как игровые награды.

Не использовать:

- RPG-медали;
- сундуки;
- fantasy badges;
- excessive gold;
- confetti overload.

#### Навыки

Навыки - раздел для развития компетенций пользователя.

Пользователь может:

- добавить навык;
- указать текущий уровень;
- поставить цель по навыку;
- связать навык с задачами, привычками, проектами и целями;
- отслеживать прогресс;
- видеть, какие навыки дают наибольший вклад в цели.

Примеры: AI-инструменты, UI/UX дизайн, разработка, маркетинг, продажи, публичные выступления, английский, финансовая грамотность.

#### Финансы

Финансы - раздел для личного финансового прогресса.

Пользователь управляет:

- финансовыми целями;
- накоплениями;
- доходами;
- расходами;
- капиталом;
- связанными желаниями;
- материальными целями.

Финансы в MVP не должны превращаться в полноценный банк или бухгалтерию. Это модуль личного финансового прогресса, а не финансовый терминал.

#### Здоровье

Здоровье - раздел для состояния, энергии и привычек здоровья.

Пользователь отслеживает:

- состояние;
- сон;
- энергию;
- активность;
- привычки здоровья;
- физический и ментальный прогресс.

Здоровье не должно выглядеть как медицинская система или личный кабинет поликлиники. Это wellness / self-management модуль.

#### AI Ассистент

AI Ассистент - раздел для персональных рекомендаций, анализа прогресса, помощи с планированием и выбора следующего действия.

Использовать название "AI Ассистент", а не "AI Coach". Причина: "AI Ассистент" понятнее для обычного пользователя и шире по смыслу.

Внутри раздела:

- рекомендации;
- план;
- разбор прогресса;
- следующий шаг;
- помощь с целями;
- помощь с календарем;
- помощь с рефлексией позже.

#### Настройки

Настройки - системный раздел приложения.

Возможные подразделы:

- аккаунт;
- внешний вид;
- уведомления;
- данные;
- приватность;
- интеграции позже;
- биллинг позже.

#### Профиль

Профиль - пользовательский аккаунт и персональная информация.

Положение:

- самый низ sidebar;
- может быть представлен как user block;
- может включать avatar, имя, уровень, XP.

Пример:

```text
[Аватар] Василий
Level 7 · 1 640 XP
```

### 14.4. Что не входит в Core Navigation v0.2

Не добавлять как отдельные top-level sidebar-разделы:

- Аналитика;
- Рефлексия;
- Сферы жизни;
- Магазин;
- Хранилище;
- Желания;
- Задачи;
- Привычки;
- AI Coach.

Правила:

- Аналитика не является отдельным top-level разделом. Она встроена в Главную, Цели, Действия, Достижения, Финансы, Здоровье и AI Ассистента.
- Рефлексия не входит в Core Navigation v0.2. Позже может быть интегрирована в AI Ассистент, Главную, еженедельный обзор и прогресс-отчеты.
- Здоровье и Финансы входят в основную навигацию как ключевые сферы жизни. Навыки остаются advanced context route, а проекты закрывают крупные направления активности.
- Магазин не добавлять как отдельную вкладку, потому что он уводит продукт в игровую/RPG-стилистику.
- Хранилище не добавлять сейчас. Возможная future-логика: база знаний, архив, материалы, история данных.
- Желания не отдельный sidebar item. Они находятся внутри Цели -> Желания.
- Задачи и Привычки не отдельные sidebar items. Они находятся внутри Действия -> Задачи / Привычки.
- AI Coach - старое название не использовать. Новое название: AI Ассистент.

### 14.5. Sidebar

Sidebar - основная desktop-навигация Lifera.

Правила:

- fixed left sidebar;
- содержит основные разделы;
- системные элементы отделены в нижнюю зону;
- активный пункт должен быть заметным, но не кричащим;
- primary orange используется для active/selected navigation state;
- hover state спокойный;
- icons outline-style;
- icon size: 18-20px;
- не использовать glowing nav по умолчанию;
- не делать sidebar похожим на игровое меню.

Рекомендуемая группировка:

Основное:

- Главная.

Работа:

- Действия;
- Проекты;
- Календарь.

Рост:

- Цели;
- Достижения;
- Навыки.

Сферы:

- Финансы;
- Здоровье.

Интеллект:

- AI Ассистент.

Система:

- Настройки.

Bottom:

- Профиль / user block.

Можно использовать визуальные группы, но не показывать слишком много заголовков, если sidebar становится перегруженным.

Active state:

- subtle primary background;
- primary orange text/icon или left indicator;
- `border-primary-subtle` допускается;
- no heavy glow.

Hover state:

- surface-muted;
- stronger border;
- muted text -> foreground;
- no strong orange unless active.

Disabled / planned modules:

Если появятся future modules в sidebar, показывать muted style, planned badge или отдельную группу "Позже". В Core v0.2 не показывать их без необходимости.

### 14.6. Topbar

Topbar показывает текущий контекст страницы и быстрые действия.

Topbar может содержать:

- page title;
- page subtitle/context;
- future command/search input;
- primary action;
- secondary actions;
- notifications later;
- profile shortcut if needed.

Examples:

- Главная: title "Главная", action "+ Новая цель" / "+ Создать".
- Действия: title "Действия", action "+ Задача".
- Проекты: title "Проекты", action "+ Проект".
- Календарь: title "Календарь", action "+ Запланировать".
- Цели: title "Цели", action "+ Цель".
- Достижения: title "Достижения", action не обязательно, можно "Смотреть прогресс".
- AI Ассистент: title "AI Ассистент", action "Получить план" / "Новый запрос".

Command/Search Input не обязателен в Core MVP, но должен быть предусмотрен в topbar.

Future placeholder:

- "Поиск или команда ⌘K".

Topbar не заменяет sidebar. Topbar показывает контекст и действия, а не весь список разделов.

### 14.7. Mobile Bottom Navigation

Mobile bottom nav показывает только самые важные разделы.

Не показывать весь продукт в bottom nav.

Рекомендуемый mobile bottom nav:

- Главная;
- Действия;
- Календарь;
- Цели;
- AI Ассистент.

Остальные разделы уходят в "Еще" или profile/menu screen:

- Проекты;
- Достижения;
- Навыки;
- Финансы;
- Здоровье;
- Настройки;
- Профиль.

Правила:

- 4-5 пунктов максимум;
- icons outline;
- active state через primary orange;
- label readable;
- no glow;
- minimum tap target 44px;
- bottom nav не должен перекрывать основной контент.

### 14.8. Collapsed Sidebar

Collapsed Sidebar - будущий режим компактной desktop-навигации.

Правила:

- показывать только icons;
- logo заменяется на compact mark;
- tooltips обязательны;
- active state должен оставаться понятным;
- collapsed width около 80px;
- profile может быть compact avatar внизу;
- не использовать collapsed sidebar в MVP, если это усложняет реализацию.

### 14.9. Page Tabs

Page Tabs используются только для локальной навигации внутри разделов.

Они не заменяют глобальную sidebar-навигацию.

Где использовать:

- Действия: Задачи / Привычки.
- Цели: Цели / Желания.
- Календарь: Сегодня / Неделя / Месяц.
- Достижения: Все / Milestones / Награды / Серии.
- Финансы: Обзор / Цели / Накопления / История позже.
- Здоровье: Обзор / Привычки / Активность / Сон позже.
- Настройки: Аккаунт / Внешний вид / Уведомления / Данные.

Правила:

- active tab может использовать primary orange;
- inactive tabs neutral;
- tabs не должны выглядеть как игровые категории;
- tabs не должны становиться еще одним глобальным меню;
- максимум 3-5 вкладок на странице.

### 14.10. Breadcrumbs

Breadcrumbs опциональны.

Использовать только для detail pages или вложенных страниц.

Examples:

- Цели / Запустить MVP.
- Проекты / Дизайн-система Lifera.
- Финансы / Накопление на MacBook.
- Здоровье / Сон.
- Настройки / Внешний вид.

Не использовать breadcrumbs на простых top-level страницах.

### 14.11. Command / Search Input

Command/Search Input - будущий быстрый поиск и команды.

Не входит в обязательный Core MVP, но должен быть предусмотрен в topbar.

Примеры команд:

- Создать цель;
- Добавить задачу;
- Добавить привычку;
- Открыть календарь;
- Найти проект;
- Спросить AI Ассистента;
- Перейти в финансы;
- Открыть настройки.

UI:

- input в topbar;
- placeholder: "Поиск или команда ⌘K";
- command palette позже;
- no heavy glow;
- focus ring через primary orange.

### 14.12. Visual rules

Active state:

- заметный, но не кричащий;
- primary orange;
- subtle background;
- icon/text can be primary;
- no heavy glow.

Hover state:

- surface-muted;
- stronger border;
- text becomes foreground;
- no orange flood.

Icons:

- outline style;
- 18-20px in sidebar/mobile nav;
- consistent visual weight;
- no cartoon icons;
- no fantasy icons.

Future modules:

- не показывать в Core v0.2 без необходимости;
- если показываются, то muted/planned style;
- не смешивать готовые и будущие модули без визуального отличия.

Orange usage:

- active navigation;
- selected tabs;
- primary CTA;
- focus state;
- key progress;
- milestone highlight.

Do not:

- orange border around every nav item;
- glowing sidebar;
- neon nav;
- game menu style;
- random colored icons.

### 14.13. Route structure recommendation

Recommended routes:

Public:

- `/`;
- `/auth`;
- `/register`;
- `/onboarding`.

Protected app:

- `/dashboard` or `/home` - UI label: Главная;
- `/actions` - UI label: Действия;
- `/projects` - UI label: Проекты;
- `/calendar` - UI label: Календарь;
- `/goals` - UI label: Цели;
- `/achievements` - UI label: Достижения;
- `/skills` - UI label: Навыки;
- `/finance` - UI label: Финансы;
- `/health` - UI label: Здоровье;
- `/ai-assistant` - UI label: AI Ассистент;
- `/settings` - UI label: Настройки;
- `/profile` - UI label: Профиль.

Nested/detail routes later:

- `/goals/[id]`;
- `/projects/[id]`;
- `/tasks/[id]`;
- `/habits/[id]`;
- `/achievements/[id]`;
- `/finance/[id]`;
- `/health/[id]`.

If current project already uses `/dashboard`, do not rename routes without separate task. In UI, use "Главная".

### 14.14. What not to do

Не менять business logic или route structure без отдельного согласования.

Не добавлять как top-level items:

- Магазин;
- Хранилище;
- Сферы жизни;
- Рефлексия;
- Аналитика;
- Желания;
- Задачи;
- Привычки;
- AI Coach.

Не использовать:

- glowing nav;
- game menu style;
- random colored icons;
- old UI label "AI Coach".

### 14.15. Разделение brand rules и technical tokens

В `BRAND_FOUNDATION.md` фиксируются смысловые правила навигации, порядок разделов, grouping, naming, route recommendations и anti-patterns.

В `docs/UI_TOKENS.md` фиксируются navigation-related token references and usage notes.

## 15. Блок 9 - Dashboard Information Architecture

Этот блок фиксирует информационную архитектуру главного dashboard Lifera Design System v0.2.

Контекст:

Lifera - Minimal Premium Life Performance OS / Warm Graphite Personal Command Center.

Dashboard - главная страница приложения. В UI она называется "Главная".

Главная задача dashboard: пользователь должен за 5 секунд понять:

1. Что сегодня главное.
2. Какой у него общий прогресс.
3. Какие цели сейчас активны.
4. Какие действия нужно выполнить.
5. Какие привычки держатся.
6. Что уже достигнуто.
7. Что рекомендует AI Ассистент.
8. Какие сферы требуют внимания.

Dashboard не должен быть стеной одинаковых карточек. Dashboard должен ощущаться как персональный command center.

### 15.1. Основной принцип dashboard

Главная Lifera - это не обычная сетка widgets.

Это иерархичная рабочая поверхность, где есть:

- главный focus block;
- краткая сводка прогресса;
- действия на сегодня;
- цели;
- привычки;
- достижения;
- AI-рекомендация;
- дополнительные виджеты по ключевым сферам.

Dashboard должен отвечать на вопрос: "Что сейчас важно и что мне делать дальше?"

Не делать:

- 12 одинаковых карточек;
- случайные графики;
- декоративные widgets без пользы;
- crypto-dashboard;
- game dashboard;
- перегруженный analytics screen;
- medical cockpit;
- finance terminal.

### 15.2. Dashboard hierarchy

Иерархия блоков:

Level 1 - главный блок:

- Hero / Focus Block.

Level 2 - ключевые метрики:

- XP;
- Level;
- Streak;
- общий progress.

Level 3 - рабочие блоки:

- Today tasks;
- Habits;
- Goals progress;
- AI Ассистент recommendation.

Level 4 - мотивация и долгосрочный прогресс:

- Achievements;
- ближайшая награда / желание;
- life areas / future widgets.

Level 5 - secondary / future:

- health widget;
- finance widget;
- skills widget;
- calendar preview;
- project progress.

Главный блок должен визуально доминировать. Остальные блоки должны поддерживать его, а не спорить с ним.

### 15.3. Рекомендуемая структура dashboard

Desktop dashboard:

1. Topbar:
   - title: "Главная";
   - subtitle/context: "Фокус, прогресс и ближайшие действия";
   - quick action: "+ Создать";
   - future search/command: "Поиск или команда ⌘K".

2. Main content area:
   - Hero / Focus Block;
   - XP / Level / Streak summary;
   - Goals progress;
   - Today tasks;
   - Habits;
   - Achievements / nearest reward;
   - Life areas / future widgets.

3. Right rail / side panel:
   - AI Ассистент recommendation;
   - next best action;
   - risk / overload note;
   - quick plan button.

Если экран узкий, AI panel перемещается ниже hero/focus block.

### 15.4. Hero / Focus Block

Hero / Focus Block - главный блок dashboard. Он должен быть самым заметным элементом страницы.

Названия:

- "Фокус дня";
- "Главное сегодня".

Рекомендуемый вариант: "Фокус дня".

Содержимое:

- главный фокус пользователя на сегодня;
- 2-3 ключевых действия;
- связь с целью или проектом;
- статус выполнения;
- краткая рекомендация;
- primary CTA.

Example content:

- Фокус дня: "Продвинуть запуск Lifera";
- Связано с целью: "Запустить MVP";
- Прогресс сегодня: "2 из 4 действий выполнено";
- CTA: "Продолжить";
- Secondary action: "Перенести лишнее".

Rules:

- блок должен быть крупнее остальных;
- может использовать surface-elevated;
- может использовать subtle primary orange accent;
- не делать его рекламным hero;
- не делать его декоративным баннером;
- не использовать большой бессмысленный 3D-объект;
- не превращать в game mission card.

Hero block отвечает на вопрос: "Что главное сейчас?"

### 15.5. XP / Level / Streak

XP / Level / Streak - ключевая сводка прогресса, но она не должна выглядеть как игра.

Показывать:

- Level;
- XP;
- progress до следующего уровня;
- streak;
- today completion;
- weekly momentum.

Example:

- Level 7;
- 1 640 XP;
- До следующего уровня: 360 XP;
- Серия: 7 дней;
- Сегодня: 3 из 5 действий.

Rules:

- XP и Level должны выглядеть как personal analytics;
- не использовать arcade/game style;
- не использовать excessive glow;
- не использовать RPG counters;
- primary orange можно использовать для progress highlight;
- secondary метрики должны быть спокойнее.

Место:

- рядом с hero/focus block;
- или сразу под ним как compact metric row.

### 15.6. Goals Progress

Goals Progress - блок активных целей.

Показывать:

- 3-5 активных целей;
- процент прогресса;
- связанный проект или действие;
- ближайший следующий шаг.

Examples:

- Запустить Lifera - 64%;
- Увеличить доход - 42%;
- Улучшить здоровье - 38%.

Rules:

- цели должны быть связаны с действиями;
- progress bars спокойные;
- primary orange использовать только для ключевого прогресса;
- не делать все цели яркими;
- не показывать слишком много целей на dashboard.

Место:

- центральная зона ниже hero;
- или левая/средняя колонка.

### 15.7. Today Tasks

Today Tasks - блок задач на сегодня.

Показывать:

- 3-5 задач;
- checkbox/status;
- приоритет;
- связь с проектом/целью;
- быстрый action.

Examples:

- Проверить структуру dashboard;
- Обновить navigation docs;
- Завершить блок UI primitives.

Rules:

- dashboard не должен превращаться в полный task manager;
- показывать только важные задачи;
- полный список находится в разделе "Действия";
- completed state должен быть спокойным;
- overdue/risk можно выделять warning.

Место:

- рядом с Habits;
- или под Focus Block.

### 15.8. Habits

Habits - блок привычек на сегодня.

Показывать:

- 3-5 привычек;
- выполнено / не выполнено;
- streak;
- today completion.

Examples:

- Сон;
- Спорт;
- Чтение;
- План дня.

Rules:

- привычки должны быть compact;
- не делать huge habit cards;
- streak можно показать маленьким badge;
- primary orange использовать только для streak/progress highlight;
- success green использовать только для completed state.

Место:

- рядом с Today Tasks;
- или как компактный secondary card.

### 15.9. Achievements

Achievements - блок достижений и milestones.

Показывать:

- последние достижения;
- ближайший milestone;
- разблокированные награды;
- прогресс до следующего milestone.

Examples:

- 7 дней серии;
- Первая завершенная цель;
- 100 выполненных задач;
- Ближайшая награда: "Поездка" - 47 / 100 задач.

Rules:

- достижения должны выглядеть взросло;
- не использовать RPG-медали;
- не использовать сундуки;
- не использовать fantasy badges;
- не использовать excessive gold;
- primary orange / amber можно использовать как achievement accent;
- glow только для unlock moment, не постоянно.

Место:

- ниже goals/tasks;
- или в правой/нижней зоне dashboard;
- не делать достижения главнее hero/focus block.

### 15.10. AI Ассистент recommendation

AI Ассистент - важный блок dashboard.

Он должен давать не чат ради чата, а конкретную рекомендацию.

Показывать:

- главный совет;
- следующий шаг;
- риск дня;
- что можно перенести;
- CTA для получения плана.

Example:

"Сегодня лучше завершить один важный шаг по проекту Lifera, а не расширять список задач. Сфокусируйтесь на блоке Navigation System и перенесите второстепенное."

Blocks:

- Следующий шаг;
- Риск дня;
- Что перенести;
- Получить план.

Rules:

- AI Ассистент должен выглядеть как аналитик и планировщик;
- не делать большую чат-панель на весь dashboard;
- не использовать фиолетовый AI-glow по умолчанию;
- primary CTA может быть orange;
- стиль должен соответствовать Warm Graphite Personal Command Center.

Место:

- right rail на desktop;
- под hero/focus block на tablet/mobile.

### 15.11. Life areas / future widgets

Отдельной top-level вкладки "Сферы жизни" сейчас нет.

Но на dashboard можно показать компактный блок по ключевым сферам:

- Навыки;
- Финансы;
- Здоровье.

Также можно добавить future widgets:

- skills progress;
- health status;
- finance snapshot;
- project progress;
- calendar preview.

Dashboard widgets:

- Навыки: "2 навыка в фокусе";
- Финансы: "накопление 42%";
- Здоровье: "3 привычки здоровья";
- Календарь: "3 события на неделю".

Rules:

- это secondary widgets;
- они не должны перегружать dashboard;
- показывать 2-4 блока максимум;
- использовать нейтральные поверхности;
- primary orange только для key progress/highlight;
- не вводить отдельные яркие палитры на каждый widget без необходимости.

### 15.12. Calendar / Project Preview

Так как в sidebar есть "Проекты" и "Календарь", dashboard может показывать compact previews.

Project preview:

- 2-3 активных проекта;
- progress;
- next task.

Calendar preview:

- сегодня / завтра;
- ближайшие задачи;
- важные запланированные действия.

Rules:

- не превращать dashboard в календарь;
- полный календарь находится в разделе "Календарь";
- полный список проектов находится в разделе "Проекты".

### 15.13. What user must understand in 5 seconds

Dashboard должен быть сканируемым за 5 секунд.

Пользователь должен понять:

1. Какой главный фокус сегодня.
2. Сколько прогресса уже есть.
3. Какие задачи нужно выполнить.
4. Какие привычки нужно отметить.
5. Какие цели продвигаются.
6. Какая ближайшая награда или достижение.
7. Что советует AI Ассистент.
8. Есть ли риск перегруза или просадки.

Если пользователь видит только красивую сетку карточек, dashboard не выполняет задачу.

### 15.14. How not to turn dashboard into a wall of cards

Rules:

- один главный dominant block;
- 2-3 medium-priority blocks;
- остальные compact widgets;
- карточки должны отличаться по роли и размеру;
- не делать одинаковую высоту и вес у всех блоков;
- не использовать одинаковую elevation для всех блоков;
- не ставить все метрики в одну сетку без иерархии;
- не показывать слишком много data points;
- не использовать декоративные charts без смысла.

Recommended hierarchy:

1. Hero / Focus Block - biggest.
2. AI Ассистент / XP Summary - strong secondary.
3. Goals / Today Tasks / Habits - working blocks.
4. Achievements / Future widgets - supporting blocks.

### 15.15. Dashboard layout options

Preferred desktop layout.

Option A - Command Center Layout:

Left / Main column:

- Hero Focus Block;
- Goals Progress;
- Today Tasks + Habits;
- Achievements.

Right rail:

- AI Ассистент;
- XP / Level / Streak;
- Calendar preview / nearest reward.

Option B - Focus-first Layout:

Top:

- Hero Focus Block full width.

Below:

- XP / Level / Streak row;
- Goals + Tasks + Habits.

Right:

- AI Ассистент rail.

Bottom:

- Achievements;
- Skills / Finance / Health previews.

Recommended: use Option A or hybrid. Hero/focus block must remain dominant.

### 15.16. Responsive dashboard rules

Desktop:

- main content + right rail;
- hero block dominant;
- 2-3 column secondary grid;
- AI Ассистент in right rail.

Tablet:

- right rail moves below hero or becomes full-width card;
- secondary grid becomes 2 columns;
- cards reduce padding slightly.

Mobile:

1. Focus Block.
2. XP / Level / Streak.
3. AI Ассистент recommendation.
4. Today Tasks.
5. Habits.
6. Goals Progress.
7. Achievements.
8. Future widgets.

Mobile dashboard must not show too many blocks at once. Use "Смотреть все" links to full sections.

### 15.17. Visual rules

Dashboard visual style:

- neutral graphite / warm off-white base;
- primary orange for actions/progress/achievement highlights;
- no excessive glow;
- no cyberpunk;
- no crypto dashboard;
- no game UI;
- no confetti;
- no heavy gold panels.

Primary orange usage:

- primary CTA;
- focus progress;
- selected state;
- XP / Level highlight;
- achievement/milestone accent;
- key chart point.

Neutral usage:

- regular cards;
- list items;
- secondary metrics;
- muted widgets;
- normal dashboard surfaces.

Glow:

- rare;
- only for focus/progress/achievement moment;
- not on every card.

### 15.18. Dashboard data model notes

Dashboard may need data from:

- user profile;
- goals;
- tasks;
- habits;
- projects;
- calendar;
- achievements;
- XP/Level system;
- AI recommendations;
- finance/health/skills modules later.

Core MVP can use mock/static data until backend is ready.

Do not block dashboard UI foundation on full backend implementation. Dashboard can start with mock data and later connect to real sources.

### 15.19. What not to do

Не делать:

- полный redesign всех страниц;
- backend logic;
- Supabase integration;
- OpenAI integration;
- complex analytics engine;
- full calendar engine;
- full finance/health widgets;
- game reward shop;
- random charts;
- 12 equal dashboard cards;
- neon/glassmorphism dashboard.

Не менять:

- route structure без отдельной команды;
- sidebar order без отдельной команды;
- color system без отдельной команды.

### 15.20. Разделение brand rules и app structure

В `BRAND_FOUNDATION.md` фиксируются смысловые и визуальные правила dashboard IA.

В `docs/APP_STRUCTURE.md` фиксируется структура главной страницы и связь dashboard-блоков с модулями.

## 16. Блок 10 - Data Visualization

Data visualization в Lifera нужна для понимания прогресса, а не для визуальных трюков.

Визуализация данных должна быть:

- спокойной;
- читаемой;
- минималистичной;
- не crypto-style;
- не rainbow analytics;
- не перегруженной;
- полезной для принятия решений.

Основные элементы:

- progress bars;
- rings;
- line charts;
- bar charts;
- trend indicators;
- streak visualization;
- XP timeline;
- goal progress;
- habit completion;
- life area progress;
- calendar/project progress;
- future finance/health/skills charts.

### 16.1. Progress bars

Use cases:

- goal progress;
- XP to next level;
- habit completion;
- onboarding progress;
- project progress;
- finance saving progress;
- health habit progress.

Rules:

- primary orange использовать для ключевого прогресса;
- muted gray использовать для secondary progress;
- green/red использовать только для статуса;
- progress bar не должен светиться по умолчанию;
- glow допустим только для milestone/current level;
- label и percentage должны быть рядом или доступны;
- не делать progress bars слишком толстыми и игровыми.

Recommended:

- compact: 6px;
- default: 8-10px;
- large/key progress: 12px;
- radius: full / 999px.

### 16.2. Rings

Use cases:

- daily completion;
- habit consistency;
- XP progress;
- health/finance/skills overview;
- small dashboard metrics.

Rules:

- использовать редко;
- не делать dashboard из одних колец;
- primary orange только для главного ring;
- secondary rings должны быть muted;
- не использовать rainbow rings;
- не копировать Apple Fitness rings слишком буквально.

### 16.3. Line charts

Use cases:

- XP over time;
- habit consistency;
- finance growth;
- health energy/sleep trend;
- skill progress;
- goal velocity.

Rules:

- линия должна быть спокойной;
- primary orange только для key trend;
- muted gray для comparison/secondary lines;
- grid lines subtle;
- points не должны быть слишком декоративными;
- no crypto trading chart aesthetic;
- no aggressive neon glow.

### 16.4. Bar charts

Use cases:

- tasks completed by day;
- habits by week;
- XP by week;
- finance monthly bars;
- health activity bars.

Rules:

- active/current bar может быть primary orange;
- inactive bars muted gray;
- success green только для статуса;
- warning amber только для риска;
- не использовать слишком много цветов;
- charts должны читаться без легенды, где возможно.

### 16.5. Trend indicators

Use cases:

- +12% progress;
- -2 habits missed;
- XP growth;
- finance increase;
- health improvement.

Rules:

- positive: success green;
- negative: danger red;
- attention/risk: warning amber;
- neutral: muted;
- не использовать green/red без реальной динамики;
- trend должен сопровождаться текстом, не только цветом.

### 16.6. Streak visualization

Use cases:

- habit streak;
- daily activity;
- weekly consistency;
- project momentum.

Rules:

- streak должен выглядеть взрослым;
- не использовать flames как основной стиль;
- можно использовать compact dots / bars / calendar strip;
- current streak highlight может быть orange;
- missed days muted или warning;
- no confetti by default.

### 16.7. XP timeline

Use cases:

- XP events;
- completed tasks;
- habits;
- achievements;
- milestones;
- level progress.

Rules:

- timeline должна быть спокойной;
- major milestone может использовать orange/gold;
- regular XP events neutral;
- не делать timeline похожей на game battle pass;
- показывать смысл события, а не только цифры.

### 16.8. Goal progress

Rules:

- показывать percentage;
- показывать next action;
- показывать linked project/action;
- progress должен быть связан с реальными действиями;
- не показывать декоративный progress без расчета.

### 16.9. Habit completion

Rules:

- completed = success or subtle primary;
- missed = muted/warning;
- streak highlight = orange only if key;
- habit visualization должна быть compact;
- не делать огромные игровые чекпоинты.

### 16.10. Life area progress

Use cases:

- future overview of skills/finance/health;
- dashboard compact widget;
- AI insights.

Rules:

- не вводить отдельные яркие палитры без необходимости;
- основная система остается neutral + orange;
- secondary area colors допустимы только аккуратно;
- не делать rainbow dashboard.

Final rule: data visualization в Lifera должна помогать понять прогресс, а не демонстрировать визуальные трюки.

## 17. Блок 11 - Gamification Visual System

Геймификация в Lifera - это аналитика прогресса, а не игра.

Система включает:

- XP;
- Level;
- streak;
- achievements;
- milestones;
- badges;
- progress events;
- level-up states;
- personal rewards / wishes;
- completion moments.

### 17.1. XP

XP показывает накопленный прогресс пользователя.

Rules:

- XP должен выглядеть как personal analytics metric;
- не использовать arcade counter;
- не использовать game HUD;
- не использовать excessive glow;
- XP можно показывать в dashboard, profile, achievements;
- primary orange можно использовать для ключевого XP progress.

Examples:

- "1 640 XP";
- "+120 XP за неделю";
- "360 XP до Level 8".

### 17.2. Level

Level показывает общий этап развития пользователя.

Rules:

- Level должен быть крупным, но спокойным;
- не делать level badge как RPG shield;
- не использовать fantasy frames;
- Level может быть в profile/sidebar/dashboard;
- level-up state должен быть аккуратным.

### 17.3. Streak

Rules:

- использовать как мотивацию, но без детского огонька везде;
- streak можно показывать через dots/bars/calendar strip;
- orange highlight допустим для текущей серии;
- missed days не должны выглядеть как наказание.

### 17.4. Achievements

Achievements фиксируют важные результаты.

Rules:

- achievements должны выглядеть как milestones;
- использовать warm orange/gold/bronze аккуратно;
- не использовать RPG medals;
- не использовать сундуки;
- не использовать fantasy badges;
- не использовать excessive gold;
- не использовать confetti overload.

Examples:

- "Первая цель завершена";
- "100 задач выполнено";
- "30 дней серии";
- "Первый проект закрыт".

### 17.5. Milestones

Rules:

- milestone может использовать orange/gold accent;
- milestone card может быть highlight card;
- glow только при unlock moment;
- после unlock состояние становится спокойным.

### 17.6. Badges

Rules:

- badge не должен быть игровой медалью;
- badge = label/status, а не награда ради награды;
- rare badge может использовать warm accent;
- no fantasy icons.

### 17.7. Level-up states

Rules:

- no full-screen RPG effect;
- no confetti by default;
- допустима subtle toast/modal;
- orange/gold accent;
- short useful text;
- action: "Посмотреть прогресс" or "Продолжить".

### 17.8. Personal rewards / wishes

Желания - мотивационный слой внутри раздела "Цели".

Rules:

- не использовать отдельную вкладку "Магазин";
- не вводить полноценную валюту/монеты в MVP;
- пользователь связывает желание с условием: выполнить задачи, закрыть цель, набрать XP, удержать серию, накопить сумму или завершить проект;
- разблокированные желания могут отображаться в Достижениях.

Main rule: Lifera motivates through real-life rewards, not game shop mechanics.

### 17.9. Anti-patterns

Запрещено:

- сундуки;
- мечи;
- персонажи;
- monsters;
- RPG inventory;
- fantasy medals;
- cartoon badges;
- confetti overload;
- arcade counters;
- glowing level frames;
- battle pass;
- shop за монеты как core MVP;
- excessive gold UI.

Final rule: gamification в Lifera должна усиливать мотивацию, но не превращать продукт в игру.

## 18. Блок 12 - AI Assistant UI

Использовать название "AI Ассистент". Не использовать "AI Coach" в UI.

AI Ассистент должен выглядеть как:

- аналитик;
- планировщик;
- помощник в принятии решений;
- источник next best action;
- часть personal OS.

AI Ассистент не должен выглядеть как:

- магический чат;
- фиолетовая AI-дыра;
- sci-fi orb;
- декоративная панель;
- chatbot ради chatbot.

Основные элементы:

- recommendation card;
- insight panel;
- next best action;
- goal breakdown;
- habit suggestions;
- AI status;
- loading state;
- error/limit state.

### 18.1. Recommendation card

Structure:

- label: "Рекомендация";
- short recommendation;
- reason/context;
- primary action;
- optional secondary action.

Rules:

- текст короткий;
- рекомендация конкретная;
- CTA orange;
- не использовать большие декоративные AI effects.

### 18.2. Insight panel

Blocks:

- Следующий шаг;
- Риск;
- Что перенести;
- Что усилить;
- Почему это важно.

Rules:

- panel surface elevated;
- subtle warm border allowed;
- no purple glow by default;
- optional tiny indigo detail allowed only if не ломает warm graphite style.

### 18.3. Next best action

Rules:

- всегда конкретно;
- желательно один главный шаг;
- action должен быть связан с целью/проектом/задачей;
- no generic motivation.

Examples:

- "Закройте задачу 'описать Dashboard IA' сегодня.";
- "Перенесите две второстепенные задачи на завтра.";
- "Создайте одну привычку, связанную с целью здоровья."

### 18.4. Goal breakdown

Structure:

- цель;
- этапы;
- задачи;
- привычки;
- срок;
- риск.

Rules:

- показать как structured cards/list;
- не выдавать длинную простыню текста;
- дать action: "Создать задачи".

### 18.5. Habit suggestions

Rules:

- показывать 2-3 привычки максимум;
- объяснять связь с целью;
- CTA: "Добавить привычку";
- не делать wellness-советы без контекста.

### 18.6. AI status

Statuses:

- ready;
- thinking;
- unavailable;
- limited;
- needs data;
- error.

Text examples:

- "Готов помочь";
- "Анализирую прогресс";
- "Нужно больше данных";
- "AI Ассистент временно недоступен".

Rules:

- status должен быть понятен;
- не использовать магический язык;
- не писать "ИИ думает..." слишком часто;
- loading state спокойный.

### 18.7. Loading state

Rules:

- skeleton / subtle dots;
- no dramatic AI animation;
- no glowing orb;
- короткий текст: "Анализирую данные..." or "Готовлю рекомендацию..."

### 18.8. Error / limit state

Use cases:

- AI unavailable;
- usage limit;
- no data;
- network error.

Rules:

- объяснить простыми словами;
- дать следующий шаг;
- не обвинять пользователя;
- no scary red unless critical.

Final rule: AI Ассистент должен быть полезным и спокойным. Он не должен выглядеть как магия.

## 19. Блок 13 - Forms, Auth и Onboarding

Цель: зафиксировать внешний вид и UX auth/register/onboarding.

Основные экраны:

- login screen;
- register screen;
- onboarding wizard;
- form layout;
- labels;
- validation;
- help text;
- error text;
- password fields;
- disabled/loading state;
- submit buttons;
- onboarding progress.

### 19.1. Auth / Login

Rules:

- спокойный clean layout;
- без перегруженного hero;
- logo visible;
- primary CTA orange;
- form card centered or split layout;
- no OAuth buttons until OAuth is implemented.

Fields:

- email;
- password;
- remember me optional;
- forgot password later.

States:

- default;
- focus;
- error;
- disabled;
- loading.

### 19.2. Register

Fields:

- name optional;
- email;
- password;
- confirm password optional;
- terms checkbox if needed.

Rules:

- не перегружать;
- clear error messages;
- submit button stable width;
- no fake OAuth buttons.

### 19.3. Onboarding wizard

Onboarding должен ощущаться как настройка персональной ОС, а не tutorial игры.

Possible steps:

1. Цель использования.
2. Главные сферы.
3. Первая цель.
4. Первая привычка/действие.
5. Готово / перейти на Главную.

Rules:

- progress indicator;
- primary CTA orange;
- secondary "Пропустить" neutral;
- no game tutorial voice;
- no mascot;
- no confetti by default.

Copy examples:

- "Настроим вашу систему";
- "Выберите, на чем хотите сфокусироваться";
- "Добавьте первую цель";
- "Готово. Можно начинать."

### 19.4. Form layout

Rules:

- label above field;
- placeholder не заменяет label;
- help text optional;
- error text under field;
- consistent spacing;
- focus ring visible;
- password toggle allowed;
- disabled/loading state clear.

### 19.5. Validation

Rules:

- errors specific;
- no vague "Ошибка";
- error text readable;
- danger color only for actual error.

Examples:

- "Введите email";
- "Пароль должен быть не короче 8 символов";
- "Проверьте email и пароль".

Final rule: forms должны быть спокойными, понятными и системными. Auth не должен выглядеть как рекламный лендинг.

## 20. Блок 14 - Empty, Loading, Error States

Для большого продукта эти состояния критичны. Они должны помогать пользователю продолжить действие, а не просто сообщать о пустоте или поломке.

### 20.1. Empty states

Empty state должен вести к следующему действию.

Не писать просто:

- "Пусто";
- "Нет данных";
- "Ничего не найдено".

Лучше:

- объяснить ситуацию;
- дать действие;
- дать контекст.

Examples:

- Empty goals: "Создайте первую цель" + "Цели помогают связать действия, привычки и прогресс." + CTA "Добавить цель".
- Empty tasks: "Добавьте первую задачу" + "Задачи помогают двигаться к целям конкретными шагами." + CTA "Добавить задачу".
- Empty habits: "Создайте привычку" + "Привычки поддерживают прогресс каждый день." + CTA "Добавить привычку".
- No achievements: "Достижения появятся по мере прогресса" + CTA "Перейти к действиям".
- AI no data: "AI Ассистенту нужны данные" + CTA "Создать цель".

### 20.2. Loading states

Types:

- skeleton cards;
- skeleton rows;
- spinner only for small actions;
- loading button state;
- loading AI state.

Rules:

- dashboard uses skeleton, not full-page spinner;
- forms use button loading;
- AI uses calm loading text;
- no flashy animation.

### 20.3. Error states

Types:

- form error;
- network error;
- AI error;
- permission error;
- not found;
- server error.

Rules:

- error explains what happened;
- give next action;
- danger color only where appropriate;
- no dramatic language;
- no technical stack traces.

Examples:

- "Не удалось загрузить данные. Попробуйте обновить страницу.";
- "AI Ассистент временно недоступен.";
- "Эта цель не найдена."

### 20.4. Offline / future PWA states

Future:

- offline notice;
- sync pending;
- local data saved;
- retry action.

Copy:

- "Нет соединения. Изменения сохранятся позже.";
- "Синхронизация ожидает подключения."

## 21. Блок 15 - Responsive Design

Responsive behavior должен сохранять смысл продукта на desktop, laptop, tablet и mobile.

### 21.1. Desktop

Rules:

- left sidebar;
- topbar;
- main content;
- optional right rail;
- dashboard grid;
- full component spacing.

### 21.2. Laptop

Rules:

- sidebar remains;
- right rail can shrink or move below;
- grid becomes more compact;
- avoid horizontal overflow.

### 21.3. Tablet

Rules:

- sidebar can collapse or become drawer;
- dashboard becomes 2-column or stacked;
- AI rail moves below hero;
- topbar stays.

### 21.4. Mobile

Rules:

- no fixed sidebar;
- use bottom navigation;
- cards full width;
- content stacked;
- body text не меньше 14px;
- important actions should not go too low;
- bottom padding accounts for nav;
- tap target минимум 44px.

Mobile bottom nav:

- height: 64-72px;
- 4-5 items max;
- active state orange;
- no glow.

Dashboard mobile order:

1. Focus Block.
2. XP / Level / Streak.
3. AI Ассистент.
4. Today Tasks.
5. Habits.
6. Goals.
7. Achievements.
8. Future widgets.

Auth/onboarding mobile:

- centered;
- forms full width;
- large CTA;
- no tiny text;
- no overloaded side illustration.

Final rule: mobile не должен быть урезанной версией. Он должен быть проще, но не беднее по смыслу.

## 22. Блок 16 - Iconography

Иконки Lifera должны выглядеть как системные элементы personal OS, а не как игровые иллюстрации.

Recommendation:

- outline icons;
- clean geometric style;
- consistent stroke;
- no cartoon;
- no fantasy/game icons.

Possible future library:

- `lucide-react`, но не подключать без отдельной задачи.

Sizes:

- sidebar/nav: 18-20px;
- mobile nav: 20-22px;
- cards: 20-24px;
- feature/metric icons: 24-28px;
- small inline icons: 14-16px.

Stroke:

- 1.75-2px;
- rounded caps/joins preferred;
- consistent visual weight.

Usage:

- sidebar icons;
- topbar actions;
- cards;
- empty states;
- status indicators;
- achievements/milestones, but not game-style.

Rules:

- icons support text, not replace it everywhere;
- no filled icons unless selected state/system reason;
- achievement icons should be premium and minimal;
- no swords/chests/monsters/fantasy trophies;
- no random icon styles from different packs.

## 23. Блок 17 - Motion / Interaction

Motion should make Lifera feel responsive, not entertaining.

Motion style:

- calm;
- fast;
- premium;
- subtle;
- useful.

Timing:

- hover transitions: 150-180ms;
- dropdown/modal: 180-220ms;
- page transition: optional 200-250ms;
- progress animation: 300-600ms, only where useful.

Easing:

- ease-out;
- no bounce;
- no elastic;
- no playful spring by default.

Use cases:

- hover;
- active;
- focus;
- loading;
- progress fill;
- dropdown/modal enter;
- toast;
- subtle page transition.

Rules:

- no confetti by default;
- no RPG level-up;
- no big animated logo;
- no heavy particle effects;
- no constant pulsing UI;
- reduced motion support required.

Progress animation:

- progress can animate on update;
- no aggressive flashing;
- milestone unlock can have subtle warm highlight.

## 24. Блок 18 - Accessibility

Lifera cannot be a serious product if it is inaccessible.

Rules:

- sufficient contrast;
- visible focus ring;
- keyboard navigation;
- aria labels for icon-only buttons;
- form errors connected to fields;
- readable font sizes;
- reduced motion;
- tap targets at least 44px;
- no color-only status;
- disabled states readable.

Contrast:

- text must be readable in light/dark;
- muted text should not be too weak;
- orange on light/dark must be checked.

Focus:

- use `--focus-ring`;
- never remove outline without replacement;
- focus visible on buttons, inputs, links, tabs, nav items.

Keyboard:

- forms accessible;
- modals trap focus;
- dropdowns navigable later;
- escape closes modal/dropdown where appropriate.

ARIA:

- icon buttons need `aria-label`;
- progress needs accessible label/value;
- tabs need semantic roles later if implemented manually.

Reduced motion:

- respect `prefers-reduced-motion`;
- disable non-essential animations.

## 25. Блок 19 - Content Style / UX Copy

Текст Lifera должен помогать пользователю действовать, а не продавать ему мотивационный туман.

Language:

- primary UI language: русский;
- English terms allowed only when they are product conventions: AI, XP, Level if intentionally kept.

Tone:

- спокойный;
- взрослый;
- конкретный;
- полезный;
- без инфобизнеса;
- без game voice;
- без токсичной мотивации;
- без "стань лучшей версией себя" на каждом шаге.

Headings:

- короткие;
- понятные;
- action-oriented.

CTA examples:

- "Создать цель";
- "Добавить задачу";
- "Продолжить";
- "Получить план";
- "Сохранить".

AI recommendations:

- не абстрактные;
- не мотивационные лозунги;
- давать следующий шаг.

Errors:

- объяснять проблему;
- дать действие;
- не обвинять пользователя.

Empty states:

- объяснить пользу;
- предложить действие.

XP/Level/Streak:

- использовать спокойно;
- не писать игровым языком: "Прокачайся!", "Получай лут!", "Открой сундук!";
- better: "До следующего уровня осталось 360 XP", "Серия: 7 дней", "Вы закрыли 3 действия сегодня".

## 26. Блок 20 - Brand Application

Brand application фиксирует применение бренда Lifera в продукте и материалах.

Use cases:

- app icon;
- favicon;
- splash;
- presentation;
- diploma screenshots;
- social preview;
- future landing;
- public pages;
- product screenshots.

Logo rules:

- основной UI logo - монохромный;
- light theme: dark/black logo;
- dark theme: white/light logo;
- orange mark only in special cases;
- no glowing logo everywhere;
- no random logo colors.

App icon:

- use compact mark;
- no full wordmark;
- 1024x1024 master;
- rounded icon preview 22-24%;
- safe area 16-20%;
- possible version: dark graphite background + orange/white mark.

Favicon:

- use compact mark;
- ensure readability at 16/32px;
- simplified version allowed.

Splash:

- can use orange mark / warm glow;
- keep clean;
- no heavy animation by default.

Presentation / diploma screenshots:

- use brand board style;
- warm graphite + orange accent;
- show actual UI, not fake fantasy dashboard.

Social preview:

- logo + clean UI screenshot;
- orange accent;
- no clutter.

Future landing:

- public navigation can use top nav/mega menu;
- product app remains sidebar-based.

Final rule: бренд Lifera должен выглядеть стабильно. Orange - фирменный акцент, но не повод красить все подряд.

## 27. Блок 21 - Implementation Guidelines

Этот блок связывает дизайн-систему и код.

### 27.1. Use tokens

- компоненты используют CSS variables/design tokens;
- no random HEX in components;
- no random spacing/radius.

### 27.2. Component creation

При добавлении нового UI-компонента:

- проверить, нет ли уже primitive;
- определить variant/size/state;
- использовать tokens;
- проверить light/dark;
- добавить docs note if needed.

### 27.3. Hardcode

Можно hardcode только:

- временные mock data;
- временный prototype text;
- не визуальные системные значения.

Нельзя hardcode:

- colors;
- spacing;
- shadows;
- radius;
- font sizes outside tokens.

### 27.4. Light/dark check

Каждый экран проверить:

- light theme;
- dark theme;
- contrast;
- hover/focus;
- empty/loading/error.

### 27.5. Task separation

Не смешивать UI, auth, database, AI, Stripe, analytics и routing в одной задаче без необходимости.

### 27.6. Docs update

Обновлять docs, если:

- меняется token;
- меняется navigation;
- меняется component rule;
- меняется visual direction;
- добавляется новый pattern.

### 27.7. Commit

Перед commit:

- lint;
- build;
- check dirty state;
- stage only relevant files;
- write clear commit message.

### 27.8. Visual check

Перед сдачей:

- browser smoke-check core routes;
- check console;
- check responsive;
- check key UI states.

Final rule: implementation должна сохранять систему. Быстрые хаотичные правки ради одного экрана запрещены.

## 28. Блок 22 - Visual QA Checklist

Этот checklist используется для проверки экранов Lifera.

### 28.1. Layout

- экран имеет понятную иерархию;
- главный блок очевиден;
- нет стены одинаковых карточек;
- grid/gaps consistent;
- sidebar/topbar не ломаются.

### 28.2. Typography

- текст читается;
- body text не меньше 14px;
- headings отличаются по уровню;
- XP/Level не выглядят как arcade/game.

### 28.3. Colors

- нет случайных цветов;
- primary orange не перегружает экран;
- neutral base доминирует;
- green/red только по статусу;
- no rainbow analytics.

### 28.4. Surfaces

- surface levels понятны;
- cards не все elevated;
- borders subtle;
- no neon borders;
- glow used rarely.

### 28.5. Components

- buttons follow variants;
- inputs have labels;
- badges not used as buttons;
- progress bars calm;
- states exist.

### 28.6. Dashboard

- сканируется за 5 секунд;
- focus block dominant;
- AI Ассистент виден, но не главнее всего;
- tasks/habits/goals понятны;
- achievements не игровые.

### 28.7. Responsive

- mobile не ломается;
- cards full width;
- bottom nav не перекрывает контент;
- tap targets >= 44px;
- no horizontal scroll.

### 28.8. Light/Dark

- обе темы работают;
- contrast нормальный;
- логотип читается;
- borders/shadows адаптированы;
- orange выглядит нормально в обеих темах.

### 28.9. Empty/Loading/Error

- есть empty state;
- есть loading/skeleton;
- есть error state;
- empty ведет к действию;
- no dead blank screens.

### 28.10. Accessibility

- focus visible;
- icon buttons have labels later;
- status not color-only;
- forms have errors/help text;
- reduced motion respected.

### 28.11. Brand fit

- не выглядит как игра;
- не выглядит как crypto dashboard;
- не выглядит как cyberpunk;
- не выглядит как medical app;
- не выглядит как random admin template;
- ощущается как premium personal OS.

### 28.12. Content

- русский язык;
- CTA конкретные;
- AI рекомендации полезные;
- no инфобизнес;
- no game voice.

Final QA rule: если экран красивый, но пользователь не понимает, что делать дальше, экран считается неудачным.

## Update — Primary Orange Usage Balance

Primary orange в Lifera - это цвет главного действия, выбора и важного акцента. Он не должен быть дефолтным цветом всех progress bars, badges, borders, cards, icons и dashboard highlights.

Обновленная логика:

- primary orange: один главный CTA на экране, active navigation, selected tab/control, XP/Level highlight, редкий milestone/achievement accent, focus label или key chart point;
- success green: выполнено, положительный прогресс, закрытая задача, выполненная привычка, completion progress;
- muted/neutral: обычные карточки, secondary progress, фоновые статусы, secondary actions, inactive elements;
- warning/amber: риск, внимание, перегруз, просрочка, статус “в работе”;
- danger/red: ошибка, критический риск, destructive action, провал/срыв.

Dashboard rules:

- hero/focus block должен быть neutral/elevated, без яркой orange-заливки и без постоянного glow;
- orange в hero остается на маленьком label “Фокус дня” и главном CTA;
- daily completion и goal progress используют success green;
- XP/Level progress может использовать primary orange, но не все metric cards одновременно;
- “В работе” использует warning/amber или neutral, не primary orange;
- AI Ассистент остается neutral/elevated, orange используется только для CTA “Получить план”;
- achievements neutral by default; unlocked/completed через success, rare milestone через amber/gold;
- mobile active nav использует очень subtle orange background + orange icon/text.

Ограничение:

- primary orange должен занимать примерно 5-8% экрана;
- если orange визуально доминирует над контентом, его слишком много;
- neutral base должна оставаться главным визуальным слоем Lifera.
