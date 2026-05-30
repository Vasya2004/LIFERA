import { PageTitle } from "@/components/layout/page-title";
import { CreateGoalForm } from "@/components/data/create-goal-form";
import { GoalActions } from "@/components/data/goal-actions";
import { GoalEditForm } from "@/components/data/goal-edit-form";
import { GoalCard } from "@/components/ui/goal-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getGoalsWithChallenges } from "@/lib/domain/goals";
import type { GoalStatus } from "@/lib/domain/types";

const sections: Array<{ id: GoalStatus; title: string }> = [
  { id: "active", title: "Активные" },
  { id: "backlog", title: "Бэклог" },
  { id: "completed", title: "Завершённые" },
  { id: "archived", title: "Архив" },
];

export default async function GoalsPage() {
  const { supabase, user } = await getCurrentUser();
  let goals: Awaited<ReturnType<typeof getGoalsWithChallenges>>["goals"] = [];
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      const data = await getGoalsWithChallenges(supabase, user.id);
      goals = data.goals;
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить цели.";
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid content-start gap-6">
        <PageTitle subtitle="Главные направления развития." title="Цели" />

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!loadError && goals.length === 0 ? (
          <EmptyState description="Создайте цель или завершите onboarding." title="Пока нет целей" />
        ) : null}

        {sections.map((section) => {
          const sectionGoals = goals.filter((goal) => goal.status === section.id);
          if (sectionGoals.length === 0) {
            return null;
          }

          return (
            <section className="grid gap-4" key={section.id}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {sectionGoals.map((goal) => {
                const primaryChallenge = goal.linkedChallenges.find(
                  (item) => item.status === "active",
                ) ?? goal.linkedChallenges[0];

                return (
                  <div key={goal.id}>
                    <GoalCard
                      createdAt={goal.created_at}
                      lifeArea={goal.life_area}
                      linkedChallengeHref={
                        primaryChallenge ? `/challenges/${primaryChallenge.id}` : null
                      }
                      linkedChallengeTitle={primaryChallenge?.title ?? null}
                      linkedChallengesCount={goal.linkedChallenges.length}
                      progress={Number(goal.progress)}
                      status={goal.status}
                      targetDate={goal.target_date}
                      title={goal.title}
                    />
                    {supabase && user ? (
                      <>
                        <GoalEditForm goal={goal} />
                        <GoalActions goalId={goal.id} status={goal.status} />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <aside className="grid content-start gap-6">
        <Card>
          <h2 className="text-xl font-semibold">Новая цель</h2>
          <p className="mt-1 text-sm text-muted-foreground">Free: до 3 активных.</p>
          <div className="mt-4">
            {supabase && user ? (
              <CreateGoalForm />
            ) : (
              <p className="text-sm text-muted-foreground">Войдите, чтобы создавать цели.</p>
            )}
          </div>
        </Card>
      </aside>
    </section>
  );
}
