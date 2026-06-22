import { Card } from "@/components/ui/card";

type PlanPaymentNoticeProps = {
  demoEnabled: boolean;
};

export function PlanPaymentNotice({ demoEnabled }: PlanPaymentNoticeProps) {
  return (
    <Card variant="muted">
      <p className="text-sm font-semibold text-foreground">Оплата скоро</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Сейчас выбор плана сохраняется как намерение. Реальная оплата (Stripe, ЮKassa и др.) будет
        подключена отдельным этапом. Pro и Ultra не активируются автоматически и без fake payment.
      </p>
      {demoEnabled ? (
        <p className="mt-3 text-sm text-muted-foreground">
          В dev-среде доступна demo-активация через `DEMO_PREMIUM_ENABLED=true` — только для тестов.
        </p>
      ) : null}
    </Card>
  );
}
