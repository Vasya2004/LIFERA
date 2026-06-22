import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DashboardCard,
  DashboardEmptyState,
  DashboardMetricRow,
  DashboardProgressBar,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import type { DashboardAccentKey } from "@/components/dashboard/dashboard-card";
import type { DashboardHealthSummary } from "@/lib/domain/dashboard";

function getHealthStatus(index: number) {
  if (index >= 80) return "Отлично";
  if (index >= 50) return "Стабильно";
  return "Внимание";
}

function HealthMetricRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: DashboardAccentKey;
}) {
  return (
    <div className="grid grid-cols-[115px_minmax(0,1fr)_32px] items-center gap-3 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <DashboardProgressBar accent={accent} value={value} />
      <span className="text-right font-medium text-zinc-950 dark:text-zinc-50">{value}</span>
    </div>
  );
}

export function DashboardHealth({ summary }: { summary: DashboardHealthSummary }) {
  return (
    <DashboardCard accent="health" className="min-h-[200px]">
      {summary.state === "empty" ? (
        <DashboardEmptyState
          accent="health"
          action={
            <Link href="/health">
              <Button className={dashboardGhostButtonClass("health")} size="sm" variant="secondary">Добавить запись</Button>
            </Link>
          }
          description="Добавьте первую запись, чтобы видеть индекс."
          icon={<Heart />}
          title="Нет данных о здоровье"
        />
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 [&>svg]:h-5 [&>svg]:w-5">
                <Heart />
              </span>
              <div>
                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Здоровье</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Индекс состояния</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {summary.index}
                <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 ml-1">/ 100</span>
              </div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                {getHealthStatus(summary.index)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-4">
            <HealthMetricRow accent="brand" label="Энергия" value={Math.round(summary.energy * 10)} />
            <HealthMetricRow accent="missions" label="Сон" value={Math.min(100, Math.round((summary.sleepHours / 8) * 100))} />
            <HealthMetricRow accent="finance" label="Восстановление" value={Math.round(summary.recovery * 10)} />
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-white/5">
            <DashboardMetricRow label="Активность" value={`${summary.activityMinutes} мин`} />
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
