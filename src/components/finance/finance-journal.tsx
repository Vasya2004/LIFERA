import { FinanceEntryModal } from "@/components/finance/finance-entry-modal";
import { formatCurrency, formatDate } from "@/lib/domain/labels";
import type { FinanceSnapshot } from "@/lib/domain/finance";
import { Pencil } from "lucide-react";

type FinanceJournalProps = {
  entries: FinanceSnapshot[];
  financeScore: number;
};

export function FinanceJournal({ entries, financeScore }: FinanceJournalProps) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
      <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Финансовые снимки</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        История капитала, доходов, расходов и свободного остатка.
      </p>

      {entries.length === 0 ? (
        <div className="mt-4 flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center dark:border-white/10 dark:bg-zinc-950/40">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Финансовых снимков пока нет
          </p>
          <p className="mt-1 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
            Добавьте первый снимок, чтобы Lifera начала показывать динамику капитала.
          </p>
          <FinanceEntryModal className="mt-4" />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500 dark:text-zinc-500">
              <tr>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Дата</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Капитал</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Индекс</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Доход</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Расходы</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Свободно</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5">Заметка</th>
                <th className="border-b border-zinc-200 py-2 font-medium dark:border-white/5"></th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 5).map((entry, index) => (
                <tr className="text-zinc-700 dark:text-zinc-300" key={entry.date}>
                  <td className="border-b border-zinc-200 py-3 dark:border-white/5">{formatDate(entry.date) ?? entry.date}</td>
                  <td className="border-b border-zinc-200 py-3 font-semibold text-zinc-950 dark:border-white/5 dark:text-white">{formatCurrency(entry.savings_amount)}</td>
                  <td className="border-b border-zinc-200 py-3 dark:border-white/5">
                    {index === 0 ? financeScore : entry.savingsProgress} / 100
                  </td>
                  <td className="border-b border-zinc-200 py-3 dark:border-white/5">{formatCurrency(entry.monthly_income)}</td>
                  <td className="border-b border-zinc-200 py-3 dark:border-white/5">{formatCurrency(entry.monthly_expenses)}</td>
                  <td className="border-b border-zinc-200 py-3 dark:border-white/5">{formatCurrency(entry.monthly_income - entry.monthly_expenses)}</td>
                  <td className="max-w-[260px] truncate border-b border-zinc-200 py-3 text-zinc-500 dark:border-white/5 dark:text-zinc-400">
                    {entry.note || "—"}
                  </td>
                  <td className="border-b border-zinc-200 py-3 text-right dark:border-white/5">
                    <div className="flex justify-end">
                      <FinanceEntryModal
                        initialData={entry}
                        trigger={
                          <button
                            type="button"
                            className="grid h-8 w-8 place-items-center rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-zinc-300"
                            title="Редактировать снимок"
                          >
                            <Pencil size={16} />
                          </button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
