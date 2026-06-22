import Link from "next/link";
import { Sparkles, Star, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HabitsTodaySummary } from "@/lib/domain/habits-page";

type HabitsSidePanelProps = {
  summary: HabitsTodaySummary;
};

export function HabitsSidePanel({ summary }: HabitsSidePanelProps) {
  const achievementTarget = 10;
  const achievementProgress = Math.min(achievementTarget, summary.bestStreak);
  const achievementPercent = Math.round((achievementProgress / achievementTarget) * 100);

  return (
    <div className="grid gap-5 xl:sticky xl:top-[calc(var(--topbar-height)+1rem)]">
      <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Главное желание</h2>
          <Sparkles className="text-zinc-400 dark:text-zinc-500" size={14} />
        </div>
        <div className="grid gap-3">
          <div className="grid h-[112px] place-items-center overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 dark:border-white/10 dark:bg-zinc-800/60">
            <Star className="text-zinc-300 dark:text-zinc-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Добавьте главное желание</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Свяжите мотивационный фокус с привычками.
            </p>
          </div>
          <Link href="/goals/wishes">
            <Button className="w-full" size="sm">Добавить</Button>
          </Link>
        </div>
      </aside>

      <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Ближайшее достижение</h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full border border-orange-200 bg-orange-50 text-orange-500 dark:border-orange-500/25 dark:bg-orange-500/10">
            <Trophy size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">10 привычек подряд</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {achievementProgress} / {achievementTarget}
            </p>
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-50 text-[11px] font-bold text-orange-500 dark:bg-orange-500/10">
            XP
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
            style={{ width: `${achievementPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-orange-500">+100 XP</p>
      </aside>
    </div>
  );
}
