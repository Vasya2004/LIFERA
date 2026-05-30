import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusPill } from "@/components/ui/status-pill";
import {
  formatDate,
  formatLifeArea,
  GOAL_STATUS_LABELS,
} from "@/lib/domain/labels";
import type { GoalStatus } from "@/lib/domain/types";

type GoalCardProps = {
  createdAt?: string;
  lifeArea: string;
  linkedChallengeHref?: string | null;
  linkedChallengeTitle?: string | null;
  linkedChallengesCount?: number;
  progress: number;
  status: GoalStatus;
  targetDate?: string | null;
  title: string;
};

export function GoalCard({
  createdAt,
  lifeArea,
  linkedChallengeHref,
  linkedChallengeTitle,
  linkedChallengesCount = 0,
  progress,
  status,
  targetDate,
  title,
}: GoalCardProps) {
  const statusVariant =
    status === "completed"
      ? "completed"
      : status === "backlog"
        ? "planned"
        : status === "archived"
          ? "locked"
          : "active";

  return (
    <Card variant="interactive">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Стратегический квест
          </p>
          <p className="mt-2 font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatLifeArea(lifeArea)}</p>
        </div>
        <StatusPill variant={statusVariant}>
          {GOAL_STATUS_LABELS[status] ?? status}
        </StatusPill>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {targetDate ? <span>Дедлайн: {formatDate(targetDate)}</span> : null}
        {createdAt ? <span>Создана: {formatDate(createdAt)}</span> : null}
        {linkedChallengesCount > 0 ? (
          <span>
            Челленджей: {linkedChallengesCount}
            {linkedChallengeTitle ? ` · ${linkedChallengeTitle}` : ""}
          </span>
        ) : (
          <span>Челлендж не привязан</span>
        )}
      </div>

      <Progress className="mt-5" label="Прогресс квеста" tone="success" value={progress} />

      {linkedChallengeHref ? (
        <Link
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-[var(--primary-hover)]"
          href={linkedChallengeHref}
        >
          Открыть миссию <ArrowRight size={14} />
        </Link>
      ) : status === "active" ? (
        <Link
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-[var(--primary-hover)]"
          href="/challenges"
        >
          Создать челлендж <ArrowRight size={14} />
        </Link>
      ) : null}
    </Card>
  );
}
