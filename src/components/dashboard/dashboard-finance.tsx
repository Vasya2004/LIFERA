import Link from "next/link";
import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
  DashboardMetricRow,
  DashboardProgressBar,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import type { DashboardFinanceSummary } from "@/lib/domain/dashboard";

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    currency: "RUB",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function DashboardFinance({ summary }: { summary: DashboardFinanceSummary }) {
  return (
    <DashboardCard accent="finance" className="min-h-[250px]">
      <DashboardCardHeader accent="finance" icon={<Wallet />} title="Финансы" />

      {summary.state === "empty" ? (
        <DashboardEmptyState
          accent="finance"
          action={
            <Link href="/finance">
              <Button className={dashboardGhostButtonClass("finance")} size="sm" variant="secondary">Добавить запись</Button>
            </Link>
          }
          description="Добавьте первую запись или цель, чтобы видеть финансовый индекс."
          icon={<Wallet />}
          title="Финансовые данные не добавлены"
        />
      ) : (
        <>
          <div className="mt-5">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Общий капитал</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{formatMoney(summary.capital)}</p>
          </div>

          <div className="mt-5 grid gap-3 border-t border-zinc-200 pt-4 dark:border-white/10">
            <DashboardMetricRow label="Индекс финансов" value={`${summary.index} / 100`} />
            <DashboardMetricRow label="Цель месяца" value={summary.monthlyGoal ? formatMoney(summary.monthlyGoal) : "Не задана"} />
            <div className="grid gap-2">
              <DashboardProgressBar accent="finance" value={summary.progress} />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{summary.progress}% к цели</p>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Link href="/finance"><Button className={dashboardGhostButtonClass("finance")} size="sm" variant="secondary">Открыть финансы</Button></Link>
          </div>
        </>
      )}
    </DashboardCard>
  );
}
