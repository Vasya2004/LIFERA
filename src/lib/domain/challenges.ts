import type { SupabaseClient } from "@supabase/supabase-js";

import { awardXpOnce, checkAchievements } from "@/lib/domain/gamification";
import { PlanLimitError } from "@/lib/domain/plan-limit-error";
import { assertCanCreateChallenge, challengeLimitMessage } from "@/lib/domain/subscription";

const starterStages = [
  "Сформулировать результат",
  "Разбить путь на этапы",
  "Сделать первый измеримый шаг",
  "Проверить прогресс",
  "Закрепить систему",
];

export async function insertStarterStagesForChallenge({
  challengeId,
  challengeTitle,
  supabase,
  userId,
}: {
  challengeId: string;
  challengeTitle: string;
  supabase: SupabaseClient;
  userId: string;
}) {
  const stages = starterStages.map((stageTitle, index) => ({
    challenge_id: challengeId,
    description: `Этап ${index + 1} плана цели "${challengeTitle}".`,
    order_index: index + 1,
    progress_value: Math.round(100 / starterStages.length),
    status: index === 0 ? "active" : "locked",
    title: stageTitle,
    user_id: userId,
    xp_reward: 80,
  }));

  const { error: stageError } = await supabase.from("challenge_stages").insert(stages);

  if (stageError) {
    throw new Error(stageError.message);
  }
}

export async function createChallengeWithStages({
  description,
  difficulty = "medium",
  durationDays = 7,
  goalId,
  isPremium = false,
  supabase,
  title,
  userId,
}: {
  description?: string | null;
  difficulty?: "easy" | "medium" | "hard";
  durationDays?: number;
  goalId?: string | null;
  isPremium?: boolean;
  supabase: SupabaseClient;
  title: string;
  userId: string;
}) {
  const gate = await assertCanCreateChallenge(supabase, userId, isPremium);

  if (!gate.allowed) {
    throw new PlanLimitError(gate.reason ?? challengeLimitMessage());
  }

  const xpRewardTotal = starterStages.length * 80;
  const { data: challenge, error } = await supabase
    .from("challenges")
    .insert({
      description,
      difficulty,
      duration_days: durationDays,
      goal_id: goalId,
      is_premium: isPremium,
      is_template: false,
      status: "active",
      title,
      user_id: userId,
      xp_reward_total: xpRewardTotal,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  try {
    await insertStarterStagesForChallenge({
      challengeId: challenge.id,
      challengeTitle: title,
      supabase,
      userId,
    });
  } catch (stageError) {
    await supabase
      .from("challenges")
      .delete()
      .eq("id", challenge.id)
      .eq("user_id", userId);

    throw stageError;
  }

  return challenge;
}

export async function completeStage({
  challengeId,
  serviceSupabase,
  stageId,
  supabase,
  userId,
}: {
  challengeId: string;
  serviceSupabase?: SupabaseClient | null;
  stageId: string;
  supabase: SupabaseClient;
  userId: string;
}) {
  const db = serviceSupabase ?? supabase;
  const { data: stage, error } = await db
    .from("challenge_stages")
    .select("*")
    .eq("id", stageId)
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .single();

  if (error || !stage) {
    throw new Error(error?.message ?? "Stage not found.");
  }

  if (stage.status === "completed") {
    return {
      achievements: [],
      alreadyCompleted: true,
      progress: null,
      stage,
      xp: { awarded: false, amount: 0, level: null, xpTotal: null },
    };
  }

  if (stage.status !== "active") {
    throw new Error("Завершить можно только текущий активный шаг.");
  }

  const completedAt = new Date().toISOString();
  const { data: updatedStage, error: updateStageError } = await db
    .from("challenge_stages")
    .update({ completed_at: completedAt, status: "completed" })
    .eq("id", stageId)
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .eq("status", "active")
    .select("*")
    .maybeSingle();

  if (updateStageError) {
    throw new Error(updateStageError.message);
  }

  if (!updatedStage) {
    const { data: latestStage } = await db
      .from("challenge_stages")
      .select("*")
      .eq("id", stageId)
      .eq("user_id", userId)
      .maybeSingle();

    if (latestStage?.status === "completed") {
      return {
        achievements: [],
        alreadyCompleted: true,
        progress: null,
        stage: latestStage,
        xp: { awarded: false, amount: 0, level: null, xpTotal: null },
      };
    }

    throw new Error("Шаг уже недоступен для завершения.");
  }

  const xp = await awardXpOnce({
    amount: Number(updatedStage.xp_reward),
    reason: `Этап плана цели: ${updatedStage.title}`,
    sourceId: updatedStage.id,
    sourceType: "challenge_stage",
    supabase: db,
    userId,
  });

  const { data: allStages } = await db
    .from("challenge_stages")
    .select("*")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  const nextStage = (allStages ?? []).find((item) => item.status === "locked");

  if (nextStage) {
    await db
      .from("challenge_stages")
      .update({ status: "active" })
      .eq("id", nextStage.id)
      .eq("user_id", userId)
      .eq("status", "locked");
  }

  const { data: refreshedStages } = await db
    .from("challenge_stages")
    .select("status")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId);

  const completedCount = (refreshedStages ?? []).filter((item) => item.status === "completed").length;
  const totalStages = Math.max(1, refreshedStages?.length ?? 1);
  const progress = Math.min(100, Math.round((completedCount / totalStages) * 100));

  const { data: challenge } = await db
    .from("challenges")
    .select("goal_id")
    .eq("id", challengeId)
    .eq("user_id", userId)
    .single();

  await db
    .from("challenges")
    .update({
      current_stage: nextStage ? Number(nextStage.order_index) : totalStages,
      progress,
      status: progress >= 100 ? "completed" : "active",
    })
    .eq("id", challengeId)
    .eq("user_id", userId);

  if (challenge?.goal_id) {
    await db
      .from("goals")
      .update({ progress })
      .eq("id", challenge.goal_id)
      .eq("user_id", userId);
  }

  const achievements = await checkAchievements(db, userId);

  return {
    achievements,
    alreadyCompleted: false,
    progress,
    stage: updatedStage,
    xp: {
      ...xp,
      amount: Number(updatedStage.xp_reward),
    },
  };
}
