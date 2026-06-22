import { BookOpen, Car, Gamepad2, Repeat, Utensils } from "lucide-react";

import { formatCurrency } from "@/lib/domain/labels";
import type { FinanceSnapshot } from "@/lib/domain/finance";

type FinanceExpensesProps = {
  compact?: boolean;
  latest: FinanceSnapshot | null;
};

const categories = [
  { icon: Utensils, label: "Еда", value: 0 },
  { icon: Repeat, label: "Подписки", value: 0 },
  { icon: BookOpen, label: "Обучение", value: 0 },
  { icon: Gamepad2, label: "Развлечения", value: 0 },
  { icon: Car, label: "Транспорт", value: 0 },
];

export function FinanceExpenses({ compact = false, latest }: FinanceExpensesProps) {
  const total = latest?.monthly_expenses ?? 0;

  return (
    <section
      className={[
        "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none",
        compact ? "xl:rounded-2xl xl:border-white/10 xl:bg-zinc-900" : "",
      ].join(" ")}
    >
      <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Расходы</h2>
      {total <= 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-400">
          Данные о расходах появятся после снимка.
        </p>
      ) : null}
      <div className="mt-4 grid gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const percent = total > 0 ? Math.round((category.value / total) * 100) : 0;

          return (
            <div
              className={[
                "grid grid-cols-[120px_minmax(0,1fr)_42px] items-center gap-3",
                compact ? "" : "sm:grid-cols-[140px_minmax(0,1fr)_48px_90px]",
              ].join(" ")}
              key={category.label}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon className="shrink-0 text-zinc-500 dark:text-zinc-500" size={16} />
                <span className="truncate text-sm text-zinc-950 dark:text-white">{category.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${percent}%` }} />
              </div>
              <span className="text-right text-sm font-medium text-orange-600 dark:text-orange-400">{percent}%</span>
              {!compact ? (
                <span className="hidden text-right text-sm text-zinc-600 dark:text-zinc-400 sm:block">
                  {formatCurrency(category.value)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-sm dark:border-white/10">
        <span className="text-zinc-600 dark:text-zinc-400">Всего расходов</span>
        <span className="font-semibold text-zinc-950 dark:text-white">{latest ? formatCurrency(total) : "—"}</span>
      </div>
    </section>
  );
}
