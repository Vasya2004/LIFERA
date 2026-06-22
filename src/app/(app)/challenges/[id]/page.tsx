import Link from "next/link";
import { notFound } from "next/navigation";

import { ChallengeActions } from "@/components/data/challenge-actions";
import { ChallengeEditForm } from "@/components/data/challenge-edit-form";
import { ChallengeStagesList } from "@/components/data/challenge-stages-list";
import { PageContent } from "@/components/layout/page-content";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MobileCollapsibleSection } from "@/components/ui/mobile-collapsible-section";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/auth/session";
import { getChallengeDetailData } from "@/lib/domain/challenges-page";
import {
  CHALLENGE_STATUS_LABELS,
  DIFFICULTY_LABELS,
  formatLifeArea,
} from "@/lib/domain/labels";

type ChallengeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChallengeDetailPage({ params }: ChallengeDetailPageProps) {
  const { id } = await params;
  const { supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    notFound();
  }

  const { challenge, goals, linkedGoal, stages } = await getChallengeDetailData(
    supabase,
    user.id,
    id,
  );

  if (!challenge) {
    notFound();
  }

  const activeStep = stages.find((stage) => stage.status === "active");

  return (
    <PageContent className="lg:grid-cols-[minmax(0,1fr)_var(--right-rail-width)]">
      <div className="order-1 grid min-w-0 content-start gap-5 xl:gap-6">
        <div className="min-w-0">
          <Link className="text-sm font-semibold text-primary" href="/challenges">
            Все привычки
          </Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Привычка / спринт
          </p>
          <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
            {challenge.title}
          </h1>
          <p className="mt-3 max-w-2xl break-words leading-7 text-muted-foreground">
            {challenge.description ??
              "Привычка превращает цель в последовательность измеримых шагов с начислением опыта."}
          </p>
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap gap-2">
              <Badge variant={challenge.status === "completed" ? "success" : "primary"}>
                {CHALLENGE_STATUS_LABELS[challenge.status] ?? challenge.status}
              </Badge>
              <Badge variant={challenge.is_premium ? "gold" : "muted"}>
                {challenge.is_premium ? "Pro" : "Free"}
              </Badge>
              <Badge variant="muted">
                {DIFFICULTY_LABELS[challenge.difficulty] ?? challenge.difficulty}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {challenge.duration_days} дн. · {challenge.xp_reward_total} опыта
            </span>
          </div>
          <Progress className="mt-5" label="Прогресс привычки" tone="primary" value={challenge.progress} />
          {linkedGoal ? (
            <p className="mt-4 break-words text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Связанная цель:</span>{" "}
              <Link className="text-primary hover:underline" href={`/goals/${linkedGoal.id}`}>
                {linkedGoal.title}
              </Link>
              {" · "}
              {formatLifeArea(linkedGoal.life_area)} · прогресс {linkedGoal.progress}%
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Цель не привязана.</p>
          )}
          {activeStep ? (
            <p className="mt-2 break-words text-sm font-medium text-foreground">
              Текущий этап: {activeStep.title}
            </p>
          ) : null}
        </Card>

        <ChallengeStagesList challengeId={challenge.id} stages={stages} />
      </div>

      <aside className="order-2 grid min-w-0 content-start gap-4">
        <Card>
          <h2 className="text-lg font-semibold">Правила опыта</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Опыт начисляется только сервером при завершении активного этапа. Повторное
            завершение не создаёт новую транзакцию.
          </p>
        </Card>
        <Link
          className="inline-flex h-[var(--button-height-md)] w-full items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted"
          href="/progress"
        >
          История опыта
        </Link>
        <MobileCollapsibleSection defaultOpen={false} title="Редактирование">
          <ChallengeEditForm challenge={challenge} goals={goals} />
        </MobileCollapsibleSection>
        <MobileCollapsibleSection defaultOpen={false} title="Управление">
          <ChallengeActions challengeId={challenge.id} status={challenge.status} />
        </MobileCollapsibleSection>
      </aside>
    </PageContent>
  );
}
