import { Calendar } from "lucide-react";

import { HealthEntryButton } from "@/components/health/health-entry-button";
import { formatDate } from "@/lib/domain/labels";
import type { HealthSnapshot } from "@/lib/domain/health";

type HealthLatestEntryProps = {
  latest: HealthSnapshot | null;
};

export function HealthLatestEntry({ latest }: HealthLatestEntryProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Последняя запись</h3>
        <Calendar className="text-zinc-400 dark:text-zinc-600" size={14} />
      </div>

      {latest ? (
        <div className="mt-3 grid gap-2">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {formatDate(latest.date) ?? latest.date}
          </p>
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="mr-1 text-amber-500">⚡</span>Энергия
              </span>
              <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {latest.energy_level * 10}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="mr-1 text-blue-500">🌙</span>Сон
              </span>
              <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {latest.sleep_hours} ч
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="mr-1 text-green-500">🌿</span>Восстановление
              </span>
              <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {latest.recovery_score * 10}
              </span>
            </div>
            {latest.note ? (
              <p className="mt-1 rounded-lg bg-zinc-50 p-2 text-xs text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                {latest.note}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Записей пока нет.</p>
          <HealthEntryButton label="Добавить первую запись" size="sm" variant="secondary" />
        </div>
      )}
    </div>
  );
}
