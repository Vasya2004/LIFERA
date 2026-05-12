# App Structure

## Основной принцип

LifeOS должен развиваться модульно. Каждый крупный раздел отвечает за свою предметную область, но общие пользовательские данные, авторизация, XP, достижения и AI-рекомендации связывают модули между собой через понятные backend-интерфейсы.

## Предварительные роуты

| Роут | Назначение |
| --- | --- |
| `/auth` | Регистрация, вход, восстановление доступа. |
| `/onboarding` | Первичная настройка пользователя и выбор сфер развития. |
| `/dashboard` | Главный обзор: задачи, привычки, цели, XP, рекомендации. |
| `/goals` | Создание, просмотр и управление целями. |
| `/tasks` | Список задач, фильтры, выполнение задач. |
| `/habits` | Привычки, отметки, streak, история. |
| `/skills` | Навыки, уровни развития, связь с целями. |
| `/health` | Логи здоровья, самочувствия и активности. |
| `/capital` | Финансовые записи и капитал. |
| `/achievements` | Достижения, уровни и игровые события. |
| `/ai-coach` | AI-помощник и история рекомендаций. |
| `/profile` | Профиль пользователя. |
| `/settings` | Настройки приложения, приватности и интеграций. |

## Роуты Core MVP

Для первой рабочей версии обязательны только:

- `/auth`;
- `/onboarding`;
- `/dashboard`;
- `/goals`;
- `/tasks`;
- `/habits`;
- `/achievements`;
- `/ai-coach`;
- `/profile`;
- `/settings`.

Роуты `/skills`, `/health` и `/capital` относятся к следующему продуктовому слою. Их не нужно реализовывать до проверки основного цикла Goals -> Tasks/Habits -> XP -> Dashboard -> AI Coach.

## Возможные группы компонентов

- Layout: `AppShell`, `Sidebar`, `MobileNav`, `TopBar`, `PageHeader`.
- Auth: `AuthForm`, `ProtectedRoute`, `SessionProvider`.
- Dashboard: `TodayTasks`, `HabitChecklist`, `LifeAreaProgress`, `XPProgress`, `CoachSuggestion`.
- Goals: `GoalCard`, `GoalForm`, `GoalProgress`, `GoalTaskList`.
- Tasks: `TaskList`, `TaskItem`, `TaskFilters`, `TaskForm`.
- Habits: `HabitCard`, `HabitTracker`, `StreakIndicator`, `HabitCalendar`.
- Skills: `SkillCard`, `SkillProgress`, `SkillForm`.
- Health: `HealthLogForm`, `HealthMetricCard`, `WellbeingChart`.
- Capital: `CapitalEntryForm`, `CapitalSummary`, `CapitalChart`.
- Achievements: `AchievementCard`, `LevelProgress`, `XPEventList`.
- AI Coach: `CoachChat`, `RecommendationCard`, `GoalBreakdownPreview`.
- Shared UI: buttons, dialogs, forms, empty states, skeletons, toasts.

## Независимые модули

Эти модули должны иметь минимальную связанность и собственные типы/операции:

- Auth/Profile.
- Goals.
- Tasks.
- Habits.
- Skills - после Core MVP.
- Health - после Core MVP, с отдельной проверкой приватности.
- Capital - после Core MVP, с отдельной проверкой приватности.
- AI Coach.
- Analytics.
- Billing в будущем.

## Связанные модули

Некоторые области неизбежно связаны:

- Goals связаны с Tasks, Skills и Life Areas.
- Tasks и Habits создают XP-события.
- Habit Logs влияют на streak и достижения.
- Achievements зависят от XP Events, Tasks, Habits, Goals и Skills.
- Dashboard читает агрегированные данные из нескольких модулей.
- AI Coach может читать ограниченный контекст Goals, Tasks, Habits и Progress.

Для Core MVP связь Skills с Goals/Tasks/Habits считается будущей. В первой версии Dashboard и AI Coach не должны зависеть от Health, Capital или Skills.

## Архитектурное правило

Модуль не должен напрямую изменять чужую внутреннюю логику. Например, завершение задачи может вызвать общий сервис начисления XP, но не должно вручную создавать достижения в UI-компоненте. Игровые события и достижения должны обрабатываться через отдельный backend-слой или доменные функции.
