import { PlanFeatureMatrix } from "@/components/billing/plan-feature-matrix";
import { PlanValueCard } from "@/components/billing/plan-value-card";
import type { PlanTier } from "@/lib/domain/types";

type PlanComparisonProps = {
  currentPlan: PlanTier;
  demoEnabled: boolean;
  intendedPlan: PlanTier | null;
  selectedPlan: PlanTier | null;
};

export function PlanComparison({
  currentPlan,
  demoEnabled,
  intendedPlan,
  selectedPlan,
}: PlanComparisonProps) {
  const tiers: PlanTier[] = ["free", "pro", "ultra"];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <PlanValueCard
            currentPlan={currentPlan}
            demoEnabled={demoEnabled}
            intendedPlan={intendedPlan}
            key={tier}
            selectedPlan={selectedPlan}
            tier={tier}
            variant="app"
          />
        ))}
      </div>

      <PlanFeatureMatrix />
    </div>
  );
}
