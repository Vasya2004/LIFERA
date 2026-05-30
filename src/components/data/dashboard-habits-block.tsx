import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatLifeArea } from "@/lib/domain/labels";
import type { Habit } from "@/lib/domain/types";

type DashboardHabitsBlockProps = {
  completedTodayIds: Set<string>;
  habits: Habit[];
};

export function DashboardHabitsBlock({ completedTodayIds, habits }: DashboardHabitsBlockProps) {
  if (habits.length === 0) {
    return (
      <Card variant="muted">
        <h2 className="text-xl font-semibold">Ритуалы прокачки</h2>
        <p className="mt-3 text-sm text-muted-foreground">Добавьте ритуал для XP между миссиями.</p>
        <Link className="mt-4 inline-flex" href="/habits">
          <Button size="sm">Создать первую привычку</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Ритуалы прокачки</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {habits.filter((habit) => completedTodayIds.has(habit.id)).length} из {habits.length}{" "}
            выполнено сегодня
          </p>
        </div>
        <Link href="/habits">
          <Button size="sm" variant="secondary">
            Открыть привычки
          </Button>
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {habits.slice(0, 3).map((habit) => {
          const doneToday = completedTodayIds.has(habit.id);

          return (
            <div
              className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3"
              key={habit.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{habit.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatLifeArea(habit.life_area)} · {habit.xp_reward} XP · streak{" "}
                    {habit.streak_current}
                  </p>
                </div>
                <Badge variant={doneToday ? "success" : "muted"}>
                  {doneToday ? "Выполнено" : "Не выполнено"}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
