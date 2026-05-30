import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/domain/labels";

type AchievementCardProps = {
  conditionHint?: string;
  description: string;
  isPremium?: boolean;
  status: "locked" | "unlocked";
  title: string;
  unlockedAt?: string | null;
  xpReward: number;
};

export function AchievementCard({
  conditionHint,
  description,
  isPremium = false,
  status,
  title,
  unlockedAt,
  xpReward,
}: AchievementCardProps) {
  return (
    <Card className={status === "locked" ? "opacity-85" : ""} variant={status === "unlocked" ? "highlight" : "default"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Milestone
          </p>
          <p className="mt-2 font-semibold text-foreground">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <Badge variant={status === "unlocked" ? "success" : "muted"}>
          {status === "unlocked" ? "Получено" : "Закрыто"}
        </Badge>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground">
        <span>{xpReward} XP</span>
        {isPremium ? <Badge variant="gold">Premium</Badge> : null}
        {unlockedAt ? <span>{formatDate(unlockedAt)}</span> : null}
        {conditionHint && status === "locked" ? (
          <span className="text-xs">Условие: {conditionHint}</span>
        ) : null}
      </div>
    </Card>
  );
}
