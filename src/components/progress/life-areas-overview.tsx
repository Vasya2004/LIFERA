import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { formatLifeArea } from "@/lib/domain/labels";
import { LIFE_AREA_STATUS_LABELS, type ProgressLifeArea } from "@/lib/domain/progress";

type LifeAreasOverviewProps = {
  areas: ProgressLifeArea[];
};

const statusVariants = {
  declining: "warning",
  rising: "success",
  stable: "muted",
} as const;

export function LifeAreasOverview({ areas }: LifeAreasOverviewProps) {
  const visibleAreas = areas.filter(
    (area) =>
      area.goalsCount > 0 ||
      area.challengesCount > 0 ||
      area.habitsCount > 0 ||
      area.weeklyActivity > 0 ||
      area.progressPercent > 0,
  );

  const items = visibleAreas.length > 0 ? visibleAreas : areas.slice(0, 5);

  return (
    <Card className="grid gap-5">
      <SectionHeader
        description="Какие направления растут, а какие требуют внимания."
        title="Сферы жизни"
      />

      {items.length === 0 ? (
        <p className="rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-5 text-sm text-muted-foreground">
          Сферы появятся, когда вы добавите цели, привычки или ритуалы.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((area) => (
            <div
              className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-4 py-4"
              key={area.area}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{formatLifeArea(area.area)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {area.goalsCount} целей · {area.challengesCount} привычек · {area.habitsCount}{" "}
                    ритуалов
                  </p>
                </div>
                <Badge variant={statusVariants[area.status]}>
                  {LIFE_AREA_STATUS_LABELS[area.status]}
                </Badge>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Прогресс</span>
                  <span className="font-semibold text-foreground">{area.progressPercent}%</span>
                </div>
                <Progress className="mt-2" tone="primary" value={area.progressPercent} />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                За неделю: {area.weeklyActivity} действий · {area.weeklyXp} опыта
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
