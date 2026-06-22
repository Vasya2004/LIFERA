import Link from "next/link";

import { DashboardHabitCompleteButton } from "@/components/dashboard/dashboard-habit-complete-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardMissionStages } from "@/lib/domain/dashboard";
import type { DashboardFocus } from "@/lib/domain/dashboard-focus";

type DashboardFocusBlockProps = {
  completedTodayHabitIds: Set<string>;
  focus: DashboardFocus;
  missionProgress?: number;
  missionStages?: DashboardMissionStages;
};

const focusTypeLabels = {
  mission: "Привычка",
  ritual: "Привычка",
  start: "Старт",
} as const;

export function DashboardFocusBlock({
  completedTodayHabitIds,
  focus,
  missionProgress = 0,
  missionStages = { completed: 0, total: 0 },
}: DashboardFocusBlockProps) {
  return (
    <Card
      className="relative overflow-hidden p-5 sm:p-6 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-primary/40"
      id="dashboard-focus"
      variant="elevated"
    >
      <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Фокус дня
      </p>

      {focus.kind === "mission" ? (
        <div className="relative mt-5 grid gap-5">
          <div>
            <p className="text-sm text-muted-foreground">{focusTypeLabels.mission}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {focus.stageTitle}
            </h2>
            {focus.stageDescription ? (
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                {focus.stageDescription}
              </p>
            ) : null}
          </div>

          {missionStages.total > 0 ? (
            <p className="text-sm text-muted-foreground">
              Этап {missionStages.completed + 1} из {missionStages.total}
            </p>
          ) : null}

          <Progress label="Прогресс" tone="success" value={missionProgress} />

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">План:</span> {focus.challengeTitle}
            </span>
            {focus.goalTitle ? (
              <span>
                <span className="font-medium text-foreground">Цель:</span> {focus.goalTitle}
              </span>
            ) : null}
          </div>

          <p className="rounded-[var(--radius-badge)] bg-primary-subtle px-3 py-1.5 text-sm font-medium text-primary">
            После выполнения: +{focus.xpReward} опыта · продвинет привычку
          </p>
        </div>
      ) : null}

      {focus.kind === "ritual" ? (
        <div className="relative mt-5 grid gap-5">
          <div>
            <p className="text-sm text-muted-foreground">{focusTypeLabels.ritual}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {focus.habitTitle}
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Серия:</span> {focus.streak} дн.
          </p>

          <p className="rounded-[var(--radius-badge)] bg-primary-subtle px-3 py-1.5 text-sm font-medium text-primary">
            После выполнения: +{focus.xpReward} опыта
          </p>

          <DashboardHabitCompleteButton
            className="w-full sm:w-auto"
            habitId={focus.habitId}
            initialCompleted={completedTodayHabitIds.has(focus.habitId)}
            label="Отметить привычку"
            size="lg"
            variant="primary"
          />
        </div>
      ) : null}

      {focus.kind === "start" ? (
        <div className="relative mt-5 grid gap-5">
          <div>
            <p className="text-sm text-muted-foreground">{focusTypeLabels.start}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Задайте первый фокус
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Создайте цель или привычку — Lifera покажет следующий шаг здесь каждый день.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="w-full sm:w-auto" href="/goals">
              <Button className="w-full" size="lg">
                Создать первый фокус
              </Button>
            </Link>
            <Link className="w-full sm:w-auto" href="/habits">
              <Button className="w-full" size="lg" variant="secondary">
                Создать привычку
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
