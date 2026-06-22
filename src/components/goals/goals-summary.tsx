import Link from "next/link";
import type { ReactNode } from "react";
import { Calendar, Check, Crown, Flag, Heart, TrendingUp, Trophy } from "lucide-react";

import { formatDate } from "@/lib/domain/labels";
import type { GoalListItem, GoalsPageSummary } from "@/lib/domain/goals-page";

type GoalsSummaryProps = {
  activeMissionCount: number;
  primaryItem: GoalListItem | null;
  summary: GoalsPageSummary;
};

function missionLabel(count: number): string {
  if (count === 0) return "Нет активных привычек";
  if (count === 1) return "1 активная привычка";
  if (count >= 2 && count <= 4) return `${count} активные привычки`;
  return `${count} активных привычек`;
}

function GoalMetaCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex min-h-[76px] flex-col justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-black/20">
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <span aria-hidden="true" className="shrink-0 opacity-85">
          {icon}
        </span>
        <p className="text-xs font-medium leading-none">{label}</p>
      </div>
      <p className="mt-2 line-clamp-2 break-words text-sm font-semibold leading-5 text-zinc-950 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}

function StatCard({
  helper,
  icon,
  label,
  success = false,
  value,
}: {
  helper?: string;
  icon: ReactNode;
  label: string;
  success?: boolean;
  value: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-zinc-900/70">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 text-primary dark:border-white/10 dark:bg-zinc-950/45">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
          <p
            className={[
              "mt-0.5 truncate text-lg font-semibold",
              success
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-zinc-950 dark:text-zinc-50",
            ].join(" ")}
          >
            {value}
          </p>
          {helper ? (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500 leading-none truncate max-w-[140px]">{helper}</p>
          ) : null}
        </div>
      </div>
      {success ? (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/45 text-primary">
          <Check size={16} />
        </div>
      ) : null}
    </div>
  );
}

export function GoalsSummary({
  activeMissionCount,
  primaryItem,
  summary,
}: GoalsSummaryProps) {
  const primaryGoal = primaryItem?.goal ?? null;
  const primaryProgress = Number(primaryGoal?.progress ?? summary.primaryGoal?.progress ?? 0);
  const hasWish = Boolean(primaryItem?.linkedWish ?? summary.primaryGoal?.wishTitle);
  const linkedWishTitle = primaryItem?.linkedWish?.title ?? summary.primaryGoal?.wishTitle;
  const missionCount =
    primaryItem?.goal.linkedChallenges.filter((challenge) => challenge.status === "active")
      .length ?? activeMissionCount;
  const achievementTotal = Math.max(10, summary.totalCount);
  const achievementValue = Math.min(achievementTotal, summary.completedCount);

  const isFullyConfigured = hasWish && missionCount > 0 && Boolean(primaryGoal?.target_date);

  return (
    <div className="col-span-12 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_340px] items-stretch">
      {/* Primary goal card – dual theme */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-none w-full min-h-[320px] sm:p-6">
        {/* Accent layer: top line + subtle corner glow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/55 via-primary/20 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl dark:bg-primary/8"
        />

        {primaryGoal ? (
          <div className="relative z-10 flex h-full min-h-[272px] flex-col justify-between">
            <div className="space-y-6">
              {/* Row 1: Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                    <Crown aria-hidden="true" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary leading-none">
                      Главная цель
                    </p>
                    <h2 className="mt-2 line-clamp-2 break-words text-2xl font-bold leading-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
                      {primaryGoal.title}
                    </h2>
                  </div>
                </div>

                {/* Status pill — only when fully configured */}
                {isFullyConfigured ? (
                  <span className="mt-1 inline-flex shrink-0 items-center rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 animate-pulse">
                    В работе
                  </span>
                ) : null}
              </div>

              {/* Row 2: Progress */}
              <div>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Прогресс цели</span>
                  <span className="font-semibold text-primary">{primaryProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, primaryProgress))}%` }}
                  />
                </div>
                <span className="sr-only">Прогресс цели: {primaryProgress}%</span>
              </div>

              {/* Row 3: Metadata */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <GoalMetaCard
                  icon={<Calendar size={15} />}
                  label="Срок"
                  value={
                    primaryGoal.target_date ? `До ${formatDate(primaryGoal.target_date)}` : "Не задан"
                  }
                />
                <GoalMetaCard
                  icon={<Flag size={15} />}
                  label="Привычки"
                  value={missionLabel(missionCount)}
                />
                <GoalMetaCard
                  icon={<Heart size={15} />}
                  label="Желание"
                  value={linkedWishTitle ?? "Нет желания"}
                />
                <GoalMetaCard
                  icon={<Trophy size={15} />}
                  label="Достижение"
                  value={`${achievementValue} / ${achievementTotal}`}
                />
              </div>
            </div>

            {/* Row 4: Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <Link
                className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                href={`/goals/${primaryGoal.id}`}
              >
                Открыть цель
              </Link>
              {!hasWish ? (
                <Link
                  className="inline-flex h-10 items-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100 dark:focus-visible:ring-white/20"
                  href="/goals/wishes"
                >
                  Связать желание
                </Link>
              ) : null}
              {missionCount === 0 ? (
                <Link
                  className="inline-flex h-10 items-center rounded-xl border border-zinc-200 px-5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100 dark:focus-visible:ring-white/20"
                  href="/challenges"
                >
                  Добавить привычку
                </Link>
              ) : null}
            </div>
          </div>
        ) : (
          /* Empty state – no primary goal */
          <div className="relative z-10 flex min-h-[160px] flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
                <Crown aria-hidden="true" size={18} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary leading-none">
                Главная цель
              </p>
            </div>
            <h2 className="mt-3 text-xl font-bold text-zinc-950 dark:text-zinc-50">
              Выберите главную цель
            </h2>
            <p className="mt-1.5 max-w-lg text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              Создайте первую цель — Lifera соберёт вокруг неё привычки и фокус.
            </p>
          </div>
        )}
      </div>

      {/* Goal Stats Grid */}
      <div className="grid h-full grid-rows-4 gap-3 w-full">
        <StatCard
          helper={hasWish ? undefined : "Свяжите желание с целью"}
          icon={<Heart size={18} />}
          label="Желание"
          success={hasWish}
          value={
            hasWish ? (
              <span className="line-clamp-1">{linkedWishTitle}</span>
            ) : (
              <span className="text-zinc-500 dark:text-zinc-500">Нет</span>
            )
          }
        />
        <StatCard
          helper={activeMissionCount === 0 ? "Добавьте действие к цели" : undefined}
          icon={<Flag size={18} />}
          label="Привычки"
          value={
            activeMissionCount > 0 ? (
              activeMissionCount
            ) : (
              <span className="text-zinc-500 dark:text-zinc-500">0</span>
            )
          }
        />
        <StatCard
          helper={summary.averageProgress === 0 ? "Прогресс растёт после привычек" : undefined}
          icon={<TrendingUp size={18} />}
          label="Прогресс"
          value={`${summary.averageProgress}%`}
        />
        <StatCard
          helper="Ближайшее достижение"
          icon={<Trophy size={18} />}
          label="Достижение"
          value={`${achievementValue} / ${achievementTotal}`}
        />
      </div>
    </div>
  );
}
