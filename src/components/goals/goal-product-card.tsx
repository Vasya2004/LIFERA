"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  Flag,
  Heart,
  MoreHorizontal,
  Wallet,
} from "lucide-react";

import { GoalSettingsDialog } from "@/components/goals/goal-settings-dialog";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { formatDate, formatLifeArea, GOAL_STATUS_LABELS } from "@/lib/domain/labels";
import type { GoalListItem } from "@/lib/domain/goals-page";
import type { LifeArea, Wish } from "@/lib/domain/types";

type GoalProductCardProps = GoalListItem & {
  variant?: "active" | "compact";
  wishes?: Wish[];
};

function LifeAreaIcon({ area }: { area: LifeArea }) {
  const className = "text-zinc-500";

  if (area === "finance") {
    return <Wallet className={className} size={18} />;
  }

  if (area === "health") {
    return <Heart className={className} size={18} />;
  }

  if (area === "education" || area === "skills") {
    return <BookOpen className={className} size={18} />;
  }

  return <Briefcase className={className} size={18} />;
}

export function GoalProductCard({
  goal,
  isPrimary,
  linkedWish,
  variant = "active",
  wishes = [],
}: GoalProductCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const progress = Number(goal.progress);
  const missionCount = goal.linkedChallenges.filter(
    (challenge) => challenge.status === "active",
  ).length;
  const hasWish = Boolean(linkedWish);
  const systemItems = [
    hasWish,
    missionCount > 0,
    Boolean(goal.target_date),
    progress > 0,
    progress >= 100 || goal.status === "completed",
  ];

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  async function deleteGoal() {
    if (loading || !window.confirm("Удалить цель? Связанный план останется без привязки.")) {
      return;
    }

    setLoading(true);
    setMenuOpen(false);

    const response = await fetch(`/api/goals/${goal.id}`, { method: "DELETE" });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    }
  }

  async function makePrimaryGoal() {
    if (loading || isPrimary) {
      return;
    }

    setLoading(true);
    setMenuOpen(false);

    const response = await fetch("/api/goals/primary", {
      body: JSON.stringify({ goal_id: goal.id }),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });

    setLoading(false);

    if (response.ok) {
      router.refresh();
    }
  }

  if (variant === "compact") {
    return (
      <>
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-white/5 dark:bg-zinc-900/70">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 break-words font-medium text-foreground">{goal.title}</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {formatLifeArea(goal.life_area)} · {progress}% · {isPrimary ? "Главная · " : ""}
                {GOAL_STATUS_LABELS[goal.status] ?? goal.status}
              </p>
              <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-muted-foreground">
                {goal.target_date ? `До ${formatDate(goal.target_date)}` : "Срок не задан"} ·{" "}
                {linkedWish ? `Желание: ${linkedWish.title}` : "Нет желания"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/goals/${goal.id}`}>
                <Button size="sm" variant="secondary">
                  Открыть
                </Button>
              </Link>
              {goal.status === "archived" ? (
                <Button loading={loading} onClick={deleteGoal} size="sm" variant="danger">
                  Удалить
                </Button>
              ) : (
                <div className="relative" ref={menuRef}>
                  <Button
                    aria-label="Действия с целью"
                    className="touch-target"
                    onClick={() => setMenuOpen((open) => !open)}
                    size="sm"
                    variant="secondary"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                  {menuOpen ? (
                    <div className="absolute right-0 top-full z-20 mt-2 min-w-40 rounded-[var(--radius-control)] border border-border bg-surface-elevated p-1 shadow-[var(--shadow-md)]">
                      <button
                        className="block w-full rounded-[calc(var(--radius-control)-4px)] px-3 py-2 text-left text-sm hover:bg-surface-muted"
                        onClick={() => {
                          setMenuOpen(false);
                          setSettingsOpen(true);
                        }}
                        type="button"
                      >
                        Настроить
                      </button>
                      {!isPrimary ? (
                        <button
                          className="block w-full rounded-[calc(var(--radius-control)-4px)] px-3 py-2 text-left text-sm hover:bg-surface-muted"
                          disabled={loading}
                          onClick={makePrimaryGoal}
                          type="button"
                        >
                          Сделать главной
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
        <GoalSettingsDialog
          goal={goal}
          isPrimary={isPrimary}
          linkedWishId={linkedWish?.id ?? null}
          onClose={() => setSettingsOpen(false)}
          open={settingsOpen}
          wishes={wishes}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid h-full min-h-[190px] gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-white/5 dark:bg-zinc-900/70 dark:hover:border-white/10">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-w-0 break-words text-base font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
            {goal.title}
          </h3>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-950/45">
            <LifeAreaIcon area={goal.life_area} />
          </span>
        </div>

        <div className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-4">
          <CircularProgress size={52} strokeWidth={4} value={progress} />
          <div className="grid gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <p className="flex min-w-0 items-center gap-2">
              <Briefcase aria-hidden="true" className="shrink-0 text-zinc-500" size={13} />
              <span className="min-w-0 break-words">{formatLifeArea(goal.life_area)}</span>
            </p>
            <p className="flex min-w-0 items-center gap-2">
              <Flag aria-hidden="true" className="shrink-0 text-zinc-500" size={13} />
              <span>{missionCount > 0 ? `${missionCount} привычек` : "Нет активных привычек"}</span>
            </p>
            <p className="flex min-w-0 items-center gap-2">
              <Heart aria-hidden="true" className="shrink-0 text-zinc-500" size={13} />
              <span className="line-clamp-1 min-w-0 break-words">
                {linkedWish?.title ?? "Нет желания"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <span>Система</span>
            <span>
              {systemItems.filter(Boolean).length} / {systemItems.length}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${(systemItems.filter(Boolean).length / systemItems.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link className="min-w-0 flex-1" href={`/goals/${goal.id}`}>
            <Button
              className="w-full rounded-xl border-zinc-200 bg-zinc-100 px-5 text-zinc-900 hover:bg-zinc-200 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              size="sm"
              variant="secondary"
            >
              Открыть
            </Button>
          </Link>
          {isPrimary ? (
            <span className="inline-flex h-[var(--button-height-sm)] items-center rounded-xl border border-primary/30 bg-primary/10 px-3 text-sm font-semibold text-primary">
              Главная
            </span>
          ) : (
            <Button
              className="rounded-xl border-zinc-200 bg-zinc-100 px-4 text-zinc-900 hover:bg-zinc-200 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              disabled={loading}
              loading={loading}
              onClick={makePrimaryGoal}
              size="sm"
              type="button"
              variant="secondary"
            >
              Главная
            </Button>
          )}
        </div>
      </div>

      <GoalSettingsDialog
        goal={goal}
        isPrimary={isPrimary}
        linkedWishId={linkedWish?.id ?? null}
        onClose={() => setSettingsOpen(false)}
        open={settingsOpen}
        wishes={wishes}
      />
    </>
  );
}
