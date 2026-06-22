import { MetricCell, MetricGrid } from "@/components/ui/metric-cell";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import { Progress } from "@/components/ui/progress";

type ProgressHeroProps = {
  level: number;
  levelProgressPercent: number;
  lifeScore: number;
  weeklyXp: number;
  xpToNextLevel: number;
  xpTotal: number;
};

export function ProgressHero({
  level,
  levelProgressPercent,
  lifeScore,
  weeklyXp,
  xpToNextLevel,
  xpTotal,
}: ProgressHeroProps) {
  const weeklyMessage =
    weeklyXp > 0
      ? "На этой неделе система растёт."
      : "На этой неделе пока нет активности. Начните с одного действия.";

  return (
    <PageHeroCard hint={weeklyMessage} title="Общая динамика" variant="highlight">
      <MetricGrid>
        <MetricCell label="Индекс жизни" value={lifeScore} />
        <MetricCell label="Уровень" value={level} />
        <MetricCell label="Опыт всего" value={xpTotal} />
        <MetricCell label="До следующего уровня" value={xpToNextLevel} />
      </MetricGrid>

      <div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Прогресс уровня</span>
          <span className="font-semibold text-foreground">{levelProgressPercent}%</span>
        </div>
        <Progress className="mt-2" tone="primary" value={levelProgressPercent} />
      </div>
    </PageHeroCard>
  );
}
