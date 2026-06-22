import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/domain/labels";
import {
  ACHIEVEMENT_CATEGORY_LABELS,
  type EnrichedAchievement,
} from "@/lib/domain/achievements-page";

type AchievementProductCardProps = {
  achievement: EnrichedAchievement;
  variant: "locked" | "unlocked";
};

function normalizeAchievementCopy(value: string) {
  return value
    .replaceAll("Чемпион челленджей", "Мастер привычек")
    .replaceAll("Первый ритуал", "Первая привычка")
    .replaceAll("первый ритуал", "первую привычку")
    .replaceAll("первую привычку", "первую привычку")
    .replaceAll("челленджа", "привычки")
    .replaceAll("челлендж", "привычка")
    .replaceAll("Челлендж", "Привычка")
    .replaceAll("ритуалов", "привычек")
    .replaceAll("ритуал", "привычку")
    .replaceAll("привычки", "привычки")
    .replaceAll("привычку", "привычку");
}

export function AchievementProductCard({ achievement, variant }: AchievementProductCardProps) {
  const isUnlocked = variant === "unlocked";
  const title = normalizeAchievementCopy(achievement.title);
  const description = normalizeAchievementCopy(achievement.description);
  const conditionText = normalizeAchievementCopy(achievement.conditionText);
  const ctaLabel = normalizeAchievementCopy(achievement.ctaLabel);

  return (
    <Card
      className={isUnlocked ? "border-[color:var(--border-primary-subtle)]" : ""}
      variant={isUnlocked ? "highlight" : "default"}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isUnlocked ? "success" : "muted"}>
                {ACHIEVEMENT_CATEGORY_LABELS[achievement.category]}
              </Badge>
              {isUnlocked ? <Badge variant="primary">Открыто</Badge> : null}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
            {isUnlocked ? (
              <p className="mt-2 text-sm font-medium text-primary">
                Веха открыта · Получено +{achievement.xp_reward} опыта
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-4 py-3">
            <p className="text-xs text-muted-foreground">Что нужно сделать</p>
            <p className="mt-1 text-sm text-foreground">{conditionText}</p>
          </div>
        ) : null}

        {achievement.progress && !isUnlocked ? (
          <div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Прогресс</span>
              <span className="font-semibold text-foreground">{achievement.progress.percent}%</span>
            </div>
            <Progress className="mt-2" tone="primary" value={achievement.progress.percent} />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">+{achievement.xp_reward}</span> опыта
            {isUnlocked && achievement.unlocked_at ? (
              <span> · {formatDate(achievement.unlocked_at)}</span>
            ) : null}
          </div>

          {!isUnlocked ? (
            <Link href={achievement.ctaHref}>
              <Button size="sm" variant="secondary">
                {ctaLabel}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
