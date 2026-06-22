import { Gauge, Target, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/domain/labels";
import type { FinanceSnapshot } from "@/lib/domain/finance";

type FinanceHeroProps = {
  financeScore: number;
  history: FinanceSnapshot[];
  latest: FinanceSnapshot | null;
};

export function FinanceHero({ financeScore, history, latest }: FinanceHeroProps) {
  const previous = history[1] ?? null;
  const delta = latest && previous ? latest.savings_amount - previous.savings_amount : null;
  const hasGoal = latest && latest.target_amount > 0;
  const hasData = latest !== null;

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
        <p className="text-xs uppercase text-zinc-600 dark:text-zinc-400">Капитал</p>
        <div className="mt-5 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full border border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
            <Wallet size={20} />
          </span>
          <div>
            <p className="text-3xl font-bold text-zinc-950 dark:text-white">
              {latest ? formatCurrency(latest.savings_amount) : "—"}
            </p>
            {!latest ? (
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Добавьте первый финансовый снимок
              </p>
            ) : null}
            {delta != null && delta !== 0 ? (
              <p
                className={[
                  "mt-1 inline-flex items-center gap-1 text-xs font-semibold",
                  delta > 0 ? "text-emerald-700 dark:text-green-400" : "text-red-600 dark:text-red-400",
                ].join(" ")}
              >
                {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {delta > 0 ? "+" : ""}
                {formatCurrency(delta)} за месяц
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
        <p className="text-xs uppercase text-zinc-600 dark:text-zinc-400">Финансовый индекс</p>
        <div className="mt-5 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Gauge size={20} />
          </span>
          <div>
            <p className="text-3xl font-bold text-zinc-950 dark:text-white">
              {hasData ? financeScore : "—"} <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">/ 100</span>
            </p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {hasData ? "Средний уровень устойчивости" : "Данных пока нет"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
        <p className="text-xs uppercase text-zinc-600 dark:text-zinc-400">Цель месяца</p>
        <div className="mt-5 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full border border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400">
            <Target size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={["truncate text-xl font-bold", hasGoal ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"].join(" ")}>
              {hasGoal ? formatCurrency(latest.target_amount) : "Не задана"}
            </p>
            {hasGoal ? (
              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${latest.savingsProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-green-400">{latest.savingsProgress}%</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
