import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeroCard } from "@/components/ui/page-hero-card";
import { Progress } from "@/components/ui/progress";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  type EnrichedAchievement,
} from "@/lib/domain/achievements-page";

type NextAchievementBlockProps = {
  hasAchievements: boolean;
  nextAchievement: EnrichedAchievement | null;
};

export function NextAchievementBlock({
  hasAchievements,
  nextAchievement,
}: NextAchievementBlockProps) {
  if (!hasAchievements) {
    return (
      <PageHeroCard
        hint="Достижения появятся после регистрации. Завершите этап или отметьте привычку — первая веха откроется автоматически."
        title="Следующая веха"
        variant="highlight"
      >
        <Link href="/dashboard">
          <Button className="w-full sm:w-auto" size="sm">
            Продолжить фокус
          </Button>
        </Link>
      </PageHeroCard>
    );
  }

  if (!nextAchievement) {
    return (
      <PageHeroCard
        hint="Базовые достижения открыты. Продолжайте привычки — новые вехи появятся по мере роста системы."
        title="Следующая веха"
        variant="highlight"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button size="sm">
              Продолжить фокус
            </Button>
          </Link>
        </div>
      </PageHeroCard>
    );
  }

  const progress = nextAchievement.progress;

  return (
    <PageHeroCard
      hint="Ближайшая награда за движение системы."
      title="Следующая веха"
      variant="highlight"
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">
            {ACHIEVEMENT_CATEGORY_LABELS[nextAchievement.category]}
          </Badge>
          <Badge variant="muted">+{nextAchievement.xp_reward} опыта</Badge>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">{nextAchievement.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {nextAchievement.description}
          </p>
        </div>

        <div className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3">
          <p className="text-xs text-muted-foreground">Условие</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {nextAchievement.conditionText}
          </p>
        </div>

        {progress ? (
          <div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-semibold text-foreground">
                {progress.current} / {progress.target} · {progress.percent}%
              </span>
            </div>
            <Progress className="mt-2" tone="primary" value={progress.percent} />
          </div>
        ) : null}

        <Link href={nextAchievement.ctaHref}>
          <Button className="w-full sm:w-auto" size="sm">
            {nextAchievement.ctaLabel}
          </Button>
        </Link>
      </div>
    </PageHeroCard>
  );
}
