import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import { Progress } from "@/components/ui/progress";
import type { ChallengeWithMeta } from "@/lib/domain/challenges-page";
import { formatLifeArea } from "@/lib/domain/labels";

type ContinueMissionBlockProps = {
  mission: ChallengeWithMeta | null;
};

export function ContinueMissionBlock({ mission }: ContinueMissionBlockProps) {
  if (!mission) {
    return (
      <PageHeroCard
        hint="Активных привычек пока нет. Создайте привычку вручную или выберите готовый шаблон."
        title="Продолжить привычку"
        variant="highlight"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="#create-challenge">
            <Button className="w-full sm:w-auto" size="sm">
              Создать привычку
            </Button>
          </Link>
          <Link href="#templates">
            <Button className="w-full sm:w-auto" size="sm" variant="secondary">
              Выбрать шаблон
            </Button>
          </Link>
        </div>
      </PageHeroCard>
    );
  }

  const progress = Number(mission.progress);
  const stageLabel =
    mission.totalStagesCount > 0
      ? `${mission.completedStagesCount} из ${mission.totalStagesCount} этапов`
      : null;

  return (
    <PageHeroCard
      hint="Следующий шаг ждёт продолжения."
      title="Продолжить привычку"
      variant="highlight"
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {mission.lifeArea ? (
            <Badge variant="primary">{formatLifeArea(mission.lifeArea)}</Badge>
          ) : null}
          {stageLabel ? <Badge variant="muted">{stageLabel}</Badge> : null}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">{mission.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {mission.goalTitle ? `Цель: ${mission.goalTitle}` : "Цель не привязана"}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Прогресс привычки</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <Progress className="mt-2" tone="primary" value={progress} />
        </div>

        {mission.nextStepTitle ? (
          <div className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted-foreground">Следующий этап</p>
            <p className="mt-1 font-medium text-foreground">{mission.nextStepTitle}</p>
            {mission.nextStepXp ? (
              <p className="mt-1 text-sm text-primary">+{mission.nextStepXp} опыта за этап</p>
            ) : null}
          </div>
        ) : null}

        <Link href={`/challenges/${mission.id}`}>
          <Button size="sm">
            Открыть привычку
          </Button>
        </Link>
      </div>
    </PageHeroCard>
  );
}
