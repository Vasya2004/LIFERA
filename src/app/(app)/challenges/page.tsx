import Link from "next/link";

import { ChallengeCreatePanel } from "@/components/challenges/challenge-create-panel";
import { ChallengesList } from "@/components/challenges/challenges-list";
import { ChallengesSummary } from "@/components/challenges/challenges-summary";
import { ChallengeTemplatesSection } from "@/components/challenges/challenge-templates-section";
import { ContinueMissionBlock } from "@/components/challenges/continue-mission-block";
import { PageContent } from "@/components/layout/page-content";
import { PageTitle } from "@/components/layout/page-title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getChallengesPageData } from "@/lib/domain/challenges-page";

export default async function ChallengesPage() {
  const { supabase, user } = await getCurrentUser();
  let data: Awaited<ReturnType<typeof getChallengesPageData>> | null = null;
  let loadError: string | null = null;

  if (supabase && user) {
    try {
      data = await getChallengesPageData(supabase, user.id);
    } catch (error) {
      loadError =
        error instanceof Error ? error.message : "Не удалось загрузить привычки.";
    }
  }

  return (
    <PageContent className="lg:grid-cols-[minmax(0,1fr)_var(--right-rail-width)]">
      <div className="order-1 grid min-w-0 content-start gap-5 lg:col-start-1 xl:gap-6">
        <PageTitle
          action={
            <div className="flex flex-wrap gap-2">
              <Link href="/progress">
                <Button size="sm" variant="secondary">
                  Смотреть прогресс
                </Button>
              </Link>
              <Link href="#create-challenge">
                <Button size="sm">Создать привычку</Button>
              </Link>
            </div>
          }
          subtitle="Привычки с этапами, прогрессом и опытом."
          title="Привычки"
        />

        {loadError ? (
          <Card className="border-danger/25 bg-danger-subtle">
            <p className="text-sm text-danger-foreground">{loadError}</p>
          </Card>
        ) : null}

        {!supabase || !user ? (
          <Card variant="muted">
            <p className="text-sm text-muted-foreground">Войдите, чтобы управлять привычками.</p>
          </Card>
        ) : null}

        {data ? (
          <>
            <ChallengesSummary summary={data.summary} />
            <ContinueMissionBlock mission={data.continueMission} />
            <ChallengeTemplatesSection goals={data.goals} templates={data.templates} />
            <ChallengesList
              active={data.active}
              archived={data.archived}
              completed={data.completed}
              goals={data.goals}
              paused={data.paused}
            />
          </>
        ) : null}
      </div>

      <aside className="order-2 grid min-w-0 content-start lg:order-none lg:col-start-2 lg:row-start-1">
        {supabase && user && data ? <ChallengeCreatePanel goals={data.goals} /> : null}
      </aside>
    </PageContent>
  );
}
