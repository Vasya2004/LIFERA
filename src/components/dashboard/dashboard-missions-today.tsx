import Link from "next/link";
import { Plus, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardHabitTodayCheck } from "@/components/dashboard/dashboard-habit-today-check";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
  DashboardProgressBar,
  dashboardAccents,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import { formatLifeArea } from "@/lib/domain/labels";
import type { DashboardTodayHabit } from "@/lib/domain/dashboard";

type DashboardMissionsTodayProps = {
  completedTodayIds: Set<string>;
  habits: DashboardTodayHabit[];
};

export function DashboardMissionsToday({
  completedTodayIds,
  habits,
}: DashboardMissionsTodayProps) {
  const completedCount = habits.filter((h) => completedTodayIds.has(h.id)).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const visibleHabits = habits.slice(0, 5);

  return (
    <DashboardCard accent="missions" className="min-h-[250px]">
      <DashboardCardHeader accent="missions" icon={<Target />} title="Привычки на сегодня" />

      {habits.length === 0 ? (
        <DashboardEmptyState
          accent="missions"
          action={
            <Link href="/habits">
              <Button className={dashboardGhostButtonClass("missions")} size="sm" variant="secondary">
                <Plus size={14} /> Создать привычку
              </Button>
            </Link>
          }
          description="Создайте привычку, чтобы цель начала двигаться."
          icon={<Target />}
          title="Нет активных привычек"
        />
      ) : (
        <>
          <div className="mt-4 grid gap-1">
            {visibleHabits.map((habit) => {
              const done = completedTodayIds.has(habit.id);
              return (
                <div
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-zinc-200 py-2.5 last:border-b-0 dark:border-white/5"
                  key={habit.id}
                >
                  <DashboardHabitTodayCheck completed={done} habitId={habit.id} title={habit.title} />
                  <div className="min-w-0">
                    <p className="line-clamp-2 break-words text-sm font-medium text-zinc-950 dark:text-zinc-50">{habit.title}</p>
                    <span className="mt-1 inline-flex max-w-full rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                      <span className="truncate">
                        {habit.goalTitle ?? formatLifeArea(habit.life_area)}
                      </span>
                    </span>
                  </div>
                  <span className={[dashboardAccents.missions.bg, dashboardAccents.missions.text, "shrink-0 rounded-full px-2 py-1 text-xs font-bold"].join(" ")}>
                    +{habit.xp_reward} XP
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto grid gap-2 pt-4">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>{completedCount} из {totalCount} выполнено</span>
              <span>{progress}%</span>
            </div>
            <DashboardProgressBar accent="missions" value={progress} />
            <Link className="mt-2 inline-flex" href="/habits">
              <Button className={dashboardGhostButtonClass("missions")} size="sm" variant="secondary">Все привычки</Button>
            </Link>
          </div>
        </>
      )}
    </DashboardCard>
  );
}
