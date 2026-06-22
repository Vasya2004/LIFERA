import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FREE_LIMITS_COPY,
  PLAN_LABELS,
  PLAN_ROLES,
  PLAN_VALUE_PROMISES,
  recommendedUpgradePlan,
} from "@/lib/domain/plan-catalog";
import type { PlanTier } from "@/lib/domain/types";

type CurrentPlanHeroProps = {
  currentPlan: PlanTier;
};

export function CurrentPlanHero({ currentPlan }: CurrentPlanHeroProps) {
  const upgrade = recommendedUpgradePlan(currentPlan);

  return (
    <Card variant="highlight">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-primary">Ваш текущий план</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {PLAN_LABELS[currentPlan]}
            </h2>
            <Badge variant="success">{PLAN_ROLES[currentPlan]}</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {PLAN_VALUE_PROMISES[currentPlan]}
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-surface-muted p-4">
          {currentPlan === "free" ? (
            <>
              <p className="text-sm font-semibold text-foreground">Сейчас доступно</p>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <li>{FREE_LIMITS_COPY.goals}</li>
                <li>{FREE_LIMITS_COPY.missions}</li>
                <li>{FREE_LIMITS_COPY.rituals}</li>
                <li>{FREE_LIMITS_COPY.recommendations}</li>
                <li>{FREE_LIMITS_COPY.history}</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">Сейчас доступно</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Полная Life OS без лимитов на ядро, расширенная аналитика и Pro-шаблоны привычек.
              </p>
            </>
          )}

          {upgrade ? (
            <p className="mt-4 text-sm leading-6 text-foreground">
              Следующий уровень:{" "}
              <span className="font-semibold">
                {PLAN_LABELS[upgrade]} · {PLAN_ROLES[upgrade]}
              </span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Вы на максимальном уровне Lifera.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
