import { Target } from "lucide-react";

import type { HabitChecklistItemData } from "@/lib/domain/habits-page";

type HabitsAllViewProps = {
  items: HabitChecklistItemData[];
};

export function HabitsAllView({ items }: HabitsAllViewProps) {
  if (items.length === 0) {
    return (
      <section className="grid min-h-[220px] place-items-center rounded-xl border border-border bg-surface p-6 text-center">
        <div>
          <Target className="mx-auto text-muted-foreground" size={32} />
          <h2 className="mt-3 text-base font-semibold text-foreground">
            Нет активных привычек
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Создайте привычку и привяжите её с целью.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Все привычки</h2>
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "привычка" : items.length < 5 ? "привычки" : "привычек"}
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div
            className="flex items-center gap-4 rounded-xl border border-border bg-surface-muted px-4 py-3"
            key={item.habit.id}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.habit.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {item.goalTitle ? <span className="truncate">{item.goalTitle}</span> : null}
                <span className="font-semibold text-orange-500">+{item.habit.xp_reward} XP</span>
                <span>{item.habit.frequency === "daily" ? "Каждый день" : item.habit.frequency === "weekdays" ? "По будням" : item.habit.frequency === "weekly" ? "Раз в неделю" : "Гибкий ритм"}</span>
              </div>
            </div>
            {item.completedToday ? (
              <span className="shrink-0 text-xs font-semibold text-green-500">выполнено</span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
