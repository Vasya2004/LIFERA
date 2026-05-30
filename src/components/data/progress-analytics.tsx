import Link from "next/link";

import { PageTitle } from "@/components/layout/page-title";
import { AchievementCard } from "@/components/ui/achievement-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ListItem } from "@/components/ui/list-item";
import { Progress } from "@/components/ui/progress";
import { ProgressCard } from "@/components/ui/progress-card";
import { StatCard } from "@/components/ui/stat-card";
import { formatLifeArea } from "@/lib/domain/labels";
import type { LifeAreaStatus, ProgressData } from "@/lib/domain/progress";

const statusLabels: Record<LifeAreaStatus, string> = {
  declining: "проседает",
  rising: "растёт",
  stable: "стабильно",
};

const statusVariants: Record<LifeAreaStatus, "success" | "warning" | "muted"> = {
  declining: "warning",
  rising: "success",
  stable: "muted",
};

const xpSourceLabels: Record<string, string> = {
  achievement: "Достижения",
  challenge_stage: "Шаги челленджей",
  habit_log: "Ритуалы",
  other: "Прочее",
};

type ProgressAnalyticsProps = {
  data: ProgressData;
};

export function ProgressAnalytics({ data }: ProgressAnalyticsProps) {
  const hasAnyActivity =
    data.xp.total > 0 ||
    data.goals.active > 0 ||
    data.challenges.active > 0 ||
    data.habits.active > 0;

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 overflow-x-hidden px-5 py-8 sm:px-8">
      <PageTitle subtitle="Динамика развития." title="Прогресс" />

      {data.loadError ? (
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{data.loadError}</p>
        </Card>
      ) : null}

      {data.subscription.historyLimited ? (
        <Card variant="muted">
          <p className="text-sm text-muted-foreground">
            На Free-плане показана история за {data.subscription.historyDays} дней. Полная история
            доступна на Pro и Ultra.{" "}
            <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/plan">
              Открыть план
            </Link>
          </p>
        </Card>
      ) : null}

      {!hasAnyActivity ? (
        <EmptyState
          description="Завершите шаг или отметьте ритуал."
          title="Динамика пока не накоплена"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/goals">
              <Button size="sm">Создать цель</Button>
            </Link>
            <Link href="/challenges">
              <Button size="sm" variant="secondary">
                Начать челлендж
              </Button>
            </Link>
            <Link href="/habits">
              <Button size="sm" variant="secondary">
                Создать привычку
              </Button>
            </Link>
          </div>
        </EmptyState>
      ) : null}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <StatCard
          detail="Общее состояние экосистемы"
          label="Life Score"
          progress={data.profile.life_score}
          value={`${data.profile.life_score}`}
        />
        <StatCard detail={`${data.xp.toNextLevel} XP до следующего уровня`} label="Level" value={`${data.profile.level}`} />
        <StatCard detail="Всего опыта" label="XP total" value={`${data.xp.total}`} />
        <StatCard detail="С начала текущей недели" label="XP за неделю" value={`${data.xp.weekly}`} />
        <StatCard detail="habit_logs за неделю" label="Выполнено привычек" value={`${data.weekly.habitCompletions}`} />
        <StatCard detail="challenge_stages за неделю" label="Завершено шагов" value={`${data.weekly.challengeStagesCompleted}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ProgressCard
          description={`Уровень ${data.profile.level} · до уровня ${data.profile.level + 1} осталось ${data.xp.toNextLevel} XP`}
          label="Прогресс уровня"
          value={data.profile.levelProgressPercent}
        />
        <Card>
          <h2 className="text-lg font-semibold">Источники XP</h2>
          <div className="mt-4 grid gap-3">
            {Object.entries(data.xp.bySource).map(([key, value]) => (
              <div
                className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3"
                key={key}
              >
                <span className="text-sm text-foreground">{xpSourceLabels[key] ?? key}</span>
                <span className="font-semibold text-primary">{value} XP</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Сферы жизни</h2>
          <Badge variant="muted">Лучший streak: {data.habits.bestStreak}</Badge>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {data.lifeAreas.map((area) => (
            <div
              className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-4"
              key={area.area}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{formatLifeArea(area.area)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {area.goalsCount} целей · {area.challengesCount} челленджей · {area.habitsCount}{" "}
                    ритуалов
                  </p>
                </div>
                <Badge variant={statusVariants[area.status]}>{statusLabels[area.status]}</Badge>
              </div>
              <Progress className="mt-4" label="Прогресс целей" tone="primary" value={area.progressPercent} />
              <p className="mt-3 text-xs text-muted-foreground">
                Неделя: {area.weeklyActivity} действий · {area.weeklyXp} XP
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Активность за 7 дней</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {data.weekly.daily.map((day) => {
            const totalActions = day.habits + day.stages + day.achievements;
            const barValue = Math.min(100, totalActions * 25 + Math.min(day.xp / 5, 40));

            return (
              <div
                className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-3 py-3 text-center"
                key={day.date}
              >
                <p className="text-xs font-medium text-muted-foreground">{day.label}</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{day.xp}</p>
                <p className="text-xs text-muted-foreground">XP</p>
                <Progress className="mt-3" tone="success" value={barValue} />
                <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                  {day.habits} рит. · {day.stages} шаг. · {day.achievements} дост.
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Цели</h2>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/goals">
              Открыть
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatCard detail="active" label="Активные" value={`${data.goals.active}`} />
            <StatCard detail="completed" label="Завершённые" value={`${data.goals.completed}`} />
            <StatCard detail="средний %" label="Средний прогресс" value={`${data.goals.averageProgress}%`} />
          </div>
          {data.goals.items.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {data.goals.items.map((goal) => (
                <ListItem
                  key={goal.id}
                  meta={`${formatLifeArea(goal.life_area)} · ${goal.progress}%`}
                  title={goal.title}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-5 text-center">
              <p className="text-sm text-muted-foreground">Нет активных целей</p>
              <Link className="mt-3 inline-flex" href="/goals">
                <Button size="sm">Создать цель</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Челленджи</h2>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/challenges">
              Открыть
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatCard detail="active" label="Активные" value={`${data.challenges.active}`} />
            <StatCard detail="completed" label="Завершённые" value={`${data.challenges.completed}`} />
            <StatCard detail="средний %" label="Средний прогресс" value={`${data.challenges.averageProgress}%`} />
          </div>
          {data.challenges.items.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {data.challenges.items.map((challenge) => (
                <ListItem
                  key={challenge.id}
                  meta={
                    challenge.nextStageTitle
                      ? `Прогресс ${challenge.progress}% · шаг: ${challenge.nextStageTitle}`
                      : `Прогресс ${challenge.progress}%`
                  }
                  title={challenge.title}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-5 text-center">
              <p className="text-sm text-muted-foreground">Нет активных челленджей</p>
              <Link className="mt-3 inline-flex" href="/challenges">
                <Button size="sm">Начать челлендж</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Привычки</h2>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/habits">
              Открыть
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatCard detail="активные ритуалы" label="Активные" value={`${data.habits.active}`} />
            <StatCard detail="сегодня / неделя" label="Выполнено" value={`${data.habits.completedToday} / ${data.habits.completedThisWeek}`} />
            <StatCard detail="streak_best" label="Лучший streak" value={`${data.habits.bestStreak}`} />
            <StatCard detail="за неделю" label="XP от привычек" value={`${data.habits.weeklyXp}`} />
          </div>
          {data.habits.active > 0 ? (
            <>
              <p className="mt-4 text-sm text-muted-foreground">
                Completion rate за неделю: {data.habits.completionRate}%
              </p>
              <div className="mt-3 grid gap-2">
                {data.habits.items.map((habit) => (
                  <ListItem
                    key={habit.id}
                    marker={habit.completedToday ? "success" : "muted"}
                    meta={`Streak ${habit.streak_current} · ${habit.xp_reward} XP`}
                    title={habit.title}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-5 text-center">
              <p className="text-sm text-muted-foreground">Нет активных ритуалов</p>
              <Link className="mt-3 inline-flex" href="/habits">
                <Button size="sm">Создать привычку</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Достижения</h2>
            <Link className="text-sm font-semibold text-primary hover:underline" href="/achievements">
              Все
            </Link>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Открыто {data.achievements.unlocked} из {data.achievements.total} · за неделю:{" "}
            {data.achievements.unlockedThisWeek}
          </p>
          {data.achievements.recentUnlocked.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {data.achievements.recentUnlocked.map((achievement) => (
                <AchievementCard
                  description={achievement.description}
                  key={achievement.id}
                  status="unlocked"
                  title={achievement.title}
                  unlockedAt={achievement.unlocked_at}
                  xpReward={Number(achievement.xp_reward)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Завершите первый шаг или ритуал, чтобы открыть milestone.
            </p>
          )}
          {data.achievements.nextLocked ? (
            <div className="mt-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Ближайшее достижение</p>
              <p className="mt-1 font-medium text-foreground">{data.achievements.nextLocked.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.achievements.nextLocked.conditionHint}
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      <Card variant="highlight">
        <p className="text-sm font-medium text-primary">AI-вывод по прогрессу</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">{data.insight.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{data.insight.content}</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold">История XP</h2>
          <div className="mt-4 grid gap-3">
            {data.recentXpTransactions.length > 0 ? (
              data.recentXpTransactions.map((transaction) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3"
                  key={transaction.id}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                  <span className="font-semibold text-primary">+{transaction.amount} XP</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Завершите первый шаг или ритуал, чтобы увидеть XP transactions.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Журнал ритуалов</h2>
          <div className="mt-4 grid gap-3">
            {data.recentHabitLogs.length > 0 ? (
              data.recentHabitLogs.map((log) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3"
                  key={log.id}
                >
                  <p className="text-sm font-medium text-foreground">
                    {log.title} · {new Date(log.completed_on).toLocaleDateString("ru-RU")}
                  </p>
                  <span className="font-semibold text-primary">+{log.xp_awarded} XP</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Отметьте первый ритуал прокачки, чтобы увидеть регулярный прогресс.
              </p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
