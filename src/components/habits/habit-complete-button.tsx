"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import {
  handleMutationError,
  maybeShowLevelUpToast,
  showAchievementUnlockedToasts,
} from "@/lib/ui/feedback";

type HabitCompleteButtonProps = {
  className?: string;
  habitId: string;
  initialCompleted?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
};

export function HabitCompleteButton({
  className = "",
  habitId,
  initialCompleted = false,
  label = "Отметить",
  size = "sm",
  variant = "primary",
}: HabitCompleteButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function completeHabit() {
    if (completed || loading) {
      return;
    }

    setLoading(true);

    const response = await fetch(`/api/habits/${habitId}/complete`, { method: "POST" });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      handleMutationError(toast, payload, "Не удалось отметить привычку.");
      return;
    }

    setCompleted(true);

    if (payload?.alreadyCompleted) {
      toast({
        description: "Повторный опыт не начисляется.",
        title: "Привычка уже выполнена сегодня",
        variant: "info",
      });
      router.refresh();
      return;
    }

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

    router.refresh();
  }

  if (completed) {
    return (
      <Button className={className} disabled size={size} variant="secondary">
        Выполнено
      </Button>
    );
  }

  return (
    <Button
      className={className}
      loading={loading}
      loadingLabel="Отмечаем..."
      onClick={completeHabit}
      size={size}
      variant={variant}
    >
      {label}
    </Button>
  );
}
