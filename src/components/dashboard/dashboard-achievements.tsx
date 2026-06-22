import Link from "next/link";
import { Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
  DashboardProgressBar,
  dashboardAccents,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import type { DashboardAchievementSummary } from "@/lib/domain/dashboard";

type DashboardAchievementsProps = {
  summary: DashboardAchievementSummary;
  total: number;
  unlocked: number;
};

export function DashboardAchievements({ summary, total, unlocked }: DashboardAchievementsProps) {
  return (
    <DashboardCard accent="achievements" className="min-h-[160px]">
      <DashboardCardHeader accent="achievements" icon={<Trophy />} title="Достижения" />

      {summary.total === 0 || unlocked === 0 ? (
        <DashboardEmptyState
          accent="achievements"
          action={
            <Link href="/achievements">
              <Button className={dashboardGhostButtonClass("achievements")} size="sm" variant="secondary">Открыть достижения</Button>
            </Link>
          }
          description="Завершайте привычки и этапы, чтобы открыть первые достижения."
          icon={<Trophy />}
          title="Достижения пока не открыты"
        />
      ) : (
        <div className="mt-5 grid gap-4">
          <div className="flex min-w-0 items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Ближайшее достижение</p>
              <p className="mt-1 line-clamp-2 break-words text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {summary.nextTitle ?? "Все текущие достижения открыты"}
              </p>
            </div>
            <p className="shrink-0 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              <span className={dashboardAccents.achievements.text}>{unlocked}</span> / {total}
            </p>
          </div>
          <DashboardProgressBar accent="achievements" value={summary.progress} />
          <Link href="/achievements">
            <Button className={dashboardGhostButtonClass("achievements")} size="sm" variant="secondary">Посмотреть все</Button>
          </Link>
        </div>
      )}
    </DashboardCard>
  );
}
