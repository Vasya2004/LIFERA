import Link from "next/link";
import { Calendar, Flag, Star, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardEmptyState,
  DashboardProgressBar,
  dashboardAccents,
} from "@/components/dashboard/dashboard-card";
import type { Goal, Wish } from "@/lib/domain/types";

type DashboardMainGoalProps = {
  goal: Goal | null;
  missionsCount: number;
  wish: Wish | null;
};

export function DashboardMainGoal({ goal, missionsCount, wish }: DashboardMainGoalProps) {
  if (!goal) {
    return (
      <DashboardCard accent="brand" className="lg:min-h-[300px]">
        <DashboardEmptyState
          accent="brand"
          action={
            <Link href="/goals">
              <Button className="bg-primary px-5 text-white hover:bg-[var(--primary-hover)]">
                Создать цель
              </Button>
            </Link>
          }
          description="Создайте цель, чтобы Lifera собрала вокруг нее привычки, желание и следующий фокус."
          icon={<Target />}
          title="Главная цель не выбрана"
        />
      </DashboardCard>
    );
  }

  const progress = Number(goal.progress ?? 0);
  const deadline = goal.target_date
    ? new Date(goal.target_date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <DashboardCard accent="brand" className="lg:min-h-[300px]">
      <div className="relative grid h-full min-w-0 content-between gap-6">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className={[dashboardAccents.brand.border, dashboardAccents.brand.bg, dashboardAccents.brand.text, "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border"].join(" ")}>
              <Flag size={20} />
            </div>
            <div className="min-w-0">
              <p className={["text-xs font-semibold uppercase tracking-[0.2em]", dashboardAccents.brand.text].join(" ")}>
            Главная цель
              </p>

              <h2 className="mt-2 line-clamp-2 break-words text-2xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 xl:text-3xl">
                {goal.title}
              </h2>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Прогресс цели</span>
              <span className={["shrink-0 text-xl font-semibold", dashboardAccents.brand.text].join(" ")}>
              {progress}%
              </span>
            </div>
            <DashboardProgressBar accent="brand" value={progress} />
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35">
              <Calendar className="text-zinc-500 dark:text-zinc-500" size={18} />
              <div className="min-w-0">
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Срок</p>
                <p className="mt-1 break-words font-semibold text-zinc-950 dark:text-zinc-50">
                  {deadline || "Не задан"}
                </p>
              </div>
            </div>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35">
              <Target className="text-zinc-500 dark:text-zinc-500" size={18} />
              <div>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Привычки</p>
                <p className="mt-1 font-semibold text-zinc-950 dark:text-zinc-50">
                  {missionsCount > 0 ? `${missionsCount} активных` : "Нет связанных привычек"}
                </p>
              </div>
            </div>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35">
              <Star className="text-zinc-500 dark:text-zinc-500" size={18} />
              <div className="min-w-0">
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Желание</p>
                <p className="mt-1 line-clamp-2 break-words font-semibold text-zinc-950 dark:text-zinc-50">
                  {wish?.title || "Нет желания"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Link className="inline-flex w-full sm:w-fit" href={`/goals/${goal.id}`}>
          <Button className="w-full bg-primary px-5 text-white hover:bg-[var(--primary-hover)] sm:w-auto">
            Открыть цель
          </Button>
        </Link>
      </div>
    </DashboardCard>
  );
}
