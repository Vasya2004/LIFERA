import { Target } from "lucide-react";

type HealthGoalProps = {
  current: number | null;
  target: number;
};

export function HealthGoal({ current, target }: HealthGoalProps) {
  const hasData = current !== null && current > 0;
  const progress = hasData ? Math.min(100, Math.round(((current ?? 0) / target) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Цель самочувствия
        </h3>
        <Target className="text-zinc-400 dark:text-zinc-600" size={14} />
      </div>
      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        Индекс самочувствия {target}+
      </p>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">
            Текущий:{" "}
            <span className="font-semibold text-zinc-950 dark:text-zinc-50">
              {hasData ? `${current} / 100` : "—"}
            </span>
          </span>
          {hasData ? (
            <span className="font-semibold text-rose-600 dark:text-rose-400">{progress}%</span>
          ) : null}
        </div>

        <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-rose-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!hasData ? (
          <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-600">
            Индекс появится после первой записи check-in.
          </p>
        ) : null}
      </div>
    </div>
  );
}
