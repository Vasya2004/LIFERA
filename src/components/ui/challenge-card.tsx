import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/ui/status-pill";
import {
  CHALLENGE_STATUS_LABELS,
  DIFFICULTY_LABELS,
  formatLifeArea,
} from "@/lib/domain/labels";

type ChallengeCardProps = {
  difficulty: string;
  durationDays?: number;
  goalTitle?: string | null;
  href?: string;
  isPremium?: boolean;
  lifeArea?: string | null;
  nextStepTitle?: string | null;
  progress: number;
  status: string;
  title: string;
  xpRewardTotal?: number;
};

export function ChallengeCard({
  difficulty,
  durationDays,
  goalTitle,
  href,
  isPremium = false,
  lifeArea,
  nextStepTitle,
  progress,
  status,
  title,
  xpRewardTotal,
}: ChallengeCardProps) {
  const statusVariant = status === "completed" ? "completed" : status === "paused" ? "paused" : "active";

  const content = (
    <Card variant="interactive">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Миссия / спринт
          </p>
          <p className="mt-2 font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {goalTitle ? `Цель: ${goalTitle}` : "Цель не привязана"}
            {lifeArea ? ` · ${formatLifeArea(lifeArea)}` : ""}
          </p>
        </div>
        <StatusPill variant={statusVariant}>
          {CHALLENGE_STATUS_LABELS[status] ?? status}
        </StatusPill>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{DIFFICULTY_LABELS[difficulty] ?? difficulty}</span>
        {durationDays ? <span>{durationDays} дн.</span> : null}
        {xpRewardTotal ? <span>{xpRewardTotal} XP</span> : null}
        {isPremium ? <span>Premium</span> : null}
      </div>

      {nextStepTitle ? (
        <p className="mt-3 text-sm text-foreground">
          <span className="font-medium">Следующий шаг:</span> {nextStepTitle}
        </p>
      ) : null}

      <Progress className="mt-5" label="Прогресс миссии" tone="primary" value={progress} />

      {href && status === "active" ? (
        <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Продолжить <ArrowRight size={14} />
        </p>
      ) : null}
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link className="block focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]" href={href}>
      {content}
    </Link>
  );
}
