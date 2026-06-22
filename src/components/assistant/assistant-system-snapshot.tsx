import { MetricCell, MetricGrid } from "@/components/ui/metric-cell";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import type { AssistantSnapshot } from "@/lib/domain/assistant-page";

type AssistantSystemSnapshotProps = {
  snapshot: AssistantSnapshot;
};

export function AssistantSystemSnapshot({ snapshot }: AssistantSystemSnapshotProps) {
  const items = [
    { label: "Активные цели", value: snapshot.activeGoals },
    { label: "Активные привычки", value: snapshot.activeChallenges },
    {
      label: "Привычки сегодня",
      value: `${snapshot.ritualsToday}/${snapshot.ritualsTotal}`,
    },
    { label: "Опыт за неделю", value: snapshot.weeklyXp },
    { label: "Открытые достижения", value: snapshot.unlockedAchievements },
    { label: "Сферы с активностью", value: snapshot.activeLifeAreas },
  ];

  return (
    <PageHeroCard
      hint="Сводка по вашим данным — рекомендации строятся на целях, привычках и регулярности."
      title="Что видит система"
    >
      <MetricGrid>
        {items.map((item) => (
          <MetricCell key={item.label} label={item.label} size="md" value={item.value} />
        ))}
      </MetricGrid>
    </PageHeroCard>
  );
}
