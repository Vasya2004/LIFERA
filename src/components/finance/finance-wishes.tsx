import Link from "next/link";
import Image from "next/image";

import { formatCurrency } from "@/lib/domain/labels";
import type { Wish } from "@/lib/domain/types";
import type { WishGoalOption } from "@/lib/domain/wishes-page";

type FinanceWishesProps = {
  goals: WishGoalOption[];
  wishes: Wish[];
};

function wishProgress(wish: Wish) {
  const target = Number(wish.target_amount ?? 0);
  const current = Number(wish.current_amount ?? 0);
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

function statusLabel(wish: Wish) {
  if (wish.status === "acquired") return "Приобретено";
  if (Number(wish.current_amount ?? 0) > 0) return "В процессе";
  return "Хочу";
}

function goalTitle(goals: WishGoalOption[], goalId: string | null) {
  return goals.find((goal) => goal.id === goalId)?.title ?? "Без цели";
}

export function FinanceWishes({ goals, wishes }: FinanceWishesProps) {
  const financeWishes = wishes
    .filter((wish) => wish.status !== "archived")
    .filter((wish) => Number(wish.target_amount ?? 0) > 0 || wish.category?.toLowerCase().includes("финанс"))
    .slice(0, 3);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none">
      <h2 className="text-base font-semibold text-zinc-950 dark:text-white">Финансовые желания</h2>
      {financeWishes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-5 text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-400">
          Добавьте желания с ценой — они появятся здесь{" "}
          <Link className="font-semibold text-orange-600 hover:text-orange-500 dark:text-orange-400" href="/goals/wishes">
            Открыть карту желаний
          </Link>
        </p>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {financeWishes.map((wish) => {
            const progress = wishProgress(wish);

            return (
              <article
                className="relative flex min-h-[200px] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-white/5 dark:bg-zinc-950"
                key={wish.id}
              >
                {wish.image_url ? (
                  <Image alt="" className="object-cover" fill sizes="33vw" src={wish.image_url} />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,90,31,0.18),transparent_35%),linear-gradient(135deg,#f4f4f5,#e4e4e7)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,90,31,0.22),transparent_35%),linear-gradient(135deg,#18181b,#09090b)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                <div className="relative mt-auto grid w-full gap-2 p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">{wish.title}</h3>
                      <p className="mt-1 text-sm font-medium text-orange-400">
                        {formatCurrency(wish.target_amount)}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-400">
                      {statusLabel(wish)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-800">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-green-400">{progress}%</span>
                  </div>
                  <p className="truncate text-xs text-zinc-300">Цель: {goalTitle(goals, wish.linked_goal_id)}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
