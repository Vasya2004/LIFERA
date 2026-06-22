import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { HealthTrendDay } from "@/lib/domain/health";

type HealthTrendProps = {
  trend: HealthTrendDay[];
};

export function HealthTrend({ trend }: HealthTrendProps) {
  const maxEnergy = Math.max(1, ...trend.map((day) => day.energy));

  return (
    <Card className="grid gap-5">
      <SectionHeader
        description="Энергия за последние 7 дней."
        title="Ритм недели"
      />

      {trend.length === 0 ? (
        <p className="rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-5 text-sm text-muted-foreground">
          На этой неделе пока нет записей. Начните с первой записи состояния.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {trend.map((day) => {
              const height = Math.max(10, Math.round((day.energy / maxEnergy) * 100));

              return (
                <div
                  className={[
                    "grid min-w-0 content-end gap-2 rounded-[var(--radius-control)] p-1 text-center sm:p-2",
                    day.isToday ? "bg-primary-subtle/20 ring-1 ring-primary/25" : "",
                  ].join(" ")}
                  key={day.date}
                >
                  <div className="mx-auto flex h-20 w-full max-w-8 items-end justify-center">
                    <div
                      className="w-2 rounded-t bg-primary/80"
                      style={{ height: `${height}%` }}
                      title={`Энергия ${day.energy}/10`}
                    />
                  </div>
                  <div>
                    <p
                      className={[
                        "text-[11px] font-medium",
                        day.isToday ? "text-primary" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {day.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{day.energy}</p>
                    <p className="text-[10px] leading-4 text-muted-foreground">
                      {day.sleep}ч · {day.activity}м
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary/80" />
              Энергия
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
