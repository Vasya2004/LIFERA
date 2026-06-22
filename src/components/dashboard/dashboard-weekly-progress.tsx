import { Card } from "@/components/ui/card";
import type { DashboardWeeklyPulse } from "@/lib/domain/dashboard";

type DashboardWeeklyProgressProps = {
  weekly: DashboardWeeklyPulse;
};

export function DashboardWeeklyProgress({ weekly }: DashboardWeeklyProgressProps) {
  const maxXp = Math.max(1, ...weekly.daily.map((d) => d.xp));
  const maxMissions = Math.max(1, ...weekly.daily.map((d) => d.habits + d.stages));
  const totalXp = weekly.xp;
  const totalMissions = weekly.habitCompletions + weekly.stagesCompleted;

  return (
    <Card className="dashboard-panel flex h-full min-h-[250px] flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-white">Прогресс недели</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> XP
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-500" /> Привычки
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-end">
        <div className="grid h-28 grid-cols-7 items-end gap-2 border-b border-white/10 pb-2">
          {weekly.daily.map((day) => {
            const missionCount = day.habits + day.stages;
            const xpHeight = day.xp > 0 ? Math.max(8, Math.round((day.xp / maxXp) * 96)) : 4;
            const missionHeight =
              missionCount > 0 ? Math.max(8, Math.round((missionCount / maxMissions) * 84)) : 4;

            return (
              <div className="flex h-full flex-col items-center justify-end gap-2" key={day.date}>
                <div className="flex h-24 w-full items-end justify-center gap-1">
                  <div
                    className="w-3 rounded-t-sm bg-primary shadow-[0_0_16px_rgba(255,90,31,0.28)]"
                    style={{ height: `${xpHeight}px` }}
                  />
                  <div
                    className="w-3 rounded-t-sm bg-zinc-500/75"
                    style={{ height: `${missionHeight}px` }}
                  />
                </div>
                <span className="text-xs leading-none text-muted-foreground">
                  {day.label.slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Всего XP</p>
          <p className="mt-1 text-xl font-bold text-primary">{totalXp}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Привычек выполнено</p>
          <p className="mt-1 text-xl font-bold text-white">{totalMissions}</p>
        </div>
      </div>
    </Card>
  );
}
