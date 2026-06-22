import { Activity, Leaf, Moon, Zap } from "lucide-react";

import type { HealthSnapshot } from "@/lib/domain/health";

type HealthHeroProps = {
  latest: HealthSnapshot | null;
  wellnessScore: number | null;
};

function arcColor(score: number) {
  if (score > 70) return "#22c55e";
  if (score >= 40) return "#f97316";
  return "#f43f5e";
}

function metricBar(value: number | null, color: string) {
  return (
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/80">
      <div
        className={["h-full rounded-full transition-all duration-500", color].join(" ")}
        style={{ width: value !== null ? `${value}%` : "0%" }}
      />
    </div>
  );
}

export function HealthHero({ latest, wellnessScore }: HealthHeroProps) {
  const hasData = latest !== null && wellnessScore !== null;

  const energy = hasData ? Math.round(latest!.energy_level * 10) : null;
  const sleep = hasData ? Math.round((latest!.sleep_hours / 8) * 100) : null;
  const recovery = hasData ? Math.round(latest!.recovery_score * 10) : null;
  const stress = hasData ? Math.max(0, Math.round(100 - latest!.recovery_score * 10)) : null;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const score = wellnessScore ?? 0;
  const offset = hasData ? circumference - (score / 100) * circumference : circumference;
  const color = hasData ? arcColor(score) : "#52525b";

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-white/5 dark:bg-zinc-900/70">
      <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
        Состояние самочутствия
      </h2>

      {hasData ? (
        <div className="mt-5 flex flex-col gap-6 xl:flex-row xl:items-center">
          <div className="flex w-full shrink-0 flex-col items-center justify-center xl:w-[200px]">
            <div className="relative">
              <svg className="h-[110px] w-[110px] -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="7"
                  className="text-zinc-100 dark:text-zinc-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r={radius}
                  stroke={color}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  strokeWidth="7"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{score}</span>
                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">/ 100</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Индекс самочувствия</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Текущий баланс дня</p>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-5 px-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <Zap className="text-amber-500" size={14} />
                  Энергия
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{energy ?? "—"}</span>
              </div>
              {metricBar(energy, "bg-amber-500")}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <Moon className="text-blue-500" size={14} />
                  Сон
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{sleep ?? "—"}</span>
              </div>
              {metricBar(sleep, "bg-blue-500")}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <Leaf className="text-green-500" size={14} />
                  Восстановление
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{recovery ?? "—"}</span>
              </div>
              {metricBar(recovery, "bg-green-500")}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <Activity className="text-rose-500" size={14} />
                  Стресс
                </span>
                <span className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{stress ?? "—"}</span>
              </div>
              {metricBar(stress !== null ? 100 - stress : null, "bg-rose-500")}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <svg className="h-[110px] w-[110px] -rotate-90 opacity-30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r={radius} stroke="#52525b" strokeWidth="7" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">—</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-600">/ 100</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Данных пока нет</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Воспользуйтесь кнопкой «Добавить check-in» сверху.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
