import Link from "next/link";

import { DashboardHabitCompleteButton } from "@/components/dashboard/dashboard-habit-complete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Habit } from "@/lib/domain/types";

type DashboardRitualsPreviewProps = {
  completedTodayIds: Set<string>;
  habits: Habit[];
};

export function DashboardRitualsPreview({
  completedTodayIds,
  habits,
}: DashboardRitualsPreviewProps) {
  return (
    <Card className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Привычки на сегодня</h2>
          {habits.length > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {habits.filter((habit) => completedTodayIds.has(habit.id)).length} из {habits.length}{" "}
              выполнено
            </p>
          ) : null}
        </div>
        <Link
          className="text-sm font-semibold text-primary hover:text-[var(--primary-hover)]"
          href="/habits"
        >
          Все привычки
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">Добавьте привычку для ежедневного движения.</p>
          <Link className="mt-4 inline-flex w-full sm:inline-flex" href="/habits">
            <Button className="w-full sm:w-auto" size="sm">
              Создать привычку
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {habits.map((habit) => {
            const doneToday = completedTodayIds.has(habit.id);

            return (
              <div
                className={[
                  "grid gap-3 rounded-[var(--radius-control)] border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
                  doneToday
                    ? "border-success/25 bg-success-subtle/20"
                    : "border-border bg-surface-muted/70",
                ].join(" ")}
                key={habit.id}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{habit.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Серия {habit.streak_current} дн. · +{habit.xp_reward} опыта
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Badge variant={doneToday ? "success" : "muted"}>
                    {doneToday ? "Выполнено" : "Не выполнено"}
                  </Badge>
                  {!doneToday ? (
                    <DashboardHabitCompleteButton
                      habitId={habit.id}
                      initialCompleted={false}
                      label="Отметить"
                      size="sm"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
