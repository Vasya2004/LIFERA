import Link from "next/link";

import { DemoPlanButton } from "@/components/billing/demo-plan-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  PLAN_AUDIENCE,
  PLAN_COMING_SOON,
  PLAN_CTAS,
  PLAN_INCLUDED_NOW,
  PLAN_LABELS,
  PLAN_PRICES,
  PLAN_RECOMMENDED,
  PLAN_ROLES,
  PLAN_VALUE_PROMISES,
  type PlanFeatureStatus,
} from "@/lib/domain/plan-catalog";
import type { PlanTier } from "@/lib/domain/types";
import type { PaidPlanTier } from "@/lib/domain/subscription";

type PlanValueCardProps = {
  currentPlan: PlanTier;
  demoEnabled: boolean;
  intendedPlan: PlanTier | null;
  selectedPlan: PlanTier | null;
  tier: PlanTier;
  variant?: "app" | "landing";
};

const STATUS_LABELS: Record<PlanFeatureStatus, string | null> = {
  coming_soon: "Скоро",
  demo_only: "Demo",
  included: null,
};

export function PlanValueCard({
  currentPlan,
  demoEnabled,
  intendedPlan,
  selectedPlan,
  tier,
  variant = "app",
}: PlanValueCardProps) {
  const isCurrent = currentPlan === tier;
  const isRecommended = tier === PLAN_RECOMMENDED && currentPlan === "free";
  const isSelectedIntent = intendedPlan === tier || selectedPlan === tier;
  const isPaid = tier === "pro" || tier === "ultra";
  const isUltra = tier === "ultra";
  const price = PLAN_PRICES[tier];
  const cta = PLAN_CTAS[tier];

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{PLAN_LABELS[tier]}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{PLAN_ROLES[tier]}</p>
        </div>
        {isRecommended ? <Badge variant="primary">Рекомендуем</Badge> : null}
        {isCurrent ? <Badge variant="success">Текущий</Badge> : null}
        {isSelectedIntent && !isCurrent ? (
          <Badge variant="muted">Выбран при регистрации</Badge>
        ) : null}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-3xl font-semibold tracking-tight text-foreground">{price.amount}</span>
        <span className="text-sm text-muted-foreground">/ {price.note}</span>
      </div>

      <p className="text-sm leading-6 text-foreground">{PLAN_VALUE_PROMISES[tier]}</p>
      <p className="text-sm leading-6 text-muted-foreground">{PLAN_AUDIENCE[tier]}</p>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Доступно сейчас
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
          {PLAN_INCLUDED_NOW[tier].map((feature) => (
            <li className="flex items-start justify-between gap-3" key={feature.label}>
              <span>{feature.label}</span>
              {STATUS_LABELS[feature.status] ? (
                <Badge variant="muted">{STATUS_LABELS[feature.status]}</Badge>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {PLAN_COMING_SOON[tier].length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Скоро</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {PLAN_COMING_SOON[tier].map((item) => (
              <li className="flex items-start justify-between gap-3" key={item}>
                <span>{item}</span>
                <Badge variant="muted">Скоро</Badge>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {variant === "landing" ? (
        <Link
          className={
            tier === PLAN_RECOMMENDED
              ? "pricing-btn pricing-btn-featured group mt-2"
              : "pricing-btn pricing-btn-default group mt-2"
          }
          href={cta.href}
        >
          <span>{cta.label}</span>
        </Link>
      ) : (
        <PlanValueCardActions
          currentPlan={currentPlan}
          demoEnabled={demoEnabled}
          isCurrent={isCurrent}
          isPaid={isPaid}
          tier={tier}
        />
      )}
    </>
  );

  if (variant === "landing") {
    return (
      <article
        className={[
          "grid content-start gap-4 rounded-[28px] border p-8 sm:p-9",
          tier === PLAN_RECOMMENDED ? "border-[rgb(255_106_42/0.45)] bg-[rgb(255_90_31/0.06)]" : "",
          isUltra ? "border-[rgb(129_140_248/0.25)]" : "",
        ].join(" ")}
      >
        {content}
      </article>
    );
  }

  return (
    <Card
      className={[
        "grid content-start gap-4",
        isCurrent ? "border-[color:var(--border-primary-strong)]" : "",
        isRecommended ? "border-[color:var(--border-primary-strong)] shadow-[var(--shadow-sm)]" : "",
        isUltra && !isCurrent ? "border-[color:rgb(129_140_248/0.25)]" : "",
      ].join(" ")}
      variant={isCurrent || isRecommended ? "highlight" : "default"}
    >
      {content}
    </Card>
  );
}

function PlanValueCardActions({
  currentPlan,
  demoEnabled,
  isCurrent,
  isPaid,
  tier,
}: {
  currentPlan: PlanTier;
  demoEnabled: boolean;
  isCurrent: boolean;
  isPaid: boolean;
  tier: PlanTier;
}) {
  if (isCurrent) {
    return (
      <p className="text-sm text-muted-foreground">
        Вы используете {PLAN_ROLES[tier].toLowerCase()}.
      </p>
    );
  }

  if (tier === "free" && currentPlan !== "free") {
    return <p className="text-sm text-muted-foreground">Базовый уровень без оплаты.</p>;
  }

  if (isPaid) {
    if (demoEnabled) {
      return <DemoPlanButton plan={tier as PaidPlanTier} />;
    }

    return (
      <div className="grid gap-2">
        <p className="text-sm font-medium text-foreground">Оплата скоро</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Выбор {PLAN_LABELS[tier]} сохраняется как намерение. Реальная оплата будет подключена
          отдельным этапом.
        </p>
      </div>
    );
  }

  return null;
}
