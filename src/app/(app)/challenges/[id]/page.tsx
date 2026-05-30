import Link from "next/link";
import { notFound } from "next/navigation";

import { ChallengeActions } from "@/components/data/challenge-actions";
import { ChallengeEditForm } from "@/components/data/challenge-edit-form";
import { ChallengeStagesList } from "@/components/data/challenge-stages-list";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid content-start gap-6">
        <div>
          <Link className="text-sm font-semibold text-primary" href="/challenges">
            Все миссии
          </Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Миссия / спринт
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{challenge.title}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            {challenge.description ??
              "Челлендж превращает цель в последовательность измеримых шагов с XP."}
          </p>
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={challenge.status === "completed" ? "success" : "primary"}>
                {CHALLENGE_STATUS_LABELS[challenge.status] ?? challenge.status}
              </Badge>
              <Badge variant={challenge.is_premium ? "gold" : "muted"}>
                {challenge.is_premium ? "Premium" : "Free"}
              </Badge>
              <Badge variant="muted">
                {DIFFICULTY_LABELS[challenge.difficulty] ?? challenge.difficulty}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {challenge.duration_days} дн. · {challenge.xp_reward_total} XP
            </span>
          </div>
          <Progress className="mt-5" label="Прогресс миссии" tone="primary" value={challenge.progress} />
          {linkedGoal ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Связанный квест:</span>{" "}
              <Link className="text-primary hover:underline" href="/goals">
                {linkedGoal.title}
              </Link>
              {" · "}
              {formatLifeArea(linkedGoal.life_area)} · прогресс {linkedGoal.progress}%
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Цель не привязана.</p>
          )}
          {activeStep ? (
            <p className="mt-2 text-sm font-medium text-foreground">
              Текущий шаг: {activeStep.title}
            </p>
          ) : null}
        </Card>

        <ChallengeStagesList challengeId={challenge.id} stages={stages} />
      </div>

      <aside className="grid content-start gap-4">
        <Card>
          <h2 className="text-xl font-semibold">Правила XP</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            XP начисляется только сервером при завершении активного шага. Повторное
            нажатие на завершённый шаг не создаёт новую транзакцию.
          </p>
        </Card>
        <Link
          className="inline-flex h-[var(--button-height-md)] w-full items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted"
          href="/progress"
        >
          История XP
        </Link>
        <Card>
          <h2 className="text-xl font-semibold">Редактирование</h2>
          <div className="mt-4">
            <ChallengeEditForm challenge={challenge} goals={goals} />
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Управление</h2>
          <ChallengeActions challengeId={challenge.id} status={challenge.status} />
        </Card>
      </aside>
    </section>
  );
}
