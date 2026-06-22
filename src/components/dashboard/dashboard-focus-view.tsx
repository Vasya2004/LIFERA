import Link from "next/link";
import { ArrowUpRight, Check, Gem, ListChecks, Target } from "lucide-react";

import {
  DashboardCard,
  DashboardCardHeader,
  DashboardEmptyState,
  DashboardProgressBar,
  dashboardAccents,
  dashboardGhostButtonClass,
  type DashboardAccentKey,
} from "@/components/dashboard/dashboard-card";
import type { DashboardLiferaRecommendation } from "@/lib/domain/dashboard";
import type { Goal, Habit, Wish } from "@/lib/domain/types";

type DashboardFocusViewProps = {
  mainWish: Wish | null;
  nextMission: Habit | null;
  primaryGoal: Goal | null;
  recommendation: DashboardLiferaRecommendation;
};

function ActionLink({
  accent = "brand",
  children,
  href,
  variant = "secondary",
}: {
  accent?: DashboardAccentKey;
  children: string;
  href: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      className={[
        "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 sm:w-auto",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          : dashboardGhostButtonClass(accent),
      ].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}

function StatusChecklist({
  mainWish,
  nextMission,
}: {
  mainWish: Wish | null;
  nextMission: Habit | null;
}) {
  const items = [
    { done: true, label: "Цель создана" },
    { done: !!mainWish, label: mainWish ? "Желание связано" : "Желание не связано" },
    { done: !!nextMission, label: nextMission ? "Привычка активна" : "Привычка не создана" },
  ];

  return (
    <div className="grid gap-2.5">
      {items.map((item) => (
        <div className="flex items-center gap-2.5 text-sm" key={item.label}>
          <span
            className={[
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
              item.done
                ? "border-primary bg-primary text-primary-foreground"
                : "border-zinc-300 bg-transparent dark:border-white/20",
            ].join(" ")}
          >
            {item.done ? <Check aria-hidden="true" size={11} strokeWidth={3} /> : null}
          </span>
          <span
            className={
              item.done
                ? "font-medium text-zinc-950 dark:text-zinc-50"
                : "text-zinc-500 dark:text-zinc-500"
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

type NextStep = {
  description: string;
  hint: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  title: string;
};

function deriveNextStep(
  primaryGoal: Goal,
  mainWish: Wish | null,
  nextMission: Habit | null,
): NextStep {
  if (!mainWish) {
    return {
      description:
        "У цели пока нет мотиватора. Желание помогает удерживать фокус в сложные дни.",
      hint: "Зачем: желание напоминает, ради чего вы движетесь к цели.",
      primaryHref: "/goals/wishes",
      primaryLabel: "Добавить желание",
      secondaryHref: `/goals/${primaryGoal.id}`,
      secondaryLabel: "Открыть цель",
      title: "Добавьте желание к цели",
    };
  }

  if (!nextMission) {
    return {
      description:
        "Цель и желание есть. Теперь нужно конкретное регулярное действие для движения вперёд.",
      hint: "Зачем: привычка превращает цель в ежедневный ритуал.",
      primaryHref: "/challenges",
      primaryLabel: "Создать привычку",
      secondaryHref: `/goals/${primaryGoal.id}`,
      secondaryLabel: "Открыть цель",
      title: "Создайте первую привычку",
    };
  }

  return {
    description:
      nextMission.description ?? "Выполните ближайшую активную привычку, чтобы сдвинуть цель.",
    hint: "Зачем: ежедневные действия складываются в результат.",
    primaryHref: "/challenges",
    primaryLabel: "Открыть привычку",
    secondaryHref: `/goals/${primaryGoal.id}`,
    secondaryLabel: "Открыть цель",
    title: nextMission.title,
  };
}

export function DashboardFocusView({
  mainWish,
  nextMission,
  primaryGoal,
  recommendation,
}: DashboardFocusViewProps) {
  if (!primaryGoal) {
    return (
      <div className="col-span-12">
        <DashboardCard accent="brand" className="min-h-[320px]">
          <DashboardEmptyState
            accent="brand"
            action={
              <ActionLink href="/goals" variant="primary">
                Создать цель
              </ActionLink>
            }
            description="Сначала выберите главный результат. После этого Lifera соберёт вокруг него желание, привычки и следующий шаг."
            icon={<Target />}
            title="Создайте первую цель"
          />
        </DashboardCard>
      </div>
    );
  }

  const nextStep = deriveNextStep(primaryGoal, mainWish, nextMission);
  const goalProgress = Number(primaryGoal.progress ?? 0);

  return (
    <div className="col-span-12 grid grid-cols-12 gap-5 xl:gap-6">
      {/* Main focus block */}
      <div className="col-span-12 xl:col-span-7">
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<Target />} title="Фокус сейчас" />

          <div className="mt-5 flex flex-col gap-5">
            {/* Status checklist */}
            <div>
              <p
                className={[
                  "mb-3 text-xs font-semibold uppercase tracking-[0.14em]",
                  dashboardAccents.brand.text,
                ].join(" ")}
              >
                Состояние
              </p>
              <StatusChecklist
                mainWish={mainWish}
                nextMission={nextMission}
              />
            </div>

            {/* Next step */}
            <div className="border-t border-zinc-200 pt-4 dark:border-white/5">
              <p
                className={[
                  "mb-3 text-xs font-semibold uppercase tracking-[0.14em]",
                  dashboardAccents.brand.text,
                ].join(" ")}
              >
                Следующий шаг
              </p>
              <h2 className="break-words text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-2xl">
                {nextStep.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {nextStep.description}
              </p>
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-500">{nextStep.hint}</p>
            </div>

            {/* Actions */}
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <ActionLink href={nextStep.primaryHref} variant="primary">
                {nextStep.primaryLabel}
              </ActionLink>
              <ActionLink accent="brand" href={nextStep.secondaryHref}>
                {nextStep.secondaryLabel}
              </ActionLink>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Right sidebar */}
      <div className="col-span-12 grid gap-5 xl:col-span-5 xl:gap-6">
        {/* Active goal – compact */}
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<ListChecks />} title="Активная цель" />
          <div className="mt-4 space-y-3">
            <p className="line-clamp-2 break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {primaryGoal.title}
            </p>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-600 dark:text-zinc-400">Прогресс</span>
                <span className={["font-semibold", dashboardAccents.brand.text].join(" ")}>
                  {goalProgress}%
                </span>
              </div>
              <DashboardProgressBar accent="brand" value={goalProgress} />
            </div>
            {goalProgress === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Прогресс вырастет после выполнения привычек
              </p>
            ) : null}
          </div>
        </DashboardCard>

        {/* Connected wish */}
        <DashboardCard accent="brand">
          <DashboardCardHeader accent="brand" icon={<Gem />} title="Связанное желание" />
          {mainWish ? (
            <div className="mt-4 space-y-2">
              <p className="break-words text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                {mainWish.title}
              </p>
              <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                {mainWish.description ?? "Желание связано с фокусом и поддерживает мотивацию."}
              </p>
              <div className="pt-1">
                <ActionLink accent="brand" href="/goals/wishes">
                  Карта желаний
                </ActionLink>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-1.5">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Желание ещё не связано с целью.
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Добавьте мотиватор, чтобы фокус был устойчивее.
              </p>
              <div className="pt-2">
                <ActionLink accent="brand" href="/goals/wishes">
                  Связать желание
                </ActionLink>
              </div>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* Lifera next action */}
      <div className="col-span-12">
        <DashboardCard accent="recommendation">
          <DashboardCardHeader
            accent="recommendation"
            icon={<ArrowUpRight />}
            title="Следующее действие Lifera"
          />
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                {recommendation.title}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {recommendation.content}
              </p>
            </div>
            <div className="shrink-0">
              <ActionLink accent="recommendation" href={recommendation.action.href}>
                {recommendation.action.label}
              </ActionLink>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
