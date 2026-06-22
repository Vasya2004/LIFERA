import { MetricCell, MetricGrid } from "@/components/ui/metric-cell";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import type { AchievementsPageSummary } from "@/lib/domain/achievements-page";

type AchievementsSummaryProps = {
  summary: AchievementsPageSummary;
};

export function AchievementsSummary({ summary }: AchievementsSummaryProps) {
  let spotlight: string;

  if (summary.nextAchievementTitle) {
    spotlight = `Ближайшая веха: ${summary.nextAchievementTitle}`;
  } else if (summary.totalCount > 0) {
    spotlight = "Базовые вехи открыты — продолжайте прокачку системы.";
  } else {
    spotlight = "Выполните первое действие — вехи появятся автоматически.";
  }

  return (
    <PageHeroCard spotlight={spotlight} title="Карта достижений">
      <MetricGrid>
        <MetricCell label="Открыто" value={summary.unlockedCount} />
        <MetricCell label="Всего" value={summary.totalCount} />
        <MetricCell label="Процент открытых" value={`${summary.unlockedPercent}%`} />
        <MetricCell label="Опыт за достижения" value={summary.xpFromAchievements} />
      </MetricGrid>
    </PageHeroCard>
  );
}
