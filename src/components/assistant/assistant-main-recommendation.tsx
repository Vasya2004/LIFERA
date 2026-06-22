import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AssistantMainRecommendation } from "@/lib/domain/assistant-page";

type AssistantMainRecommendationProps = {
  recommendation: AssistantMainRecommendation;
};

export function AssistantMainRecommendationBlock({
  recommendation,
}: AssistantMainRecommendationProps) {
  return (
    <Card className="assistant-surface grid gap-5 border">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Главный следующий шаг</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Рекомендация на основе целей, привычек, опыта и достижений.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground sm:text-xl">
            {recommendation.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-foreground">{recommendation.recommendation}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted-foreground">Почему</p>
            <p className="mt-1 text-sm text-foreground">{recommendation.reason}</p>
          </div>
          <div className="rounded-[var(--radius-control)] border border-border bg-surface px-4 py-3">
            <p className="text-xs text-muted-foreground">Ожидаемый эффект</p>
            <p className="mt-1 text-sm text-foreground">{recommendation.effect}</p>
          </div>
        </div>

        <Link href={recommendation.ctaHref}>
          <Button size="sm">
            {recommendation.ctaLabel}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
