import Link from "next/link";

import { PLAN_UPGRADE_HREF } from "@/lib/api/plan-limit";

type PlanLimitAlertProps = {
  message: string;
};

export function PlanLimitAlert({ message }: PlanLimitAlertProps) {
  return (
    <div className="rounded-[var(--radius-control)] border border-[color:var(--border-primary-subtle)] bg-primary-subtle/40 px-4 py-3 text-sm text-foreground">
      <p className="font-semibold">Лимит Free</p>
      <p className="mt-1 text-muted-foreground">{message}</p>
      <Link className="mt-2 inline-flex font-semibold text-primary hover:underline" href={PLAN_UPGRADE_HREF}>
        Открыть план
      </Link>
    </div>
  );
}
