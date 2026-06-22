import { Card } from "@/components/ui/card";
import { PLAN_LABELS, PLAN_ROLES } from "@/lib/domain/plan-catalog";
import type { PlanTier } from "@/lib/domain/types";

type SelectedPlanNoticeProps = {
  currentPlan: PlanTier;
  intendedPlan: PlanTier | null;
  selectedPlan: PlanTier | null;
};

export function SelectedPlanNotice({
  currentPlan,
  intendedPlan,
  selectedPlan,
}: SelectedPlanNoticeProps) {
  const highlighted = selectedPlan ?? intendedPlan;

  if (!highlighted || highlighted === currentPlan) {
    return null;
  }

  return (
    <Card variant="muted">
      <p className="text-sm font-semibold text-foreground">
        Вы выбрали {PLAN_LABELS[highlighted]} · {PLAN_ROLES[highlighted]}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Сейчас доступен {PLAN_LABELS[currentPlan]}. Мы сохранили ваш выбор, но доступ не активирован
        без оплаты. Оплата будет подключена отдельным этапом — без скрытых списаний.
      </p>
    </Card>
  );
}
