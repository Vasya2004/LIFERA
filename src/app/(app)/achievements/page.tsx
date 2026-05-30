import { PageTitle } from "@/components/layout/page-title";
import { AchievementCard } from "@/components/ui/achievement-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AchievementsPage() {
  const { supabase, user } = await getCurrentUser();
  let achievements: Array<{
    condition_type: string;
    condition_value: number;
    description: string;
    id: string;
    is_premium: boolean;
    status: string;
    title: string;
    unlocked_at: string | null;
    xp_reward: number;
  }> = [];
  let loadError: string | null = null;

  if (supabase && user) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      loadError = error.message;
    } else {
      achievements = data ?? [];
    }
  }

  const unlocked = achievements.filter((item) => item.status === "unlocked");
  const locked = achievements.filter((item) => item.status === "locked" && !item.is_premium);
  const premiumLocked = achievements.filter(
    (item) => item.status === "locked" && item.is_premium,
  );

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8">
      <PageTitle subtitle="Milestones прогресса." title="Достижения" />

      {loadError ? (
        <Card className="border-danger/25 bg-danger-subtle">
          <p className="text-sm text-danger-foreground">{loadError}</p>
        </Card>
      ) : null}

      {!loadError && achievements.length === 0 ? (
        <EmptyState description="Завершите первый шаг челленджа." title="Пока нет достижений" />
      ) : null}

      {unlocked.length > 0 ? (
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Полученные ({unlocked.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {unlocked.map((achievement) => (
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
        </section>
      ) : null}

      {locked.length > 0 ? (
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">В процессе ({locked.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locked.map((achievement) => (
              <AchievementCard
                conditionHint={`${achievement.condition_type}: ${achievement.condition_value}`}
                description={achievement.description}
                key={achievement.id}
                status="locked"
                title={achievement.title}
                xpReward={Number(achievement.xp_reward)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {premiumLocked.length > 0 ? (
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Premium ({premiumLocked.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {premiumLocked.map((achievement) => (
              <AchievementCard
                description={achievement.description}
                isPremium
                key={achievement.id}
                status="locked"
                title={achievement.title}
                xpReward={Number(achievement.xp_reward)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
