# Database Schema Draft

Этот документ описывает предварительную модель данных. На текущем этапе SQL-миграции не создаются.

## Общие правила

- Все пользовательские таблицы должны иметь `user_id`. Исключения - системные справочники вроде `achievements`.
- Все персональные данные должны быть защищены Supabase Row Level Security.
- Пользователь может читать и изменять только свои данные.
- Сервисные операции AI, XP и достижений должны выполняться через backend-слой.
- Секреты, API-ключи и платежные данные не хранятся в клиентском коде.
- Первая миграция должна покрывать Core MVP: `profiles`, `life_areas`, `goals`, `tasks`, `habits`, `habit_logs`, `achievements`, `user_achievements`, `xp_events`, `ai_recommendations`.
- Таблицы `skills`, `health_logs`, `capital_entries`, `subscriptions` описаны как будущие или расширенные модули и не обязаны входить в первую миграцию.

## profiles

Назначение: расширенный профиль пользователя поверх Supabase Auth.

Основные поля:

- `id` - UUID, совпадает с `auth.users.id`.
- `email` - email пользователя.
- `display_name` - отображаемое имя.
- `avatar_url` - ссылка на аватар.
- `timezone` - timezone пользователя.
- `onboarding_completed` - завершен ли onboarding.
- `created_at`, `updated_at`.

Связи: один профиль связан со всеми пользовательскими сущностями через `user_id`.

Защита: персональные данные, email, настройки.

RLS: пользователь может читать и обновлять только свой профиль.

## life_areas

Назначение: сферы жизни пользователя: здоровье, финансы, обучение, карьера и другие.

Основные поля:

- `id`.
- `user_id`.
- `name`.
- `slug`.
- `color`.
- `icon`.
- `is_active`.
- `sort_order`.
- `source` - `preset` или `custom`.
- `created_at`, `updated_at`.

Связи: `goals`, `tasks`, `habits`, `skills`, `health_logs`, `capital_entries`.

Защита: личные приоритеты пользователя.

RLS: доступ только владельцу.

Примечание: в Core MVP `life_areas` являются пользовательскими записями. Отдельный справочник системных шаблонов сфер можно добавить позже, если понадобится централизованное управление пресетами.

## goals

Назначение: цели пользователя.

Основные поля:

- `id`.
- `user_id`.
- `life_area_id`.
- `title`.
- `description`.
- `status` - `active`, `paused`, `completed`, `archived`.
- `priority`.
- `target_date`.
- `progress_percent`.
- `created_at`, `updated_at`, `completed_at`.

Связи: цель может иметь много `tasks`, быть связана с `skills` и `xp_events`.

Защита: личные цели и планы.

RLS: доступ только владельцу.

## tasks

Назначение: конкретные действия пользователя.

Основные поля:

- `id`.
- `user_id`.
- `goal_id`.
- `life_area_id`.
- `skill_id` - опционально, после включения Skills.
- `title`.
- `description`.
- `status` - `todo`, `in_progress`, `completed`, `cancelled`.
- `priority`.
- `due_date`.
- `completed_at`.
- `created_at`, `updated_at`.

Связи: может принадлежать цели и сфере жизни; выполнение создает `xp_events`; в будущем может прокачивать один навык через `skill_id` или отдельную join-таблицу.

Защита: личные задачи.

RLS: доступ только владельцу.

## habits

Назначение: регулярные действия пользователя.

Основные поля:

- `id`.
- `user_id`.
- `life_area_id`.
- `skill_id` - опционально, после включения Skills.
- `title`.
- `description`.
- `frequency` - ежедневная, еженедельная или пользовательская.
- `target_count`.
- `current_streak`.
- `best_streak`.
- `last_completed_at`.
- `is_active`.
- `created_at`, `updated_at`.

Связи: имеет много `habit_logs`, создает XP через выполнение; в будущем может прокачивать один навык через `skill_id` или отдельную join-таблицу.

Защита: личные привычки и ритм жизни.

RLS: доступ только владельцу.

## habit_logs

Назначение: история выполнения привычек.

Основные поля:

- `id`.
- `user_id`.
- `habit_id`.
- `log_date`.
- `status` - `completed`, `skipped`, `missed`.
- `note`.
- `created_at`.

Связи: принадлежит `habits`, влияет на streak, XP и достижения.

Ограничения: нужна уникальность `user_id + habit_id + log_date`, чтобы одну привычку нельзя было отметить дважды за один день.

Защита: поведенческие данные пользователя.

RLS: доступ только владельцу.

Статус: не входит в Core MVP, если первая версия фокусируется на целях, задачах, привычках и общем XP.

## skills

Назначение: навыки, которые пользователь развивает.

Основные поля:

- `id`.
- `user_id`.
- `life_area_id`.
- `name`.
- `description`.
- `level`.
- `xp`.
- `target_level`.
- `created_at`, `updated_at`.

Связи: может быть связан с целями и XP-событиями.

Защита: данные о развитии и компетенциях.

RLS: доступ только владельцу.

## health_logs

Назначение: базовые записи здоровья и самочувствия.

Основные поля:

- `id`.
- `user_id`.
- `log_date`.
- `sleep_hours`.
- `mood`.
- `energy_level`.
- `activity_minutes`.
- `weight`.
- `notes`.
- `created_at`.

Связи: может агрегироваться на dashboard и использоваться AI только при явном сценарии.

Защита: чувствительные данные здоровья.

RLS: строгий доступ только владельцу. Не передавать в AI без явной необходимости.

Статус: не входит в Core MVP. Добавлять только после отдельного проектирования приватности и UX.

## capital_entries

Назначение: финансовые записи пользователя.

Основные поля:

- `id`.
- `user_id`.
- `type` - `income`, `expense`, `asset`, `liability`.
- `category`.
- `amount`.
- `currency`.
- `entry_date`.
- `note`.
- `created_at`, `updated_at`.

Связи: агрегируется в Capital и dashboard.

Защита: финансовые данные.

RLS: строгий доступ только владельцу. Не передавать в AI без явной необходимости.

Статус: не входит в Core MVP. Добавлять только после отдельного проектирования приватности, валют и финансовых категорий.

## achievements

Назначение: каталог достижений.

Основные поля:

- `id`.
- `code`.
- `title`.
- `description`.
- `icon`.
- `xp_reward`.
- `condition_type`.
- `condition_value`.
- `is_active`.
- `created_at`, `updated_at`.

Связи: связывается с пользователями через `user_achievements`.

Защита: публичный или системный справочник.

RLS: можно разрешить чтение всем авторизованным пользователям; изменение только backend/admin.

## user_achievements

Назначение: полученные пользователем достижения.

Основные поля:

- `id`.
- `user_id`.
- `achievement_id`.
- `earned_at`.
- `metadata`.

Связи: принадлежит `profiles` и `achievements`.

Ограничения: нужна уникальность `user_id + achievement_id`, чтобы достижение нельзя было выдать повторно.

Защита: личный прогресс пользователя.

RLS: доступ только владельцу.

## xp_events

Назначение: журнал начисления XP.

Основные поля:

- `id`.
- `user_id`.
- `source_type` - `task`, `habit`, `goal`, `skill`, `achievement`, `ai`.
- `source_id`.
- `life_area_id` - опционально, для прогресса по сфере.
- `amount`.
- `reason`.
- `metadata`.
- `created_at`.

Связи: может ссылаться на разные сущности через `source_type` и `source_id`.

Защита: личный игровой прогресс.

RLS: чтение только владельцу; создание предпочтительно через backend-логику.

## ai_recommendations

Назначение: история AI-рекомендаций.

Основные поля:

- `id`.
- `user_id`.
- `type` - `goal`, `tasks`, `habit`, `progress`, `next_step`.
- `prompt_summary`.
- `response`.
- `status` - `suggested`, `accepted`, `rejected`, `applied`.
- `related_goal_id`.
- `model`.
- `input_tokens`.
- `output_tokens`.
- `cost_estimate`.
- `created_at`, `updated_at`.

Связи: может быть связана с целями, задачами или привычками.

Защита: AI-запросы и персональные рекомендации.

RLS: доступ только владельцу. Содержимое должно минимизировать чувствительные данные.

Примечание: для Core MVP дневные лимиты AI можно считать по количеству записей `ai_recommendations` за день. Если появятся более сложные лимиты, можно добавить отдельную таблицу `ai_usage_events`.

## subscriptions

Назначение: будущая модель подписок и платежей.

Основные поля:

- `id`.
- `user_id`.
- `stripe_customer_id`.
- `stripe_subscription_id`.
- `plan`.
- `status`.
- `current_period_start`.
- `current_period_end`.
- `created_at`, `updated_at`.

Связи: профиль пользователя и Stripe.

Защита: платежные идентификаторы и статус подписки.

RLS: чтение только владельцу; изменение только через backend/webhooks.

Статус: будущий модуль. Не создавать в первой миграции без задачи на платежи.
