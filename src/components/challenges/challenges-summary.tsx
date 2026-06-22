import { MetricCell, MetricGrid } from "@/components/ui/metric-cell";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import type { ChallengesPageSummary } from "@/lib/domain/challenges-page";

type ChallengesSummaryProps = {
  summary: ChallengesPageSummary;
};

export function ChallengesSummary({ summary }: ChallengesSummaryProps) {
  const spotlight = summary.spotlightChallenge ? (
    <>
      Текущий фокус:{" "}
      <span className="font-medium text-foreground">{summary.spotlightChallenge.title}</span> ·{" "}
      {summary.spotlightChallenge.progress}%
    </>
  ) : (
    "Запустите привычку или выберите шаблон для быстрого старта."
  );

  return (
    <PageHeroCard spotlight={spotlight} title="Центр привычек">
      <MetricGrid>
        <MetricCell label="Активные" value={summary.activeCount} />
        <MetricCell label="Завершённые" value={summary.completedCount} />
        <MetricCell label="Этапов выполнено" value={summary.stagesCompleted} />
        <MetricCell label="Средний прогресс" value={`${summary.averageProgress}%`} />
      </MetricGrid>
    </PageHeroCard>
  );
}
