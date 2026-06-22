import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeIntendedPlan, normalizePlanTier } from "@/lib/domain/plan-catalog";
import { PlanLimitError } from "@/lib/domain/plan-limit-error";
import type { PlanTier } from "@/lib/domain/types";

export const FREE_LIMITS = {
  activeChallenges: 2,
  activeGoals: 3,
  activeHabits: 5,
} as const;

export const FREE_AI_WEEKLY_LIMIT = 3;
export const FREE_PROGRESS_HISTORY_DAYS = 7;

export type PaidPlanTier = Extract<PlanTier, "pro" | "ultra">;

export function isDemoPremiumEnabled() {
  return process.env.DEMO_PREMIUM_ENABLED === "true";
}

export function hasProAccess(plan: PlanTier) {
  return plan === "pro" || plan === "ultra";
}

export function hasUltraAccess(plan: PlanTier) {
  return plan === "ultra";
}

export function goalLimitMessage() {
  return `На Free-плане доступно до ${FREE_LIMITS.activeGoals} активных целей. Откройте раздел «План», чтобы снять лимит или активировать demo Pro.`;
}

export function challengeLimitMessage() {
  return `На Free-плане доступно до ${FREE_LIMITS.activeChallenges} активных планов цели. Откройте раздел «План», чтобы снять лимит или активировать demo Pro.`;
}

export function habitLimitMessage() {
  return `На Free-плане доступно до ${FREE_LIMITS.activeHabits} активных привычек. Откройте раздел «План», чтобы снять лимит или активировать demo Pro.`;
}

export function proTemplateLimitMessage() {
  return "Pro-шаблоны доступны на Pro и Ultra. Откройте раздел «План» для demo-активации или будущей оплаты.";
}

export function aiWeeklyLimitMessage() {
  return `На Free-плане доступно ${FREE_AI_WEEKLY_LIMIT} AI-рекомендации в неделю. Откройте раздел «План» для Pro или Ultra.`;
}

export function aiGenerationLimitMessage() {
  return "AI-генерация планов цели доступна на Pro и Ultra. Откройте раздел «План» для demo-активации или будущей оплаты.";
}

function weekStartIsoDate() {
  const date = new Date();
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  return date.toISOString().slice(0, 10);
}

export async function getUserPlan(supabase: SupabaseClient, userId: string): Promise<PlanTier> {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.status === "active") {
    return normalizePlanTier(data.plan);
  }

  return "free";
}

export async function getUserIntendedPlan(
  supabase: SupabaseClient,
  userId: string,
): Promise<PlanTier | null> {
  const { data } = await supabase
    .from("user_profiles")
    .select("intended_plan")
    .eq("user_id", userId)
    .maybeSingle();

  return normalizeIntendedPlan(data?.intended_plan ?? null);
}

export async function setUserIntendedPlan(
  supabase: SupabaseClient,
  userId: string,
  intendedPlan: PlanTier | null,
) {
  const normalized = intendedPlan ? normalizeIntendedPlan(intendedPlan) : null;

  const { error } = await supabase
    .from("user_profiles")
    .update({ intended_plan: normalized })
    .eq("user_id", userId);

  if (error) {
    throw new Error("Не удалось сохранить выбранный план.");
  }
}

export async function assertCanCreateGoal(supabase: SupabaseClient, userId: string) {
  const plan = await getUserPlan(supabase, userId);

  if (hasProAccess(plan)) {
    return { allowed: true, reason: null };
  }

  const { count } = await supabase
    .from("goals")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active");

  if ((count ?? 0) >= FREE_LIMITS.activeGoals) {
    return {
      allowed: false,
      reason: goalLimitMessage(),
    };
  }

  return { allowed: true, reason: null };
}

export async function assertCanCreateHabit(supabase: SupabaseClient, userId: string) {
  const plan = await getUserPlan(supabase, userId);

  if (hasProAccess(plan)) {
    return { allowed: true, reason: null };
  }

  const { count } = await supabase
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active");

  if ((count ?? 0) >= FREE_LIMITS.activeHabits) {
    return {
      allowed: false,
      reason: habitLimitMessage(),
    };
  }

  return { allowed: true, reason: null };
}

export async function assertCanCreateChallenge(
  supabase: SupabaseClient,
  userId: string,
  isPremium = false,
) {
  const plan = await getUserPlan(supabase, userId);

  if (isPremium && !hasProAccess(plan)) {
    return { allowed: false, reason: proTemplateLimitMessage() };
  }

  if (hasProAccess(plan)) {
    return { allowed: true, reason: null };
  }

  const { count } = await supabase
    .from("challenges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active");

  if ((count ?? 0) >= FREE_LIMITS.activeChallenges) {
    return {
      allowed: false,
      reason: challengeLimitMessage(),
    };
  }

  return { allowed: true, reason: null };
}

export async function assertCanActivateGoal(
  supabase: SupabaseClient,
  userId: string,
  currentStatus: string | undefined,
  nextStatus: string | undefined,
) {
  if (nextStatus !== "active" || currentStatus === "active") {
    return { allowed: true, reason: null };
  }

  return assertCanCreateGoal(supabase, userId);
}

export async function assertCanActivateHabit(
  supabase: SupabaseClient,
  userId: string,
  currentStatus: string | undefined,
  nextStatus: string | undefined,
) {
  if (nextStatus !== "active" || currentStatus === "active") {
    return { allowed: true, reason: null };
  }

  return assertCanCreateHabit(supabase, userId);
}

export async function assertCanActivateChallenge(
  supabase: SupabaseClient,
  userId: string,
  currentStatus: string | undefined,
  nextStatus: string | undefined,
) {
  if (nextStatus !== "active" || currentStatus === "active") {
    return { allowed: true, reason: null };
  }

  return assertCanCreateChallenge(supabase, userId, false);
}

export async function assertCanCreateAiRecommendation(
  supabase: SupabaseClient,
  userId: string,
) {
  const plan = await getUserPlan(supabase, userId);

  if (hasProAccess(plan)) {
    return { allowed: true, reason: null };
  }

  const weekStart = weekStartIsoDate();
  const { count } = await supabase
    .from("ai_recommendations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", `${weekStart}T00:00:00`);

  if ((count ?? 0) >= FREE_AI_WEEKLY_LIMIT) {
    return {
      allowed: false,
      reason: aiWeeklyLimitMessage(),
    };
  }

  return { allowed: true, reason: null };
}

export async function assertCanUseAiGeneration(supabase: SupabaseClient, userId: string) {
  const plan = await getUserPlan(supabase, userId);

  if (hasProAccess(plan)) {
    return { allowed: true, reason: null };
  }

  return {
    allowed: false,
    reason: aiGenerationLimitMessage(),
  };
}

export function getProgressHistoryCutoff(plan: PlanTier) {
  if (hasProAccess(plan)) {
    return null;
  }

  const date = new Date();
  date.setDate(date.getDate() - (FREE_PROGRESS_HISTORY_DAYS - 1));
  return date.toISOString().slice(0, 10);
}

export async function activateDemoPlan(
  supabase: SupabaseClient,
  userId: string,
  plan: PaidPlanTier,
  serviceSupabase?: SupabaseClient | null,
) {
  const db = serviceSupabase ?? supabase;
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { error } = await db.from("subscriptions").upsert(
    {
      period_end: periodEnd.toISOString(),
      period_start: now.toISOString(),
      plan,
      provider: "demo",
      status: "active",
      user_id: userId,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error("Не удалось активировать demo-план.");
  }

  const { error: profileError } = await db
    .from("user_profiles")
    .update({ plan })
    .eq("user_id", userId);

  if (profileError) {
    throw new Error("Не удалось обновить профиль.");
  }
}

/** @deprecated use activateDemoPlan */
export async function activateDemoPremium(
  supabase: SupabaseClient,
  userId: string,
  serviceSupabase?: SupabaseClient | null,
) {
  return activateDemoPlan(supabase, userId, "pro", serviceSupabase);
}

export async function assertCanCreateAiRecommendationOrThrow(
  supabase: SupabaseClient,
  userId: string,
) {
  const gate = await assertCanCreateAiRecommendation(supabase, userId);

  if (!gate.allowed) {
    throw new PlanLimitError(gate.reason ?? aiWeeklyLimitMessage());
  }
}

export async function assertCanUseAiGenerationOrThrow(
  supabase: SupabaseClient,
  userId: string,
) {
  const gate = await assertCanUseAiGeneration(supabase, userId);

  if (!gate.allowed) {
    throw new PlanLimitError(gate.reason ?? aiGenerationLimitMessage());
  }
}
