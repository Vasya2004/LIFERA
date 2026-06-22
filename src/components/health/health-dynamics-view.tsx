"use client";

import { useState } from "react";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";

import { HealthWeekChart } from "@/components/health/health-week-chart";
import { computeWellnessScore } from "@/lib/domain/health";
import type { HealthSnapshot } from "@/lib/domain/health";

type Period = "7d" | "30d" | "all";

type HealthDynamicsViewProps = {
  allHistory: HealthSnapshot[];
  hasEnoughData: boolean;
};

const PERIODS: { label: string; value: Period }[] = [
  { label: "7 дней", value: "7d" },
  { label: "30 дней", value: "30d" },
  { label: "Всё время", value: "all" },
];

function sliceByPeriod(history: HealthSnapshot[], period: Period): HealthSnapshot[] {
  if (period === "all") return history;
  const days = period === "7d" ? 7 : 30;
  return history.slice(0, days);
}

function computeAvgIndex(slice: HealthSnapshot[]): number | null {
  if (slice.length === 0) return null;
  const scores = slice.map(computeWellnessScore);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function bestMetric(slice: HealthSnapshot[]): string {
  if (slice.length === 0) return "—";
  const avgEnergy = slice.reduce((s, e) => s + e.energy_level * 10, 0) / slice.length;
  const avgSleep = slice.reduce((s, e) => s + (e.sleep_hours / 8) * 100, 0) / slice.length;
  const avgRecovery = slice.reduce((s, e) => s + e.recovery_score * 10, 0) / slice.length;
  const best = Math.max(avgEnergy, avgSleep, avgRecovery);
  if (best === avgEnergy) return "Энергия";
  if (best === avgSleep) return "Сон";
  return "Восстановление";
}

function attentionZone(slice: HealthSnapshot[]): string {
  if (slice.length === 0) return "—";
  const avgEnergy = slice.reduce((s, e) => s + e.energy_level * 10, 0) / slice.length;
  const avgSleep = slice.reduce((s, e) => s + (e.sleep_hours / 8) * 100, 0) / slice.length;
  const avgRecovery = slice.reduce((s, e) => s + e.recovery_score * 10, 0) / slice.length;
  const avgStress = slice.reduce((s, e) => s + Math.max(0, 100 - e.recovery_score * 10), 0) / slice.length;
  const worst = Math.min(avgEnergy, avgSleep, avgRecovery, 100 - avgStress);
  if (worst === avgEnergy) return "Энергия";
  if (worst === avgSleep) return "Сон";
  if (worst === 100 - avgStress) return "Стресс";
  return "Восстановление";
}

function trendDirection(slice: HealthSnapshot[]): "up" | "down" | "stable" {
  if (slice.length < 3) return "stable";
  const half = Math.floor(slice.length / 2);
  const recent = slice.slice(0, half).map(computeWellnessScore);
  const older = slice.slice(half).map(computeWellnessScore);
  const avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
  const avgOlder = older.reduce((a, b) => a + b, 0) / older.length;
  if (avgRecent > avgOlder + 3) return "up";
  if (avgRecent < avgOlder - 3) return "down";
  return "stable";
}

export function HealthDynamicsView({ allHistory, hasEnoughData }: HealthDynamicsViewProps) {
  const [period, setPeriod] = useState<Period>("7d");

  if (!hasEnoughData) {
    return (
      <section className="flex min-h-[220px] flex-col items-center gap-4 rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <BarChart3 className="text-zinc-400 dark:text-zinc-500" size={22} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Динамика недели
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Динамика появится после 2–3 check-in.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Продолжайте заполнять состояние несколько дней подряд.
          </p>
        </div>
      </section>
    );
  }

  const slice = sliceByPeriod(allHistory, period);
  const avgIndex = computeAvgIndex(slice);
  const best = bestMetric(slice);
  const attention = attentionZone(slice);
  const trend = trendDirection(slice);

  return (
    <section className="grid gap-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/5 dark:bg-zinc-900/70 xl:gap-6">
      <div>
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
          Динамика недели
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Как менялись энергия, сон, восстановление и стресс.
        </p>
      </div>
      {/* Period switcher */}
      <nav aria-label="Период динамики" className="flex gap-1">
        {PERIODS.map((p) => (
          <button
            aria-current={period === p.value ? "true" : undefined}
            className={[
              "inline-flex h-8 items-center rounded-xl px-3 text-sm font-semibold transition-colors",
              period === p.value
                ? "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-50",
            ].join(" ")}
            key={p.value}
            onClick={() => setPeriod(p.value)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </nav>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Средний индекс
          </p>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
              {avgIndex ?? "—"}
            </span>
            {avgIndex !== null ? (
              <span className="mb-1 text-sm text-zinc-400 dark:text-zinc-500">/ 100</span>
            ) : null}
          </div>
          {trend !== "stable" ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium">
              {trend === "up" ? (
                <>
                  <TrendingUp className="text-green-500" size={13} />
                  <span className="text-green-600 dark:text-green-400">Растёт</span>
                </>
              ) : (
                <>
                  <TrendingDown className="text-rose-500" size={13} />
                  <span className="text-rose-600 dark:text-rose-400">Снижается</span>
                </>
              )}
            </p>
          ) : (
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Стабильно</p>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Лучшая метрика
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">{best}</p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Наиболее стабильный показатель за период
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Зона внимания
          </p>
          <p className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">{attention}</p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Показатель с наибольшей просадкой
          </p>
        </div>
      </div>

      {/* Chart */}
      <HealthWeekChart
        history={slice}
        title={`Период · ${PERIODS.find((p) => p.value === period)?.label}`}
      />

      {/* Records count */}
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        За выбранный период: {slice.length}{" "}
        {slice.length === 1 ? "запись" : slice.length < 5 ? "записи" : "записей"}
      </p>
    </section>
  );
}
