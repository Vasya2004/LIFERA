import { AchievementProductCard } from "@/components/achievements/achievement-product-card";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  groupAchievementsByCategory,
  type EnrichedAchievement,
} from "@/lib/domain/achievements-page";

type AchievementsSectionProps = {
  achievements: EnrichedAchievement[];
  emptyDescription: string;
  title: string;
  variant: "locked" | "unlocked";
};

function AchievementsSection({
  achievements,
  emptyDescription,
  title,
  variant,
}: AchievementsSectionProps) {
  if (achievements.length === 0) {
    return (
      <Card className="grid gap-3" variant="muted">
        <SectionHeader description={emptyDescription} title={title} />
      </Card>
    );
  }

  const groups = groupAchievementsByCategory(achievements);

  return (
    <section className="grid gap-5">
      <SectionHeader title={title} />

      <div className="grid gap-6">
        {groups.map((group) => (
          <div className="grid gap-4" key={group.category}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {ACHIEVEMENT_CATEGORY_LABELS[group.category]}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {group.achievements.map((achievement) => (
                <AchievementProductCard
                  achievement={achievement}
                  key={achievement.id}
                  variant={variant}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type AchievementsSectionsProps = {
  locked: EnrichedAchievement[];
  nextAchievementId: string | null;
  unlocked: EnrichedAchievement[];
};

export function AchievementsSections({
  locked,
  nextAchievementId,
  unlocked,
}: AchievementsSectionsProps) {
  const lockedWithoutNext = locked.filter((achievement) => achievement.id !== nextAchievementId);

  return (
    <div className="grid gap-8">
      <AchievementsSection
        achievements={unlocked}
        emptyDescription="Завершите этап или отметьте привычку — первая веха откроется автоматически."
        title="Открытые"
        variant="unlocked"
      />

      <AchievementsSection
        achievements={lockedWithoutNext}
        emptyDescription="Все базовые вехи открыты."
        title="В процессе"
        variant="locked"
      />
    </div>
  );
}
