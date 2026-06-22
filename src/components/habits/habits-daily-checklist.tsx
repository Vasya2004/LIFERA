import Link from "next/link";
import { Target } from "lucide-react";

import { HabitChecklistItem } from "@/components/habits/habit-checklist-item";
import type { HabitChecklistItemData } from "@/lib/domain/habits-page";

type HabitsDailyChecklistProps = {
  items: HabitChecklistItemData[];
};

export function HabitsDailyChecklist({ items }: HabitsDailyChecklistProps) {
  if (items.length === 0) {
    return (
      <section className="grid min-h-[220px] place-items-center rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900">
        <div>
          <Target className="mx-auto text-zinc-400 dark:text-zinc-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-zinc-950 dark:text-zinc-50">Нет привычек на сегодня</h2>
          <Link
            className="mt-2 inline-block text-sm font-semibold text-primary hover:text-primary/80"
            href="#create-habit"
          >
            Создать привычку
          </Link>
        </div>
      </section>
    );
  }

  const completedCount = items.filter((item) => item.completedToday).length;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Привычки на сегодня</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {completedCount} из {items.length} выполнено
        </p>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
        {items.map((item, index) => (
          <HabitChecklistItem
            isLast={index === items.length - 1}
            key={item.habit.id}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}
