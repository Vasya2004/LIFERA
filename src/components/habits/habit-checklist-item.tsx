"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Dumbbell,
  Flame,
  MoreVertical,
  Pencil,
  Target,
  Trash2,
  Undo2,
  Wallet,
} from "lucide-react";

import { HabitSettingsDialog } from "@/components/habits/habit-settings-dialog";
import { Button } from "@/components/ui/button";
import { formatLifeArea } from "@/lib/domain/labels";
import { useToast } from "@/components/ui/toast-provider";
import {
  handleMutationError,
  maybeShowLevelUpToast,
  showAchievementUnlockedToasts,
  showMutationSuccess,
} from "@/lib/ui/feedback";
import type { HabitChecklistItemData } from "@/lib/domain/habits-page";
import type { HabitFrequency } from "@/lib/domain/types";

type HabitChecklistItemProps = HabitChecklistItemData & {
  isLast?: boolean;
};

function frequencyLabel(frequency: HabitFrequency): string {
  if (frequency === "daily") return "Каждый день";
  if (frequency === "weekdays") return "По будням";
  if (frequency === "weekly") return "Раз в неделю";
  return "По расписанию";
}

function MissionIcon({ lifeArea }: { lifeArea: string }) {
  const cls = "text-primary";
  if (lifeArea === "education" || lifeArea === "skills") return <BookOpen className={cls} size={15} />;
  if (lifeArea === "health") return <Dumbbell className={cls} size={15} />;
  if (lifeArea === "finance") return <Wallet className={cls} size={15} />;
  if (lifeArea === "creativity") return <Brain className={cls} size={15} />;
  return <Target className={cls} size={15} />;
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        type="button"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <Button onClick={onCancel} size="sm" variant="secondary">
            Отмена
          </Button>
          <Button
            loading={loading}
            loadingLabel="Удаляем..."
            onClick={onConfirm}
            size="sm"
            variant="danger"
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HabitChecklistItem({
  completedToday,
  goalTitle,
  habit,
  isLast = false,
  skillTitle,
}: HabitChecklistItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [optimisticCompleted, setOptimisticCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const completed = optimisticCompleted ?? completedToday;

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  async function toggleComplete() {
    if (loading) return;
    setLoading(true);
    const endpoint = completed
      ? `/api/habits/${habit.id}/uncomplete`
      : `/api/habits/${habit.id}/complete`;
    const method = "POST";

    setOptimisticCompleted(!completed);

    const response = await fetch(endpoint, { method });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setOptimisticCompleted(null);
      handleMutationError(toast, payload, completed ? "Не удалось отменить выполнение." : "Не удалось отметить привычку.");
      return;
    }

    setOptimisticCompleted(null);

    if (completed) {
      showMutationSuccess(toast, "Выполнение отменено");
    } else {
      const xp = Number(payload?.xpAwarded ?? payload?.xp?.amount ?? 0);
      const streak = Number(payload?.habit?.streak_current ?? 0);
      const parts = [
        xp > 0 ? `+${xp} опыта` : null,
        streak > 0 ? `Серия ${streak} ${streak === 1 ? "день" : streak < 5 ? "дня" : "дней"}` : null,
      ].filter(Boolean);

      toast({
        description: parts.join(" · ") || "Прогресс обновлён.",
        title: "Привычка выполнена",
        variant: "progress",
      });

      maybeShowLevelUpToast(toast, {
        amount: xp,
        awarded: payload?.xp?.awarded,
        level: payload?.xp?.level,
        xpTotal: payload?.xp?.xpTotal,
      });
      showAchievementUnlockedToasts(toast, payload?.achievements);
    }

    router.refresh();
  }

  async function archiveHabit() {
    setMenuOpen(false);
    const response = await fetch(`/api/habits/${habit.id}`, { method: "DELETE" });
    if (!response.ok) return;
    showMutationSuccess(toast, "Привычка архивирована");
    router.refresh();
  }

  async function deleteHabit() {
    setMenuOpen(false);
    const response = await fetch(`/api/habits/${habit.id}?hard=true`, { method: "DELETE" });
    setConfirmOpen(false);
    if (!response.ok) return;
    showMutationSuccess(toast, "Привычка удалена");
    router.refresh();
  }

  const contextLabel = skillTitle ?? goalTitle ?? formatLifeArea(habit.life_area);
  const freq = frequencyLabel(habit.frequency);

  return (
    <>
      <div
        className={[
          "flex flex-col gap-3 bg-white px-4 py-3.5 transition-colors sm:flex-row sm:items-center dark:bg-zinc-900",
          completed ? "bg-green-50/50 dark:bg-green-500/5" : "",
          isLast ? "" : "border-b border-zinc-200 dark:border-white/10",
        ].join(" ")}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <button
            aria-label={completed ? `Отменить выполнение: ${habit.title}` : `Отметить: ${habit.title}`}
            className={[
              "mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border-2 transition-all sm:mt-0",
              completed
                ? "border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400"
                : "border-zinc-300 bg-white hover:border-primary hover:bg-primary/5 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-primary dark:hover:bg-primary/10",
            ].join(" ")}
            onClick={toggleComplete}
            disabled={loading}
            type="button"
          >
            {completed ? (
              <Check size={16} strokeWidth={3} />
            ) : (
              <MissionIcon lifeArea={habit.life_area} />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <p
                className={[
                  "text-sm font-semibold",
                  completed
                    ? "text-zinc-400 line-through dark:text-zinc-500"
                    : "text-zinc-950 dark:text-zinc-50",
                ].join(" ")}
              >
                {habit.title}
              </p>
              <span className="text-xs font-semibold text-primary">+{habit.xp_reward} XP</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{freq}</span>
              {contextLabel ? (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
                  <span className="max-w-[200px] truncate">{contextLabel}</span>
                </>
              ) : null}
              {habit.streak_current > 0 ? (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Flame className="text-primary" size={11} />
                    {habit.streak_current} {habit.streak_current === 1 ? "день" : habit.streak_current < 5 ? "дня" : "дней"}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <button
            className={[
              "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors",
              completed
                ? "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
            ].join(" ")}
            onClick={toggleComplete}
            disabled={loading}
            type="button"
          >
            {completed ? (
              <>
                <Undo2 size={13} />
                Отменить
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                Отметить
              </>
            )}
          </button>

          <div className="relative" ref={menuRef}>
            <Button
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Действия с привычкой"
              className="size-9 px-0 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              onClick={() => setMenuOpen((open) => !open)}
              size="sm"
              variant="ghost"
            >
              <MoreVertical size={16} />
            </Button>

            {menuOpen ? (
              <div
                className="absolute right-0 top-full z-30 mt-1.5 min-w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-zinc-900"
                role="menu"
              >
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => { setMenuOpen(false); setSettingsOpen(true); }}
                  role="menuitem"
                  type="button"
                >
                  <Pencil size={14} className="text-zinc-400" />
                  Редактировать
                </button>
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => { setMenuOpen(false); toggleComplete(); }}
                  role="menuitem"
                  type="button"
                >
                  {completed ? (
                    <>
                      <Undo2 size={14} className="text-zinc-400" />
                      Отменить выполнение
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} className="text-zinc-400" />
                      Отметить выполненной
                    </>
                  )}
                </button>
                <div className="my-1 border-t border-zinc-100 dark:border-white/5" />
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  onClick={archiveHabit}
                  role="menuitem"
                  type="button"
                >
                  <Target size={14} className="text-zinc-400" />
                  Архивировать
                </button>
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                  role="menuitem"
                  type="button"
                >
                  <Trash2 size={14} />
                  Удалить
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <HabitSettingsDialog habit={habit} onClose={() => setSettingsOpen(false)} open={settingsOpen} />

      {confirmOpen ? (
        <ConfirmDialog
          loading={false}
          message="Удалить привычку? Это действие нельзя отменить."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deleteHabit}
        />
      ) : null}
    </>
  );
}
