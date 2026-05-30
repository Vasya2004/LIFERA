# Future Public API — Lifera API v1

> **Status:** architecture only — not implemented in the web MVP.  
> **Related:** [`MCP_FUTURE.md`](./MCP_FUTURE.md), [`TECH_ARCHITECTURE.md`](./TECH_ARCHITECTURE.md)

## Зачем Lifera нужен внешний API

Lifera — это Life RPG-платформа с централизованной domain-логикой (цели, челленджи, привычки, XP, достижения). Сейчас доступ к этой логике есть только через веб-приложение и внутренние Route Handlers.

В будущем тот же контур данных и действий понадобится **вне браузера**:

- нативным клиентам (iPhone, Mac);
- ботам и интеграциям (Telegram, Slack);
- внешним AI-агентам (ChatGPT, Claude, Cursor, custom agents);
- партнёрским сценариям (коучинг, корпоративные программы).

Public API v1 — это **стабильный, user-scoped, auditable** слой поверх существующей domain-логики (`src/lib/domain/*`), без дублирования бизнес-правил в клиентах.

## Кто будет использовать API

| Client type | Typical use |
| --- | --- |
| **iPhone app** | Читать dashboard, отмечать привычки, завершать шаги челленджа |
| **Mac app** | Быстрый доступ к целям, прогрессу, рекомендациям |
| **Telegram bot** | Напоминания о ритуалах, краткий прогресс, completion через inline actions |
| **External AI agents** | Анализ траектории пользователя, предложение следующего шага |
| **ChatGPT / Claude / Cursor** | Через MCP или прямой HTTP API — read/write по scopes пользователя |

Все клиенты работают **от имени одного пользователя**, не от имени системы.

## Принцип доступа

### User-scoped access

- Каждый запрос привязан к **одному** `user_id`.
- `user_id` **никогда не передаётся** клиентом в теле запроса или query string.
- Идентичность пользователя определяется на сервере из **token / session** (см. ниже).

### API tokens (первая фаза внешнего доступа)

Планируется модель **personal API tokens**:

- пользователь создаёт токен в UI (Settings → Integrations);
- токен хранится как hash (plain text показывается один раз);
- каждый токен имеет **набор scopes** и optional expiry;
- токен можно **revoke** немедленно.

Заголовок (пример):

```http
Authorization: Bearer lfr_live_...
```

### OAuth (будущая фase)

Для third-party apps (мобильные store apps, партнёры) позже:

- OAuth 2.0 / OIDC authorization code + PKCE;
- consent screen с явным списком scopes;
- refresh tokens с rotation;
- отдельные client_id для каждого приложения.

До OAuth достаточно personal tokens для power users и agent integrations.

### Scopes

Granular permissions вместо «full access»:

| Scope | Access |
| --- | --- |
| `read:profile` | Профиль, plan, level, XP summary |
| `read:goals` | Список и детали целей |
| `write:goals` | Создание и обновление целей |
| `read:challenges` | Челленджи, этапы, прогресс |
| `write:challenges` | Создание челленджей |
| `complete:challenge_step` | Завершение активного этапа (XP, achievements) |
| `read:habits` | Привычки, streak, logs |
| `write:habits` | Создание, редактирование, архивирование |
| `complete:habit` | Отметка выполнения ритуала (1× XP/day) |
| `read:progress` | Агрегаты прогресса, XP history |
| `read:achievements` | Достижения locked/unlocked |

Write-scopes выдаются отдельно от read-scopes. Минимальный принцип: **least privilege**.

### Rate limits

Планируются per-token лимиты (пример для v1):

| Tier | Read | Write |
| --- | --- | --- |
| Free | 60 req/min | 10 req/min |
| Premium | 300 req/min | 60 req/min |

Отдельные лимиты на `complete:*` actions (anti-abuse XP). При превышении — `429` + `Retry-After`.

### Audit logs

Все **write** и **complete** действия через API логируются (future table `agent_action_logs` или аналог):

- `user_id`, `token_id`, `scope`, `action`, `resource_type`, `resource_id`;
- request metadata (IP, user-agent, client_id);
- result (`success` / `error`), duration;
- **без** хранения sensitive body fields.

Logs нужны для revoke investigation, support и anti-fraud.

### Revoke access

- Revoke token → немедленная invalidation (check on every request).
- Revoke all tokens → emergency logout integrations.
- OAuth: revoke refresh token + cascade.

## Roadmap API v1

### Phase 0 — Internal only (текущий MVP)

- Route Handlers + Supabase session cookie.
- Domain logic в `src/lib/domain/*`.
- Service role только server-side для XP / achievements.

### Phase 1 — Read-only Public API

Первый внешний релиз **только read**:

```
GET /api/v1/profile
GET /api/v1/goals
GET /api/v1/challenges
GET /api/v1/challenges/:id
GET /api/v1/habits
GET /api/v1/progress/summary
GET /api/v1/achievements
GET /api/v1/recommendations
```

Реализация: новый thin layer `src/lib/api/v1/*` → вызов существующих domain functions. **Не** прямой доступ клиента к Supabase.

### Phase 2 — Write API (после tokens + audit)

```
POST   /api/v1/goals
PATCH  /api/v1/goals/:id
POST   /api/v1/challenges
POST   /api/v1/challenges/:id/stages/:stageId/complete
POST   /api/v1/habits
PATCH  /api/v1/habits/:id
POST   /api/v1/habits/:id/complete
```

Write endpoints вызывают те же функции, что и web:

- `createHabit`, `completeHabit` → `src/lib/domain/habits.ts`
- `completeStage` → `src/lib/domain/challenges.ts`
- `assertCanCreateGoal` / `assertCanCreateHabit` → subscription gates
- `awardXpOnce`, `checkAchievements` → gamification

### Phase 3 — OAuth + third-party apps

Consent, client registry, webhook subscriptions (optional).

## Принцип безопасности

1. **`user_id` нельзя передавать с клиента** — только server-resolved identity.
2. **Service role только server-side** — никогда в mobile app, MCP process на клиенте, или browser.
3. **Все write-действия логируются** — audit trail обязателен до включения write API.
4. **Destructive actions требуют подтверждения** — archive/delete через explicit scope + optional user confirmation in UI or agent prompt.
5. **Сначала read-only API, потом write API** — снижает риск до появления tokens, scopes, rate limits.
6. **Domain layer — single source of truth** — API v1 не дублирует XP/streak/achievement rules.
7. **RLS остаётся** — даже с API tokens server использует user context или controlled service path, не «global admin» для user data.

## Совместимость с текущей domain-логикой

Текущая архитектура **подходит** для будущего API:

| Domain module | Future API operations |
| --- | --- |
| `dashboard.ts` | `GET progress summary`, dashboard aggregates |
| `goals.ts` | list/create/update goals |
| `challenges.ts` | list/create challenges, `completeStage` |
| `habits.ts` | list/create/update/complete habits |
| `gamification.ts` | read XP/achievements (writes only via domain) |
| `subscription.ts` | plan limits on create actions |
| `ai.ts` | `get_ai_recommendations` |

Route Handlers сегодня уже следуют паттерну **Handler → Domain → Supabase**. Public API v1 расширит этот паттерн вторым входом (Bearer token auth middleware) без изменения core rules.

## Explicit non-goals (сейчас)

- Нет таблиц `api_tokens`, `agent_action_logs`.
- Нет `/api/v1/**` routes.
- Нет изменений middleware, auth, Supabase schema.
- Нет npm-зависимостей для OAuth/MCP.

См. [`DEVELOPMENT_ROADMAP.md`](./DEVELOPMENT_ROADMAP.md) для приоритета web MVP.
