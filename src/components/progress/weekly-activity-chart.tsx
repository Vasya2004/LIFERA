import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { ProgressData } from "@/lib/domain/progress";

type WeeklyActivityChartProps = {
  daily: ProgressData["weekly"]["daily"];
  hasWeeklyActivity: boolean;
};

export function WeeklyActivityChart({ daily, hasWeeklyActivity }: WeeklyActivityChartProps) {
  const maxXp = Math.max(1, ...daily.map((day) => day.xp));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card className="grid gap-5">
      <SectionHeader
        action={
          <Link
            className="text-sm font-semibold text-primary hover:text-[var(--primary-hover)]"
            href="/dashboard"
          >
            К главной
          </Link>
        }
        description="Опыт, этапы и ритуалы за последние 7 дней."
        title="Пульс недели"
      />

      {!hasWeeklyActivity ? (
        <div className="grid gap-4 rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            На этой неделе пока нет активности. Начните с фокуса дня.
          </p>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto" size="sm" variant="secondary">
              К фокусу дня
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {daily.map((day) => {
              const xpHeight = Math.max(10, Math.round((day.xp / maxXp) * 100));
              const actionCount = day.habits + day.stages + day.achievements;
              const isToday = day.date === today;

              return (
                <div
                  className={[
                    "grid min-w-0 content-end gap-2 rounded-[var(--radius-control)] p-1 text-center sm:p-2",
                    isToday ? "bg-primary-subtle/20 ring-1 ring-primary/25" : "",
                  ].join(" ")}
                  key={day.date}
                >
                  <div className="mx-auto flex h-24 w-full max-w-10 items-end justify-center gap-1">
                    <div
                      className="w-2 rounded-t bg-primary/80"
                      style={{ height: `${xpHeight}%` }}
                      title={`${day.xp} опыта`}
                    />
                    {actionCount > 0 ? (
                      <div
                        className="w-1.5 rounded-t bg-muted-foreground/30"
                        style={{
                          height: `${Math.max(8, Math.round((actionCount / Math.max(1, ...daily.map((d) => d.habits + d.stages + d.achievements))) * 72))}%`,
                        }}
                        title={`${actionCount} действий`}
                      />
                    ) : null}
                  </div>
                  <div>
                    <p
                      className={[
                        "text-[11px] font-medium",
                        isToday ? "text-primary" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {day.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{day.xp}</p>
                    <p className="text-[10px] leading-4 text-muted-foreground">
                      {day.stages} эт. · {day.habits} рит.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary/80" />
              Опыт
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground/30" />
              Активность
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
