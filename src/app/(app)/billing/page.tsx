import { CurrentPlanHero } from "@/components/billing/current-plan-hero";
import { PlanComparison } from "@/components/billing/plan-comparison";
import { PlanPaymentNotice } from "@/components/billing/plan-payment-notice";
import { SelectedPlanNotice } from "@/components/billing/selected-plan-notice";
import { PageContent } from "@/components/layout/page-content";
import { PageTitle } from "@/components/layout/page-title";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getUserIntendedPlan,
  getUserPlan,
  isDemoPremiumEnabled,
} from "@/lib/domain/subscription";

type BillingPageProps = {
  searchParams: Promise<{ selected?: string }>;
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const params = await searchParams;
  const selectedParam = params.selected === "pro" || params.selected === "ultra" ? params.selected : null;
  const { supabase, user } = await getCurrentUser();

  const [currentPlan, intendedPlan] =
    supabase && user
      ? await Promise.all([
          getUserPlan(supabase, user.id),
          getUserIntendedPlan(supabase, user.id),
        ])
      : [("free" as const), null];
  const demoEnabled = isDemoPremiumEnabled();

  return (
    <PageContent>
      <PageTitle
        subtitle="Выберите уровень Lifera: стартовая система, полная Life OS или AI-стратег."
        title="План"
      />

      <CurrentPlanHero currentPlan={currentPlan} />

      <SelectedPlanNotice
        currentPlan={currentPlan}
        intendedPlan={intendedPlan}
        selectedPlan={selectedParam}
      />

      <PlanComparison
        currentPlan={currentPlan}
        demoEnabled={demoEnabled}
        intendedPlan={intendedPlan}
        selectedPlan={selectedParam}
      />

      <PlanPaymentNotice demoEnabled={demoEnabled} />
    </PageContent>
  );
}
