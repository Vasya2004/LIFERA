import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeader } from "@/components/ui/section-header";
import { XP_SOURCE_LABELS, type ProgressData } from "@/lib/domain/progress";

type XpSourcesBreakdownProps = {
  bySource: ProgressData["xp"]["bySource"];
};

const sourceOrder = ["challenge_stage", "habit_log", "achievement"] as const;

export function XpSourcesBreakdown({ bySource }: XpSourcesBreakdownProps) {
  const entries = sourceOrder.map((key) => ({
    key,
    label: XP_SOURCE_LABELS[key],
    value: bySource[key],
  }));

  const maxValue = Math.max(1, ...entries.map((entry) => entry.value));
  const total = entries.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="grid gap-5">
      <SectionHeader
        description="Распределение опыта по источникам за доступный период."
        title="Откуда пришёл опыт"
      />

      {total === 0 ? (
        <p className="rounded-[var(--radius-control)] border border-dashed border-border bg-surface-muted px-4 py-5 text-sm text-muted-foreground">
          Завершите этап привычки или отметьте ритуал, чтобы увидеть источники опыта.
        </p>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <div className="grid gap-2" key={entry.key}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{entry.label}</span>
                <span className="font-semibold text-primary">{entry.value}</span>
              </div>
              <Progress tone="primary" value={Math.round((entry.value / maxValue) * 100)} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
