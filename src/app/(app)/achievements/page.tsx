import { AchievementsExperience } from "@/components/achievements/achievements-experience";
import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getAchievementsPageData } from "@/lib/domain/achievements-page";

export default async function AchievementsPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getAchievementsPageData>> | null = null;
  let loadError: string | null = null;
  const emptySummary = {
    nextAchievementTitle: null,
    totalCount: 0,
    unlockedCount: 0,
    unlockedPercent: 0,
    xpFromAchievements: 0,
  };

  if (supabase && user) {
    try {
      data = await getAchievementsPageData(supabase, user.id);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Не удалось загрузить достижения.";
    }
  }

  return (
    <PageContent>
      {loadError ? (
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{loadError}</p>
        </Card>
      ) : null}

      {!supabase || !user ? (
        <Card variant="muted">
          <p className="text-sm text-muted-foreground">Войдите, чтобы видеть достижения.</p>
        </Card>
      ) : null}

      <AchievementsExperience
        achievements={data?.all ?? []}
        nextAchievement={data?.nextAchievement ?? null}
        summary={data?.summary ?? emptySummary}
      />
    </PageContent>
  );
}
