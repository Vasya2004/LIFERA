import Link from "next/link";

import { PageContent } from "@/components/layout/page-content";
import { PageTitle } from "@/components/layout/page-title";
import { LifeAreasOverview } from "@/components/progress/life-areas-overview";
import { ProgressHero } from "@/components/progress/progress-hero";
import { ProgressRecommendationBlock } from "@/components/progress/progress-recommendation";
import { RecentProgressFeed } from "@/components/progress/recent-progress-feed";
import { WeeklyActivityChart } from "@/components/progress/weekly-activity-chart";
import { XpSourcesBreakdown } from "@/components/progress/xp-sources-breakdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getProgressData } from "@/lib/domain/progress";

export default async function ProgressPage() {
  const { supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return (
      <PageContent>
        <Card variant="muted">
          <PageTitle
            subtitle="Войдите в аккаунт, чтобы увидеть динамику развития."
            title="Прогресс"
          />
        </Card>
      </PageContent>
    );
  }

  let data: Awaited<ReturnType<typeof getProgressData>> | null = null;
  let loadError: string | null = null;

  try {
    data = await getProgressData(supabase, user.id);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Не удалось загрузить прогресс.";
  }

  if (!data) {
    return (
      <PageContent>
        <Card className="border-danger/25 bg-danger-subtle">
          <PageTitle subtitle={loadError ?? undefined} title="Прогресс" />
        </Card>
      </PageContent>
    );
  }

  const hasWeeklyActivity =
    data.weekly.xp > 0 ||
    data.weekly.habitCompletions > 0 ||
    data.weekly.challengeStagesCompleted > 0;

  return (
    <PageContent>
      <PageTitle
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/achievements">
              <Button size="sm" variant="secondary">
                Достижения
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Продолжить фокус</Button>
            </Link>
          </div>
        }
        subtitle="Динамика развития, опыт и сферы жизни."
        title="Прогресс"
      />

      {data.loadError ? (
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{data.loadError}</p>
        </Card>
      ) : null}

      {data.subscription.historyLimited ? (
        <details className="rounded-[var(--radius-card)] border border-border bg-surface px-5 py-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Подробности · история на Free-плане
          </summary>
          <p className="mt-3 text-sm text-muted-foreground">
            На Free-плане показана история за {data.subscription.historyDays} дней. Полная история
            доступна на Pro и Ultra.{" "}
            <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/plan">
              Открыть план
            </Link>
          </p>
        </details>
      ) : null}

      <ProgressHero
        level={data.profile.level}
        levelProgressPercent={data.profile.levelProgressPercent}
        lifeScore={data.profile.life_score}
        weeklyXp={data.xp.weekly}
        xpToNextLevel={data.xp.toNextLevel}
        xpTotal={data.xp.total}
      />

      <WeeklyActivityChart daily={data.weekly.daily} hasWeeklyActivity={hasWeeklyActivity} />

      <LifeAreasOverview areas={data.lifeAreas} />

      <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
        <XpSourcesBreakdown bySource={data.xp.bySource} />
        <RecentProgressFeed events={data.recentEvents} />
      </div>

      <ProgressRecommendationBlock recommendation={data.recommendation} />
    </PageContent>
  );
}
