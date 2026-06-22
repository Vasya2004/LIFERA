import Link from "next/link";
import { Check, Flag, Heart, Sparkles } from "lucide-react";

import type { GoalListItem } from "@/lib/domain/goals-page";

type GoalsAttentionPanelProps = {
  goals: GoalListItem[];
};

type AttentionReason = {
  action: string;
  href: string;
  label: string;
};

type AttentionItem = {
  goal: GoalListItem;
  reason: AttentionReason;
};

function buildAttentionItems(goals: GoalListItem[]): AttentionItem[] {
  const items: AttentionItem[] = [];
  const usedReasonLabels = new Set<string>();

  const checks: Array<(item: GoalListItem) => AttentionReason | null> = [
    (item) =>
      !item.linkedWish
        ? { action: "Связать с желанием", href: "/goals/wishes", label: "Нет желания" }
        : null,
    (item) =>
      item.goal.linkedChallenges.filter((c) => c.status === "active").length === 0
        ? { action: "Добавить привычку", href: "/challenges", label: "Нет активных привычек" }
        : null,
    (item) =>
      !item.goal.target_date
        ? {
            action: "Открыть цель",
            href: `/goals/${item.goal.id}`,
            label: "Не задан срок",
          }
        : null,
  ];

  for (const goalItem of goals) {
    if (items.length >= 3) break;

    for (const check of checks) {
      const reason = check(goalItem);

      if (reason && !usedReasonLabels.has(reason.label)) {
        items.push({ goal: goalItem, reason });
        usedReasonLabels.add(reason.label);
        break;
      }
    }
  }

  return items;
}

export function GoalsAttentionPanel({ goals }: GoalsAttentionPanelProps) {
  const items = buildAttentionItems(goals);

  return (
    <aside className="sticky top-[calc(var(--topbar-height)+1.25rem)] min-w-0 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Цели требуют внимания
          </h2>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">Короткие усиления системы.</p>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 text-primary dark:border-white/10 dark:bg-zinc-950/45">
          <Sparkles aria-hidden="true" size={16} />
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-white/10">
        {items.length > 0 ? (
          <div className="grid gap-3">
            {items.map(({ goal, reason }) => (
              <div
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35"
                key={`${goal.goal.id}-${reason.label}`}
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {goal.goal.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {reason.label}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <Link
                    className="inline-flex h-9 w-full items-center justify-start rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:border-white/10 dark:bg-zinc-950/45 dark:text-zinc-100 dark:hover:bg-white/10"
                    href={reason.href}
                  >
                    {reason.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 text-center">
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 text-primary dark:border-white/10 dark:bg-zinc-950/45">
              <Check aria-hidden="true" size={16} />
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Цели выглядят собранно
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Следите за привычками и прогрессом.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4 text-sm dark:border-white/10">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35">
          <Heart aria-hidden="true" className="text-primary" size={15} />
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Желание даёт фокус.</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-950/35">
          <Flag aria-hidden="true" className="text-primary" size={15} />
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Привычки двигают цель.</p>
        </div>
      </div>
    </aside>
  );
}
