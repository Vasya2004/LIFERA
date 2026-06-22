import type { ReactNode } from "react";

type HealthMetricCardProps = {
  empty: boolean;
  icon: ReactNode;
  iconBg: string;
  label: string;
  progressColor: string;
  stressInverted?: boolean;
  value: number | null;
};



export function HealthMetricCard({
  empty,
  icon,
  iconBg,
  label,
  progressColor,
  stressInverted = false,
  value,
}: HealthMetricCardProps) {
  const progress = value !== null ? Math.min(100, stressInverted ? 100 - value : value) : 0;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3.5 dark:border-white/5 dark:bg-zinc-900/70">
      <div className="flex items-center gap-2">
        <div className={["grid size-7 shrink-0 place-items-center rounded-lg", iconBg].join(" ")}>
          {icon}
        </div>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>

      {empty ? (
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-zinc-400 dark:text-zinc-600">—</span>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{value}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">/ 100</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={["h-full rounded-full transition-all duration-500", progressColor].join(" ")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
