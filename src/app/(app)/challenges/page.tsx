import { PageTitle } from "@/components/layout/page-title";
import { ChallengeTemplateGrid } from "@/components/data/challenge-template-grid";
import { CreateChallengeForm } from "@/components/data/create-challenge-form";
import { ChallengeCard } from "@/components/ui/challenge-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getChallengesPageData } from "@/lib/domain/challenges-page";

function ChallengeSection({
  challenges,
  emptyDescription,
  title,
}: {
  challenges: Awaited<ReturnType<typeof getChallengesPageData>>["active"];
  emptyDescription?: string;
  title: string;
}) {
  if (challenges.length === 0) {
    return emptyDescription ? (
      <p className="text-sm text-muted-foreground">{emptyDescription}</p>
    ) : null;
  }

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {challenges.map((challenge) => (
        <ChallengeCard
          difficulty={challenge.difficulty}
          durationDays={challenge.duration_days}
          goalTitle={challenge.goalTitle}
          href={`/challenges/${challenge.id}`}
          isPremium={challenge.is_premium}
          key={challenge.id}
          nextStepTitle={challenge.nextStepTitle}
          progress={Number(challenge.progress)}
          status={challenge.status}
          title={challenge.title}
          xpRewardTotal={challenge.xp_reward_total}
        />
      ))}
    </section>
  );
}

export default async function ChallengesPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getChallengesPageData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getChallengesPageData(supabase, user.id);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить челленджи.";
    }
  }

  const hasAny =
    (data?.active.length ?? 0) +
      (data?.paused.length ?? 0) +
      (data?.completed.length ?? 0) +
      (data?.archived.length ?? 0) >
    0;

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid content-start gap-6">
        <PageTitle subtitle="Миссии и спринты." title="Челленджи" />

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!loadError && !hasAny ? (
          <EmptyState description="Создайте миссию или выберите шаблон." title="Пока нет челленджей" />
        ) : null}

        {data ? (
          <>
            <ChallengeSection challenges={data.active} title="Активные" />
            <ChallengeSection
              challenges={data.paused}
              emptyDescription="Нет миссий на паузе."
              title="На паузе"
            />
            <ChallengeSection
              challenges={data.completed}
              title="Завершённые"
            />
            <ChallengeSection
              challenges={data.archived}
              title="Архив"
            />
            {supabase && user ? (
              <ChallengeTemplateGrid goals={data.goals} templates={data.templates} />
            ) : null}
          </>
        ) : null}
      </div>

      <aside className="grid content-start gap-6">
        <Card>
          <h2 className="text-xl font-semibold">Новый челлендж</h2>
          <div className="mt-4">
            {supabase && user && data ? (
              <CreateChallengeForm goals={data.goals} />
            ) : (
              <p className="text-sm text-muted-foreground">Войдите, чтобы создавать челленджи.</p>
            )}
          </div>
        </Card>
      </aside>
    </section>
  );
}
