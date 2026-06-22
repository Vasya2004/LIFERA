import { DashboardAchievements } from "@/components/dashboard/dashboard-achievements";
import { DashboardFocusView } from "@/components/dashboard/dashboard-focus-view";
import { DashboardFinance } from "@/components/dashboard/dashboard-finance";
import { DashboardHealth } from "@/components/dashboard/dashboard-health";
import { DashboardMainGoal } from "@/components/dashboard/dashboard-main-goal";
import { DashboardMainWish } from "@/components/dashboard/dashboard-main-wish";
import { DashboardMissionsToday } from "@/components/dashboard/dashboard-missions-today";
import { DashboardProgressView } from "@/components/dashboard/dashboard-progress-view";
import { DashboardRecommendationV2 } from "@/components/dashboard/dashboard-recommendation-v2";
import { DashboardUserLevel } from "@/components/dashboard/dashboard-user-level";
import { PageContent } from "@/components/layout/page-content";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/domain/dashboard";
import type { DashboardAchievementSummary } from "@/lib/domain/dashboard";

type DashboardView = "overview" | "focus" | "progress";

type DashboardPageProps = {
  searchParams: Promise<{ view?: string }>;
};

export const dynamic = "force-dynamic";

function parseDashboardView(view: string | undefined): DashboardView {
  return view === "focus" || view === "progress" || view === "overview" ? view : "overview";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const currentView = parseDashboardView(params.view);
  const { supabase, user } = await getCurrentUser();
  let data = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getDashboardData(supabase, user.id);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить данные главной.";
    }
  }

  const profile = data?.profile;
  const level = Number(profile?.level ?? 1);
  const xpTotal = Number(profile?.xp_total ?? 0);
  const xpToNextLevel = Number(profile?.xpToNextLevel ?? 500);
  const levelProgress = Number(profile?.levelProgress ?? 0);
  const fallbackAchievementsSummary: DashboardAchievementSummary = {
    nextTitle: null,
    progress: 0,
    total: 0,
    unlocked: 0,
  };
  const achievementsSummary = data?.achievementsSummary ?? fallbackAchievementsSummary;
  const achievementsTotal = achievementsSummary.total;
  const unlockedAchievements = achievementsSummary.unlocked;

  const streak = data?.streak ?? 0;

  const completedTodayIds = new Set(data?.habitLogsToday?.map((log: { habit_id: string }) => log.habit_id) ?? []);
  const liferaRecommendation = data?.liferaRecommendation ?? {
    action: { href: "/goals", label: "Создать цель", reason: "missing_goal" },
    content: "Начните с одной главной цели, чтобы Lifera собрала вокруг нее привычки и фокус.",
    title: "Создайте главную цель",
  };

  return (
    <PageContent
      aria-label={
        currentView === "focus"
          ? "Фокус главной страницы"
          : currentView === "progress"
          ? "Прогресс главной страницы"
          : "Обзор главной страницы"
      }
      className="grid-cols-12 pb-[var(--mobile-page-padding-bottom)] md:pb-8 xl:pb-10"
      role="tabpanel"
    >
      {loadError ? (
        <Card className="col-span-12 border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{loadError}</p>
        </Card>
      ) : null}

      {currentView === "overview" ? (
        <>
          <div className="col-span-12 xl:col-span-6">
            <DashboardMainGoal
              goal={data?.primaryGoal ?? null}
              missionsCount={data?.linkedPrimaryGoalHabits.length ?? 0}
              wish={data?.mainWish ?? null}
            />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <DashboardUserLevel
              level={level}
              levelProgress={levelProgress}
              streak={streak}
              xpToNextLevel={xpToNextLevel}
              xpTotal={xpTotal}
            />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
            <DashboardMainWish
              goal={data?.primaryGoal ?? null}
              wish={data?.mainWish ?? null}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <DashboardMissionsToday
              completedTodayIds={completedTodayIds}
              habits={data?.todayHabits ?? []}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <DashboardFinance summary={data?.financeSummary ?? { state: "empty" }} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <DashboardHealth summary={data?.healthSummary ?? { state: "empty" }} />
          </div>

          <div className="col-span-12 xl:col-span-6">
            <DashboardAchievements
              summary={achievementsSummary}
              total={achievementsTotal}
              unlocked={unlockedAchievements}
            />
          </div>
          <div className="col-span-12 xl:col-span-6">
            <DashboardRecommendationV2
              action={liferaRecommendation.action}
              content={liferaRecommendation.content}
              title={liferaRecommendation.title}
              xpToNextLevel={xpToNextLevel}
            />
          </div>
        </>
      ) : null}

      {currentView === "focus" ? (
        <DashboardFocusView
          mainWish={data?.mainWish ?? null}
          nextMission={data?.nextMission ?? null}
          primaryGoal={data?.primaryGoal ?? null}
          recommendation={liferaRecommendation}
        />
      ) : null}

      {currentView === "progress" ? (
        <DashboardProgressView
          achievementsSummary={achievementsSummary}
          primaryGoal={data?.primaryGoal ?? null}
          progressSummary={
            data?.progressSummary ?? {
              completedMissions: 0,
              goalProgress: 0,
              hasMovement: false,
              level,
              streak,
              unlockedAchievements,
              xp: xpTotal,
            }
          }
          xpToNextLevel={xpToNextLevel}
        />
      ) : null}
    </PageContent>
  );
}
