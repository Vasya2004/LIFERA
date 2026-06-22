import { PLAN_UPGRADE_HREF, isPlanLimitPayload } from "@/lib/api/plan-limit";
import { XP_PER_LEVEL } from "@/lib/domain/gamification";

import type { ToastInput, ToastVariant } from "@/components/ui/toast-provider";

type ToastFn = (input: ToastInput) => string;

type AchievementLike = {
  title?: string | null;
  xp_reward?: number | null;
};

type XpPayload = {
  amount?: number | null;
  awarded?: boolean;
  level?: number | null;
  xpTotal?: number | null;
};

export function showPlanLimitToast(toast: ToastFn, message?: string) {
  return toast({
    action: { href: PLAN_UPGRADE_HREF, label: "Открыть план" },
    description: message ?? "Вы достигли лимита текущего плана.",
    title: "Лимит Free",
    variant: "warning",
  });
}

export function showApiErrorToast(toast: ToastFn, message: string) {
  return toast({
    description: message,
    title: "Не удалось выполнить действие",
    variant: "error",
  });
}

export function handleMutationError(
  toast: ToastFn,
  payload: unknown,
  fallbackMessage: string,
) {
  if (isPlanLimitPayload(payload)) {
    showPlanLimitToast(toast, payload.error);
    return { isPlanLimit: true };
  }

  const message =
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
      ? payload.error
      : fallbackMessage;

  showApiErrorToast(toast, message);
  return { isPlanLimit: false };
}

export function showAchievementUnlockedToasts(
  toast: ToastFn,
  achievements: AchievementLike[] | undefined | null,
) {
  for (const achievement of achievements ?? []) {
    const title = achievement.title?.trim() || "Новое достижение";
    const xp = Number(achievement.xp_reward ?? 0);

    toast({
      description: xp > 0 ? `${title} · +${xp} опыта` : title,
      title: "Достижение открыто",
      variant: "success",
    });
  }
}

export function maybeShowLevelUpToast(toast: ToastFn, xp: XpPayload | undefined | null) {
  if (!xp?.awarded || xp.level == null || xp.xpTotal == null) {
    return;
  }

  const amount = Number(xp.amount ?? 0);
  if (amount <= 0) {
    return;
  }

  const previousTotal = Number(xp.xpTotal) - amount;
  const previousLevel = Math.floor(previousTotal / XP_PER_LEVEL) + 1;
  const nextLevel = Number(xp.level);

  if (nextLevel > previousLevel) {
    toast({
      description: `Вы достигли уровня ${nextLevel}`,
      title: "Новый уровень",
      variant: "progress",
    });
  }
}

export function showMutationSuccess(
  toast: ToastFn,
  title: string,
  description?: string,
  variant: ToastVariant = "success",
) {
  return toast({ description, title, variant });
}
