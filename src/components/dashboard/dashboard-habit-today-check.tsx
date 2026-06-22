"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { useToast } from "@/components/ui/toast-provider";
import {
  handleMutationError,
  maybeShowLevelUpToast,
  showAchievementUnlockedToasts,
} from "@/lib/ui/feedback";

type DashboardHabitTodayCheckProps = {
  completed: boolean;
  habitId: string;
  title: string;
};

export function DashboardHabitTodayCheck({
  completed,
  habitId,
  title,
}: DashboardHabitTodayCheckProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed);
  const [loading, setLoading] = useState(false);

  async function completeHabit() {
    if (optimisticCompleted || loading) {
      return;
    }

    setLoading(true);
    setOptimisticCompleted(true);

    const response = await fetch(`/api/habits/${habitId}/complete`, { method: "POST" });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setOptimisticCompleted(false);
      handleMutationError(toast, payload, "Не удалось отметить привычку.");
      return;
    }

    const xp = Number(payload?.xpAwarded ?? payload?.xp?.amount ?? 0);
    const streak = Number(payload?.habit?.streak_current ?? 0);
    const parts = [
      xp > 0 ? `+${xp} опыта` : null,
      streak > 0 ? `Серия ${streak} ${streak === 1 ? "день" : streak < 5 ? "дня" : "дней"}` : null,
    ].filter(Boolean);

    toast({
      description: payload?.alreadyCompleted
        ? "Повторный опыт не начисляется."
        : parts.join(" · ") || "Прогресс обновлён.",
      title: payload?.alreadyCompleted ? "Уже выполнено сегодня" : "Привычка выполнена",
      variant: payload?.alreadyCompleted ? "info" : "progress",
    });

    maybeShowLevelUpToast(toast, {
      amount: xp,
      awarded: payload?.xp?.awarded,
      level: payload?.xp?.level,
      xpTotal: payload?.xp?.xpTotal,
    });
    showAchievementUnlockedToasts(toast, payload?.achievements);

    router.refresh();
  }

  if (optimisticCompleted) {
    return (
      <span
        aria-label={`Выполнено: ${title}`}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary text-[10px] text-white"
        role="img"
      >
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }

  return (
    <button
      aria-label={`Отметить привычку на сегодня: ${title}`}
      className={[
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] transition",
        "border-zinc-300 bg-transparent text-zinc-500 hover:border-primary hover:bg-primary/10 hover:text-primary",
        "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
        "disabled:cursor-wait disabled:opacity-60",
        "dark:border-muted-foreground/45 dark:text-zinc-500 dark:hover:border-primary dark:hover:text-primary",
      ].join(" ")}
      disabled={loading}
      onClick={completeHabit}
      type="button"
    >
      {loading ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
    </button>
  );
}
