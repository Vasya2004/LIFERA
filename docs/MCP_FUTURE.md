# Future MCP Server — Lifera MCP v0.1

> **Status:** architecture only — not implemented in the web MVP.  
> **Related:** [`API_ACCESS_FUTURE.md`](./API_ACCESS_FUTURE.md), [`TECH_ARCHITECTURE.md`](./TECH_ARCHITECTURE.md)

## Что такое Lifera MCP Server

**MCP (Model Context Protocol)** — стандарт подключения AI-агентов к внешним данным и инструментам. Lifera MCP Server — это **отдельный server-side процесс** (или hosted endpoint), через который ChatGPT, Claude, Cursor и custom agents смогут:

- читать Life RPG-контекст пользователя;
- при явном разрешении выполнять действия (создать цель, завершить шаг, отметить привычку);
- получать rule-based (и позже LLM) рекомендации.

MCP **не заменяет** Public API v1. Оба слоя используют одну domain-логику:

```text
AI Agent (Cursor / Claude / ChatGPT)
  → Lifera MCP Server
  → Public API v1 (or internal domain adapter)
  → src/lib/domain/*
  → Supabase (RLS / service role where required)
```

MCP — **удобный agent-facing интерфейс**. API v1 — **универсальный HTTP контракт** для всех клиентов.

## Зачем MCP, если будет API

| Concern | Public API v1 | MCP Server |
| --- | --- | --- |
| Primary consumer | Apps, bots, scripts | LLM agents with tool use |
| Discovery | OpenAPI / docs | MCP resources + tools schema |
| Context loading | Client pulls JSON | MCP resources (`lifera://goals`) |
| Auth | Bearer tokens | Same tokens, MCP handshake |
| Deployment | `api.lifera.app/v1` | `mcp.lifera.app` or stdio sidecar |

Agents в IDE (Cursor) естественнее подключают MCP, чем пишут raw HTTP. Mobile apps — наоборот.

## Версия v0.1 — read-only first

**Первая версия MCP Server — только read.**

Доступны:

- MCP **resources** (read snapshots);
- MCP **tools** с префиксом `get_*` / `list_*`.

**Write-tools** (`create_*`, `complete_*`, `update_*`) добавляются **только после**:

- personal API tokens + scopes ([`API_ACCESS_FUTURE.md`](./API_ACCESS_FUTURE.md));
- audit logs для write actions;
- rate limits;
- optional user confirmation flow для destructive/important mutations.

Это сознательное ограничение: agent не должен менять XP, streak или achievements без полного security stack.

## Future MCP resources

Resources — read-only контекст для prompt injection / agent planning.

| URI | Content |
| --- | --- |
| `lifera://profile` | Level, XP, plan, life score, onboarding status |
| `lifera://goals` | Active goals with progress and linked challenges |
| `lifera://challenges` | Active challenges, stages, next step |
| `lifera://habits` | Active rituals, streak, today completion status |
| `lifera://progress` | Weekly stats, XP breakdown, life area activity |
| `lifera://achievements` | Locked/unlocked achievements |

Resources генерируются через domain aggregators (`getDashboardData`, `getGoalsWithChallenges`, etc.), не raw SQL из MCP process.

## Future MCP tools

### Read-only (v0.1)

| Tool | Maps to |
| --- | --- |
| `get_profile` | Profile + subscription summary |
| `list_goals` | `getGoalsWithChallenges` / goals list |
| `list_challenges` | Challenges page data |
| `list_habits` | `listHabits` + today logs |
| `get_progress_summary` | Progress aggregates |
| `get_ai_recommendations` | `buildRuleBasedRecommendation` |

### Write (v0.2+, after security stack)

| Tool | Maps to | Required scope |
| --- | --- | --- |
| `create_goal` | Goal create + `assertCanCreateGoal` | `write:goals` |
| `update_goal` | Goal update | `write:goals` |
| `create_challenge` | `createChallengeWithStages` | `write:challenges` |
| `complete_challenge_step` | `completeStage` | `complete:challenge_step` |
| `create_habit` | `createHabit` + plan limit | `write:habits` |
| `complete_habit` | `completeHabit` | `complete:habit` |

Каждый write-tool:

1. Проверяет token + scope.
2. Вызывает **existing domain function** (не inline Supabase).
3. Пишет **audit log**.
4. Возвращает structured result (XP awarded, achievements unlocked, errors).

### Optional confirmation (v0.2+)

Для high-impact actions agent может получить `confirmation_required: true` до выполнения:

- `complete_challenge_step` (XP + achievement side effects);
- `create_challenge` (plan limits);
- archive/delete operations.

User подтверждает в Lifera UI или через one-time approval token.

## Security rules

1. **No unauthenticated access** — MCP handshake требует valid Lifera API token.
2. **No global service-role exposure** — MCP process использует token-scoped server adapter; service role только внутри domain paths, как сегодня в Route Handlers.
3. **No direct database writes from MCP** — MCP tools → API/domain layer → Supabase.
4. **MCP tools call existing domain functions / API layer** — единые правила XP, streak, idempotency.
5. **All write actions are logged** — `agent_action_logs` (future).
6. **Optional user confirmation** — для complete/create с side effects.
7. **Rate limits** — per token, shared pool с API v1.
8. **Scopes** — tool declares required scope; server rejects if missing.
9. **Token revocation** — immediate; MCP sessions re-auth on next call.

## Deployment sketch (future)

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Cursor / Claude │────▶│  Lifera MCP       │────▶│  Next.js / API   │
│  ChatGPT client  │     │  Server (Node)    │     │  v1 + domain     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                         │                         │
        │   MCP protocol          │   HTTPS + Bearer        │
        │   (stdio or SSE)        │   user-scoped           │
        └─────────────────────────┴─────────────────────────┘
```

Hosted MCP на отдельном subdomain или stdio binary для local Cursor — решение на этапе реализации. **Сейчас не выбираем SDK и не добавляем зависимости.**

## Explicit non-goals (сейчас)

- Нет `@modelcontextprotocol/sdk` в `package.json`.
- Нет MCP server process в репозитории.
- Нет новых Route Handlers `/api/mcp/**`.
- Нет изменений auth, middleware, Supabase schema.

Web MVP остаётся единственным production entry point.
