import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardWeeklyPulse } from "@/lib/domain/dashboard";

type DashboardWeeklyPulseProps = {
  weekly: DashboardWeeklyPulse;
};

export function DashboardWeeklyPulseBlock({ weekly }: DashboardWeeklyPulseProps) {
  const maxXp = Math.max(1, ...weekly.daily.map((day) => day.xp));

  return (
    <Card className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Пульс недели</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Опыт, привычки и этапы за 7 дней.
          </p>
        </div>
      </div>

      {!weekly.hasActivity ? (
        <div className="grid gap-4 rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            На этой неделе пока нет активности. Начните с фокуса дня.
          </p>
          <a href="#dashboard-focus">
            <Button size="sm" variant="secondary">
              К фокусу дня
            </Button>
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekly.daily.map((day) => {
              const xpHeight = Math.max(10, Math.round((day.xp / maxXp) * 100));
              const actionCount = day.habits + day.stages;

              return (
                <div
                  className={[
                    "grid min-w-0 content-end gap-2 rounded-[var(--radius-control)] p-1 text-center sm:p-2",
                    day.isToday
                      ? "border border-[color:var(--border-primary-subtle)] bg-primary-subtle/20"
                      : "",
                  ].join(" ")}
                  key={day.date}
                >
                  <div className="mx-auto flex h-20 w-full max-w-9 items-end justify-center gap-0.5 sm:h-24 sm:max-w-10">
                    <div
                      className="w-2 rounded-t bg-primary/85"
                      style={{ height: `${xpHeight}%` }}
                      title={`${day.xp} опыта`}
                    />
                    {actionCount > 0 ? (
                      <div
                        className="w-1.5 rounded-t bg-muted-foreground/35"
                        style={{
                          height: `${Math.max(8, Math.min(72, actionCount * 18))}%`,
                        }}
                        title={`${actionCount} действий`}
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium capitalize text-muted-foreground sm:text-[11px]">
                      {day.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{day.xp}</p>
                    <p className="text-[10px] leading-4 text-muted-foreground">
                      {day.stages} эт. · {day.habits} мис.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Опыт за неделю</p>
              <p className="metric-value mt-1 text-xl">+{weekly.xp}</p>
            </div>
            <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Привычек</p>
              <p className="metric-value mt-1 text-xl">{weekly.habitCompletions}</p>
            </div>
            <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">Этапов привычек</p>
              <p className="metric-value mt-1 text-xl">{weekly.stagesCompleted}</p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
