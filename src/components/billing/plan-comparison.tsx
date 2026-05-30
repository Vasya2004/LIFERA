import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DemoPlanButton } from "@/components/billing/demo-plan-button";
import {
  PLAN_FEATURES,
  PLAN_LABELS,
  type PlanFeatureStatus,
} from "@/lib/domain/plan-catalog";
import type { PlanTier } from "@/lib/domain/types";

type PlanComparisonProps = {
  currentPlan: PlanTier;
  demoEnabled: boolean;
  intendedPlan: PlanTier | null;
  selectedPlan: PlanTier | null;
};

const STATUS_LABELS: Record<PlanFeatureStatus, string | null> = {
  coming_soon: "Скоро",
  demo_only: "Demo",
  included: null,
};

export function PlanComparison({
  currentPlan,
  demoEnabled,
  intendedPlan,
  selectedPlan,
}: PlanComparisonProps) {
  const tiers: PlanTier[] = ["free", "pro", "ultra"];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier) => {
        const isCurrent = currentPlan === tier;
        const isSelectedIntent = intendedPlan === tier || selectedPlan === tier;
        const isPaid = tier === "pro" || tier === "ultra";

        return (
          <Card
            className={[
              "grid content-start gap-4",
              isCurrent ? "border-[color:var(--border-primary-strong)]" : "",
            ].join(" ")}
            key={tier}
            variant={isCurrent ? "highlight" : "default"}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{PLAN_LABELS[tier]}</h2>
              {isCurrent ? <Badge variant="success">Текущий</Badge> : null}
              {isSelectedIntent && !isCurrent ? (
                <Badge variant="primary">Выбран при регистрации</Badge>
              ) : null}
            </div>

            <ul className="grid gap-2 text-sm text-muted-foreground">
              {PLAN_FEATURES[tier].map((feature) => (
                <li className="flex items-start justify-between gap-3" key={feature.label}>
                  <span>{feature.label}</span>
                  {STATUS_LABELS[feature.status] ? (
                    <Badge variant="muted">{STATUS_LABELS[feature.status]}</Badge>
                  ) : null}
                </li>
              ))}
            </ul>

            {tier === "free" ? (
              <p className="text-sm text-muted-foreground">
                {isCurrent ? "Вы на Free-плане." : "Базовый план без оплаты."}
              </p>
            ) : null}

            {isPaid ? (
              demoEnabled ? (
                isCurrent && currentPlan === tier ? (
                  <p className="text-sm text-muted-foreground">Demo-план уже активен.</p>
                ) : (
                  <DemoPlanButton plan={tier} />
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Оплата скоро. Demo {PLAN_LABELS[tier]} доступен только при DEMO_PREMIUM_ENABLED=true.
                </p>
              )
            ) : null}

            {isPaid && !demoEnabled ? (
              <p className="text-xs text-muted-foreground">
                Выбор {PLAN_LABELS[tier]} при регистрации — это намерение, не оплаченный доступ.
              </p>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
