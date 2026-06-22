import { Flame, User } from "lucide-react";

import { CircularProgress } from "@/components/ui/circular-progress";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardProgressBar,
  dashboardAccents,
} from "@/components/dashboard/dashboard-card";

type DashboardUserLevelProps = {
  level: number;
  levelProgress: number;
  streak: number;
  xpToNextLevel: number;
  xpTotal: number;
};

export function DashboardUserLevel({
  level,
  levelProgress,
  streak,
  xpToNextLevel,
  xpTotal,
}: DashboardUserLevelProps) {
  return (
    <DashboardCard accent="brand" className="lg:min-h-[300px]">
      <DashboardCardHeader accent="brand" icon={<User />} title="Уровень пользователя" />

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <CircularProgress showLabel={false} size={96} strokeWidth={7} value={levelProgress} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Уровень</span>
            <span className="text-3xl font-semibold leading-none text-zinc-950 dark:text-zinc-50">{level}</span>
          </div>
        </div>

        <div className="min-w-0">
          <p className={["text-2xl font-semibold", dashboardAccents.brand.text].join(" ")}>
          {xpTotal.toLocaleString("ru-RU")} XP
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            До следующего уровня: {xpToNextLevel} XP
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Прогресс уровня</span>
          <span className="font-semibold text-zinc-950 dark:text-zinc-50">{levelProgress}%</span>
        </div>
        <DashboardProgressBar accent="brand" value={levelProgress} />
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-zinc-200 pt-4 text-sm text-zinc-950 dark:border-white/10 dark:text-zinc-50">
        <Flame className={dashboardAccents.brand.text} size={16} />
        <span>Серия: {streak} дней</span>
      </div>
    </DashboardCard>
  );
}
