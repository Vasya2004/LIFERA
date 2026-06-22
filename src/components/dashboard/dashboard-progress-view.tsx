import Link from "next/link";
import { Activity, Award, Flame, ListChecks, Sparkles, Target, Trophy } from "lucide-react";

import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
  DashboardMetricRow,
  DashboardProgressBar,
  dashboardAccents,
  dashboardGhostButtonClass,
} from "@/components/dashboard/dashboard-card";
import type {
  DashboardAchievementSummary,
  DashboardProgressSummary,
} from "@/lib/domain/dashboard";
import type { Goal } from "@/lib/domain/types";

type DashboardProgressViewProps = {
  achievementsSummary: DashboardAchievementSummary;
  primaryGoal: Goal | null;
  progressSummary: DashboardProgressSummary;
  xpToNextLevel: number;
};

function GhostLink({ accent, children, href }: { accent: "missions" | "brand" | "recommendation"; children: string; href: string }) {
  return (
    <Link
      className={[
        "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2",
        dashboardGhostButtonClass(accent),
      ].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}

export function DashboardProgressView({
  achievementsSummary,
  primaryGoal,
  progressSummary,
  xpToNextLevel,
}: DashboardProgressViewProps) {
  const hasData = progressSummary.hasMovement;

  return (
    <div className="col-span-12 grid grid-cols-12 gap-5 xl:gap-6">
      {/* Summary row – always visible, 0-values with hints when no data */}
      <div className="col-span-6 xl:col-span-3">
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<Trophy />} title="XP" />
          <p className={["mt-4 text-3xl font-semibold", dashboardAccents.brand.text].join(" ")}>
            {progressSummary.xp}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {hasData
              ? `До уровня ${progressSummary.level + 1}: ${xpToNextLevel} XP`
              : "XP появится после выполнения привычек"}
          </p>
        </DashboardCard>
      </div>

      <div className="col-span-6 xl:col-span-3">
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<Award />} title="Уровень" />
          <p className="mt-4 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {progressSummary.level}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Текущий уровень Lifera</p>
        </DashboardCard>
      </div>

      <div className="col-span-6 xl:col-span-3">
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<Flame />} title="Серия" />
          <p className="mt-4 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {progressSummary.streak}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {hasData
              ? "дней в активных привычках"
              : "Серия появится после нескольких дней активности"}
          </p>
        </DashboardCard>
      </div>

      <div className="col-span-6 xl:col-span-3">
        <DashboardCard accent="missions">
          <DashboardCardHeader accent="missions" icon={<Activity />} title="Привычки" />
          <p className="mt-4 text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
            {progressSummary.completedMissions}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {hasData
              ? "выполнено в текущем срезе"
              : "Привычки появятся после первых действий"}
          </p>
        </DashboardCard>
      </div>

      {/* Goal progress */}
      <div className="col-span-12 xl:col-span-7">
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<Target />} title="Прогресс главной цели" />
          {primaryGoal ? (
            <div className="mt-5 space-y-4">
              <DashboardMetricRow label="Цель" value={primaryGoal.title} />
              <DashboardMetricRow
                label="Прогресс"
                value={`${progressSummary.goalProgress}%`}
              />
              <DashboardProgressBar accent="brand" value={progressSummary.goalProgress} />
              {!hasData ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Прогресс вырастет после выполнения привычек по этой цели
                </p>
              ) : null}
              <div>
                <Link
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2",
                    dashboardGhostButtonClass("brand"),
                  ].join(" ")}
                  href={`/goals/${primaryGoal.id}`}
                >
                  Открыть цель
                </Link>
              </div>
            </div>
          ) : (
            <DashboardEmptyState
              accent="brand"
              action={
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
                  href="/goals"
                >
                  Создать цель
                </Link>
              }
              description="Создайте главную цель, чтобы Lifera начала отслеживать прогресс."
              icon={<Target />}
              title="Нет главной цели"
            />
          )}
        </DashboardCard>
      </div>

      {/* Achievements */}
      <div className="col-span-12 xl:col-span-5">
        <DashboardCard accent="achievements">
          <DashboardCardHeader accent="achievements" icon={<Award />} title="Достижения" />
          {achievementsSummary.total > 0 ? (
            <div className="mt-5 space-y-4">
              <DashboardMetricRow
                label="Открыто"
                value={progressSummary.unlockedAchievements}
              />
              <DashboardMetricRow label="Всего" value={achievementsSummary.total} />
              <DashboardProgressBar accent="achievements" value={achievementsSummary.progress} />
              <GhostLink accent="missions" href="/achievements">
                Посмотреть достижения
              </GhostLink>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Достижения откроются после выполнения условий.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Выполняйте привычки, чтобы открыть первые достижения.
              </p>
              <div className="pt-2">
                <GhostLink accent="missions" href="/challenges">
                  Перейти к привычкам
                </GhostLink>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* Mission dynamics */}
      <div className="col-span-12 md:col-span-6">
        <DashboardCard accent="missions">
          <DashboardCardHeader
            accent="missions"
            icon={<ListChecks />}
            title="Динамика привычек"
          />
          {hasData ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Сегодня выполнено {progressSummary.completedMissions}{" "}
                {progressSummary.completedMissions === 1 ? "привычка" : "привычек"}. Продолжайте
                закрывать ближайшие задачи.
              </p>
              <GhostLink accent="missions" href="/challenges">
                Перейти к привычкам
              </GhostLink>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Динамика появится после первых выполненных привычек.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Создайте привычку и отметьте её выполненной.
              </p>
              <div className="pt-2">
                <GhostLink accent="missions" href="/challenges">
                  Перейти к привычкам
                </GhostLink>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* What to improve */}
      <div className="col-span-12 md:col-span-6">
        <DashboardCard accent="recommendation">
          <DashboardCardHeader
            accent="recommendation"
            icon={<Sparkles />}
            title="Что улучшить дальше"
          />
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {primaryGoal
                ? "Продолжайте закрывать ближайшие привычки и держите прогресс главной цели в движении."
                : "Создайте главную цель, чтобы прогресс был связан с конкретным результатом."}
            </p>
            {primaryGoal ? (
              <GhostLink accent="recommendation" href={`/goals/${primaryGoal.id}`}>
                Открыть цель
              </GhostLink>
            ) : (
              <GhostLink accent="recommendation" href="/goals">
                Создать цель
              </GhostLink>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
