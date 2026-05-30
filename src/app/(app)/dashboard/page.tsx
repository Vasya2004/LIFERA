import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SupabaseReadinessBanner } from "@/components/layout/supabase-readiness-banner";
import { DashboardHabitsBlock } from "@/components/data/dashboard-habits-block";
import { AchievementCard } from "@/components/ui/achievement-card";
import { AIRecommendationCard } from "@/components/ui/ai-recommendation-card";
import { ChallengeCard } from "@/components/ui/challenge-card";
import { GoalCard } from "@/components/ui/goal-card";
import { ProgressCard } from "@/components/ui/progress-card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/domain/dashboard";

export default async function DashboardPage() {
  const { supabase, user } = await getCurrentUser();
  let data = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getDashboardData(supabase, user.id);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить данные dashboard.";
    }
  }

  const profile = data?.profile;
  const activeGoals = data?.activeGoals ?? [];
  const activeChallenges = data?.activeChallenges ?? [];
  const activeHabits = data?.activeHabits ?? [];
  const habitLogsToday = data?.habitLogsToday ?? [];
  const primaryGoal = data?.primaryGoal ?? activeGoals[0] ?? null;
  const primaryChallenge = data?.primaryChallenge ?? activeChallenges[0] ?? null;
  const nextStage = data?.nextStage ?? null;
  const achievements = data?.achievements ?? [];
  const recentAchievements = data?.recentUnlockedAchievements ?? [];
  const recommendation = data?.aiRecommendation ?? {
    content:
      "Завершите onboarding или создайте первую цель и челлендж, чтобы Lifera начала считать XP и рекомендации.",
    title: "Запустите свою Life RPG-систему",
  };

  const displayName =
    profile?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "Пользователь Lifera";
  const lifeScore = Number(profile?.life_score ?? 0);
  const level = Number(profile?.level ?? 1);
  const xpTotal = Number(profile?.xp_total ?? 0);
  const xpProgress = Math.min(100, Math.round((xpTotal % 500) / 5));
  const planLabel = String(profile?.plan ?? "free").toUpperCase();
  const hasStarterSystem = Boolean(primaryGoal && primaryChallenge);
  const unlockedAchievements = achievements.filter((item) => item.status === "unlocked").length;
  const goalLinkedChallenges = primaryGoal
    ? activeChallenges.filter((challenge) => challenge.goal_id === primaryGoal.id)
    : [];
  const goalLinkedChallenge =
    goalLinkedChallenges.find((challenge) => challenge.status === "active") ??
    goalLinkedChallenges[0] ??
    null;
  const completedTodayHabitIds = new Set(habitLogsToday.map((log) => log.habit_id));

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6">
        <SupabaseReadinessBanner />

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        <Card variant="highlight">
          <h1 className="text-3xl font-semibold tracking-tight">
            {displayName}, {hasStarterSystem ? "продолжайте челлендж" : "настройте систему"}
          </h1>
          {primaryChallenge ? (
            <div className="mt-6">
              <Link href={`/challenges/${primaryChallenge.id}`}>
                <Button className="gap-2" size="lg">
                  Продолжить челлендж
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          ) : null}
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard detail="Life Score" label="Состояние" progress={lifeScore} value={`${lifeScore}`} />
          <StatCard
            detail={`${profile?.xpToNextLevel ?? 0} XP до следующего уровня`}
            label="Level"
            progress={xpProgress}
            value={`${level}`}
          />
          <StatCard detail="Всего опыта" label="XP" value={`${xpTotal}`} />
          <StatCard detail="Текущий план" label="План" value={planLabel} />
        </div>

        {!hasStarterSystem ? (
          <EmptyState
            description="Завершите onboarding или создайте первую цель."
            title="Стартовая система не собрана"
          >
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/onboarding">
                <Button>Пройти onboarding</Button>
              </Link>
              <Link href="/goals">
                <Button variant="secondary">Создать цель</Button>
              </Link>
            </div>
          </EmptyState>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="grid gap-4">
              <h2 className="text-xl font-semibold">Активная цель</h2>
              {primaryGoal ? (
                <GoalCard
                  lifeArea={primaryGoal.life_area}
                  linkedChallengeHref={
                    goalLinkedChallenge ? `/challenges/${goalLinkedChallenge.id}` : null
                  }
                  linkedChallengeTitle={goalLinkedChallenge?.title ?? null}
                  linkedChallengesCount={goalLinkedChallenges.length}
                  progress={Number(primaryGoal.progress)}
                  status={primaryGoal.status}
                  title={primaryGoal.title}
                />
              ) : (
                <EmptyState description="Создайте цель для связи с челленджами." title="Нет активных целей">
                  <Link href="/goals">
                    <Button>Создать цель</Button>
                  </Link>
                </EmptyState>
              )}
            </section>

            <section className="grid gap-4">
              <h2 className="text-xl font-semibold">Активный челлендж</h2>
              {primaryChallenge ? (
                <ChallengeCard
                  difficulty={primaryChallenge.difficulty}
                  durationDays={primaryChallenge.duration_days}
                  goalTitle={primaryGoal?.title ?? null}
                  href={`/challenges/${primaryChallenge.id}`}
                  isPremium={primaryChallenge.is_premium}
                  nextStepTitle={nextStage?.title ?? null}
                  progress={Number(primaryChallenge.progress)}
                  status={primaryChallenge.status}
                  title={primaryChallenge.title}
                  xpRewardTotal={primaryChallenge.xp_reward_total}
                />
              ) : (
                <EmptyState description="Создайте челлендж от цели." title="Нет активных челленджей">
                  <Link href="/challenges">
                    <Button>Создать челлендж</Button>
                  </Link>
                </EmptyState>
              )}
            </section>
          </div>
        )}

        {(activeGoals.length > 1 || activeChallenges.length > 1) && (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">
              Целей: {activeGoals.length} · челленджей: {activeChallenges.length}
            </p>
          </Card>
        )}
      </div>

      <aside className="grid content-start gap-6">
        <AIRecommendationCard
          content={recommendation.content}
          title={recommendation.title}
        />
        <Card>
          <h2 className="text-xl font-semibold">Ближайший шаг</h2>
          {nextStage ? (
            <div className="mt-4 grid gap-4">
              <div>
                <p className="font-medium text-foreground">{nextStage.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {nextStage.description ?? "Завершите шаг для XP."}
                </p>
              </div>
              {primaryChallenge ? (
                <Link href={`/challenges/${primaryChallenge.id}`}>
                  <Button className="w-full" variant="secondary">
                    Завершить шаг в миссии
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {primaryChallenge ? "Нет активного шага." : "Создайте челлендж."}
            </p>
          )}
        </Card>
        <DashboardHabitsBlock
          completedTodayIds={completedTodayHabitIds}
          habits={activeHabits}
        />
        <ProgressCard
          description="Средний прогресс целей и челленджей."
          label="Экосистема"
          value={Math.round(
            [...activeGoals, ...activeChallenges].reduce(
              (sum, item) => sum + Number(item.progress),
              0,
            ) / Math.max(1, activeGoals.length + activeChallenges.length),
          )}
        />
        <Card>
          <h2 className="text-xl font-semibold">Последние достижения</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Открыто {unlockedAchievements} из {achievements.length}.
          </p>
          {recentAchievements.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {recentAchievements.map((achievement) => (
                <AchievementCard
                  description={achievement.description}
                  isPremium={achievement.is_premium}
                  key={achievement.id}
                  status="unlocked"
                  title={achievement.title}
                  unlockedAt={achievement.unlocked_at}
                  xpReward={Number(achievement.xp_reward)}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Завершите шаг челленджа.</p>
          )}
          <Link className="mt-4 inline-flex text-sm font-semibold text-primary" href="/achievements">
            Все достижения
          </Link>
        </Card>
      </aside>
    </section>
  );
}
