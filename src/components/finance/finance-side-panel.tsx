import { Lightbulb } from "lucide-react";

import { FinanceEntryModal } from "@/components/finance/finance-entry-modal";
import { FinanceExpenses } from "@/components/finance/finance-expenses";
import { FinanceSubscriptionsCard } from "@/components/finance/finance-subscriptions-card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/domain/labels";
import type { FinanceSnapshot, FinanceSubscription } from "@/lib/domain/finance";
import type { Wish } from "@/lib/domain/types";

type FinanceSidePanelProps = {
  latest: FinanceSnapshot | null;
  linkedWish: Wish | null;
  savingsDelta: number | null;
  subscriptions: FinanceSubscription[];
};

function freeAmountClass(value: number | null) {
  if (value == null) return "text-zinc-500 dark:text-zinc-400";
  if (value > 0) return "text-emerald-700 dark:text-green-400";
  if (value < 0) return "text-red-600 dark:text-red-400";
  return "text-zinc-500 dark:text-zinc-400";
}

function recommendation(latest: FinanceSnapshot | null, savingsDelta: number | null) {
  if (!latest) {
    return "Добавьте первый снимок, чтобы Lifera начала анализировать ваши финансы";
  }

  if (latest.monthly_expenses > latest.monthly_income) {
    return "Расходы превышают доходы — проверьте категории";
  }

  if ((savingsDelta ?? 0) > 0) {
    return "Капитал растёт — продолжайте в том же темпе";
  }

  return "Обновляйте снимки регулярно, чтобы видеть движение капитала";
}

export function FinanceSidePanel({ latest, linkedWish, savingsDelta, subscriptions }: FinanceSidePanelProps) {
  const free = latest ? latest.monthly_income - latest.monthly_expenses : null;
  
  const activeSubscriptionsTotal = subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((sum, sub) => sum + Number(sub.amount), 0);

  return (
    <div className="grid gap-5 xl:sticky xl:top-[calc(var(--topbar-height)+1rem)]">
      <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Месячный план</h2>
        <div className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-500 dark:text-zinc-400">Доход</span>
            <span className="font-semibold text-zinc-950 dark:text-zinc-50">
              {latest ? formatCurrency(latest.monthly_income) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-500 dark:text-zinc-400">Расходы</span>
            <span className="font-semibold text-zinc-950 dark:text-zinc-50">
              {latest ? formatCurrency(latest.monthly_expenses) : "—"}
            </span>
          </div>
          <div className="border-t border-zinc-100 pt-3 dark:border-white/8">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-zinc-950 dark:text-zinc-50">Свободно</span>
              <span className={["text-sm font-bold", freeAmountClass(free)].join(" ")}>
                {free == null ? "—" : formatCurrency(free)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <FinanceEntryModal className="w-full" />
        </div>
        {activeSubscriptionsTotal > 0 && (
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-zinc-100 pt-3 text-sm dark:border-white/8">
            <span className="text-zinc-500 dark:text-zinc-400">Подписки</span>
            <span className="font-semibold text-zinc-950 dark:text-zinc-50">
              {formatCurrency(activeSubscriptionsTotal)}
            </span>
          </div>
        )}
      </aside>

      <FinanceExpenses compact latest={latest} />

      <FinanceSubscriptionsCard subscriptions={subscriptions} />

      <aside className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-orange-50 dark:bg-orange-500/10">
            <Lightbulb className="text-orange-500 dark:text-orange-400" size={14} />
          </span>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">Рекомендация Lifera</h2>
        </div>
        <p className="mt-3 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
          {recommendation(latest, savingsDelta)}
        </p>
        {linkedWish ? (
          <Button className="mt-4 w-full" size="sm">Открыть желание</Button>
        ) : null}
      </aside>
    </div>
  );
}
