import { Target } from "lucide-react";
import Link from "next/link";

import { HabitsWeeklyRhythm } from "@/components/habits/habits-weekly-rhythm";
import { Button } from "@/components/ui/button";
import type {
  HabitRhythmItem,
  HabitsTodaySummary,
} from "@/lib/domain/habits-page";

type HabitsRhythmViewProps = {
  items: HabitRhythmItem[];
  summary: HabitsTodaySummary;
};

export function HabitsRhythmView({ items, summary }: HabitsRhythmViewProps) {
  if (items.length === 0) {
    return (
      <section className="grid min-h-[220px] place-items-center rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-white/10 dark:bg-zinc-900">
        <div>
          <Target className="mx-auto text-zinc-400 dark:text-zinc-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Ритм появится после выполнения первых привычек
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Выполните привычку, чтобы начать серию.
          </p>
          <Link className="mt-4 inline-block" href="/habits?view=today">
            <Button size="sm">Перейти к сегодняшним привычкам</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Ритм недели</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/10 dark:bg-zinc-800/60">
            <p className="text-2xl font-bold text-primary">{summary.bestStreak}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">дней серии</p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/10 dark:bg-zinc-800/60">
            <p className="text-2xl font-bold text-primary">+{summary.xpToday} XP</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">за сегодня</p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center dark:border-white/10 dark:bg-zinc-800/60">
            <p className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">{summary.completedToday}/{summary.totalActive}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">выполнено</p>
          </div>
        </div>
      </section>

      <HabitsWeeklyRhythm items={items} />
    </>
  );
}
