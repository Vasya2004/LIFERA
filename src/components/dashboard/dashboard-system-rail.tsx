import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatLifeArea } from "@/lib/domain/labels";
import { LIFE_AREA_STATUS_LABELS, type ProgressLifeArea } from "@/lib/domain/progress";
import type { Goal, Wish } from "@/lib/domain/types";

type DashboardSystemRailProps = {
  achievementsTotal: number;
  compact?: boolean;
  lifeAreas: ProgressLifeArea[];
  lifeScore: number;
  level: number;
  levelProgress: number;
  primaryGoal?: Goal | null;
  primaryWish?: Wish | null;
  unlockedAchievements: number;
  xpToNextLevel: number;
  xpTotal: number;
};

const quickLinks = [
  { href: "/goals", label: "Цели" },
  { href: "/habits", label: "Привычки" },
  { href: "/skills", label: "Навыки" },
  { href: "/achievements", label: "Достижения" },
];

export function DashboardSystemRail({
  achievementsTotal,
  compact = false,
  lifeAreas,
  lifeScore,
  level,
  levelProgress,
  primaryGoal,
  primaryWish,
  unlockedAchievements,
  xpToNextLevel,
  xpTotal,
}: DashboardSystemRailProps) {
  const metrics = [
    { label: "Индекс жизни", value: `${lifeScore}` },
    { label: "Уровень", value: `${level}` },
    { label: "Опыт", value: `${xpTotal}` },
    {
      label: "Достижения",
      value: achievementsTotal > 0 ? `${unlockedAchievements}` : "0",
    },
  ];

  return (
    <div className={compact ? "grid gap-4" : "sticky top-[calc(var(--topbar-height)+1rem)] grid gap-4"}>
      <Card className="grid gap-4 p-4 sm:p-5" variant="elevated">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Состояние системы</h2>
          {!compact ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {xpToNextLevel} опыта до следующего уровня
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <div
              className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-3 py-3"
              key={metric.label}
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="metric-value mt-1 text-2xl">{metric.value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Прогресс уровня</span>
            <span>{levelProgress}%</span>
          </div>
          <Progress className="mt-2" tone="success" value={levelProgress} />
        </div>
      </Card>

      <Card className="grid gap-3 p-4 sm:p-5">
        <h2 className="text-lg font-semibold tracking-tight">Главный контекст</h2>
        <div className="grid gap-3">
          <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-3 py-3">
            <p className="text-xs text-muted-foreground">Главная цель</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-foreground">
              {primaryGoal?.title ?? "Выберите цель"}
            </p>
          </div>
          <div className="rounded-[var(--radius-control)] border border-border bg-surface-muted/70 px-3 py-3">
            <p className="text-xs text-muted-foreground">Главное желание</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-foreground">
              {primaryWish?.title ?? "Добавьте мотивацию"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="grid gap-4 p-4 sm:p-5">
        <h2 className="text-lg font-semibold tracking-tight">Сферы</h2>
        {lifeAreas.length > 0 ? (
          <div className="grid gap-3">
            {lifeAreas.map((area) => (
              <div key={area.area}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-foreground">{formatLifeArea(area.area)}</span>
                  <span className="text-xs text-muted-foreground">
                    {LIFE_AREA_STATUS_LABELS[area.status]}
                  </span>
                </div>
                <Progress
                  className="mt-2"
                  tone={
                    area.status === "rising"
                      ? "success"
                      : area.status === "declining"
                        ? "warning"
                        : "muted"
                  }
                  value={area.progressPercent}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Сферы появятся, когда вы добавите цели и привычки.
          </p>
        )}
      </Card>

      {!compact ? (
        <Card className="grid gap-3 p-4 sm:p-5" variant="muted">
          <h2 className="text-sm font-semibold text-foreground">Быстрые переходы</h2>
          <div className="grid gap-1">
            {quickLinks.map((link) => (
              <Link
                className="rounded-[var(--radius-control)] px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
