import { PageTitle } from "@/components/layout/page-title";
import { PlanComparison } from "@/components/billing/plan-comparison";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { PLAN_LABELS } from "@/lib/domain/plan-catalog";
import {
  FREE_AI_WEEKLY_LIMIT,
  FREE_LIMITS,
  FREE_PROGRESS_HISTORY_DAYS,
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

  const subscription =
    supabase && user
      ? (await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle()).data
      : null;

  const currentPlan =
    supabase && user ? await getUserPlan(supabase, user.id) : ("free" as const);
  const intendedPlan =
    supabase && user ? await getUserIntendedPlan(supabase, user.id) : null;
  const demoEnabled = isDemoPremiumEnabled();

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8">
      <PageTitle
        subtitle="Free, Pro и Ultra — одна модель с landing. Оплата подключится позже."
        title="План"
      />

      <Card>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Текущий план</p>
            <p className="mt-1 text-2xl font-semibold">{PLAN_LABELS[currentPlan]}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Статус</p>
            <p className="mt-1 font-medium">
              {subscription?.status ?? "free"} · {subscription?.provider ?? "—"}
            </p>
          </div>
        </div>
        {intendedPlan && intendedPlan !== currentPlan ? (
          <p className="mt-4 text-sm text-muted-foreground">
            При регистрации вы выбрали {PLAN_LABELS[intendedPlan]}. Это намерение — доступ
            активируется только через demo или будущую оплату.
          </p>
        ) : null}
      </Card>

      {currentPlan === "free" ? (
        <Card variant="muted">
          <h2 className="text-lg font-semibold">Лимиты Free</h2>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <li>До {FREE_LIMITS.activeGoals} активных целей</li>
            <li>До {FREE_LIMITS.activeChallenges} активных челленджей</li>
            <li>До {FREE_LIMITS.activeHabits} активных привычек</li>
            <li>{FREE_AI_WEEKLY_LIMIT} AI-рекомендации в неделю</li>
            <li>История прогресса за {FREE_PROGRESS_HISTORY_DAYS} дней</li>
          </ul>
        </Card>
      ) : null}

      <PlanComparison
        currentPlan={currentPlan}
        demoEnabled={demoEnabled}
        intendedPlan={intendedPlan}
        selectedPlan={selectedParam}
      />

      <Card variant="muted">
        <p className="text-sm leading-6 text-muted-foreground">
          Реальная оплата (Stripe, ЮKassa и др.) будет отдельным этапом. Сейчас Pro и Ultra можно
          активировать только через demo в dev-среде или остаться на Free.
        </p>
      </Card>
    </section>
  );
}
