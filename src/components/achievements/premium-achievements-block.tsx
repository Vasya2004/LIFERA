import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EnrichedAchievement } from "@/lib/domain/achievements-page";

type PremiumAchievementsBlockProps = {
  achievements: EnrichedAchievement[];
};

export function PremiumAchievementsBlock({ achievements }: PremiumAchievementsBlockProps) {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <Card className="grid gap-5" variant="muted">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Расширенные достижения</h2>
          <Badge variant="primary">Pro / Ultra</Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Дополнительные вехи для расширенного прогресса. Расширенные достижения появятся вместе с
          развитием Pro/Ultra-плана — без автоматического открытия на Free.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => (
          <div
            className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-4"
            key={achievement.id}
          >
            <p className="font-medium text-foreground">{achievement.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{achievement.description}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              +{achievement.xp_reward} опыта · Скоро на Pro/Ultra
            </p>
          </div>
        ))}
      </div>

      <Link href="/plan">
        <Button size="sm" variant="secondary">
          Открыть план
        </Button>
      </Link>
    </Card>
  );
}
