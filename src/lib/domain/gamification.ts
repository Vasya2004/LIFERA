import type { SupabaseClient } from "@supabase/supabase-js";

export const XP_PER_LEVEL = 500;
const POSTGRES_UNIQUE_VIOLATION = "23505";
const XP_AWARD_RETRY_LIMIT = 3;

export function calculateLevel(xpTotal: number) {
  const level = Math.floor(xpTotal / XP_PER_LEVEL) + 1;
  const nextLevelXp = level * XP_PER_LEVEL;
  const levelProgress = Math.round(((xpTotal % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);

  return {
    level,
    levelProgress,
    nextLevelXp,
    xpToNextLevel: Math.max(0, nextLevelXp - xpTotal),
  };
}

export async function awardXpOnce({
  amount,
  reason,
  sourceId,
  sourceType,
  supabase,
  userId,
}: {
  amount: number;
  reason: string;
  sourceId: string;
  sourceType: string;
  supabase: SupabaseClient;
  userId: string;
}) {
  const { error: insertError } = await supabase.from("xp_transactions").insert({
    amount,
    reason,
    source_id: sourceId,
    source_type: sourceType,
    user_id: userId,
  });

  if (insertError) {
    if (insertError.code === POSTGRES_UNIQUE_VIOLATION) {
      return { awarded: false, level: null, xpTotal: null };
    }

    throw new Error(insertError.message);
  }

  for (let attempt = 0; attempt < XP_AWARD_RETRY_LIMIT; attempt += 1) {
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("xp_total")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const previousTotal = Number(profile.xp_total ?? 0);
    const xpTotal = previousTotal + amount;
    const { level } = calculateLevel(xpTotal);

    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profiles")
      .update({ level, xp_total: xpTotal })
      .eq("user_id", userId)
      .eq("xp_total", previousTotal)
      .select("xp_total")
      .maybeSingle();

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (updatedProfile) {
      return { awarded: true, level, xpTotal };
    }
  }

  throw new Error("Не удалось обновить XP профиля.");
}

export async function checkAchievements(supabase: SupabaseClient, userId: string) {
  const [
    { count: completedStages },
    { count: goalsCreated },
    { count: completedChallenges },
    { count: habitCompletions },
    profileResult,
    habitsResult,
  ] = await Promise.all([
    supabase
      .from("challenge_stages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase.from("goals").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("challenges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("habit_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("user_profiles").select("level").eq("user_id", userId).single(),
    supabase.from("habits").select("streak_current").eq("user_id", userId).eq("status", "active"),
  ]);

  const { data: lifeAreas } = await supabase
    .from("goals")
    .select("life_area")
    .eq("user_id", userId);

  const values: Record<string, number> = {
    completed_challenges: completedChallenges ?? 0,
    completed_stages: completedStages ?? 0,
    goals_created: goalsCreated ?? 0,
    habit_completions: habitCompletions ?? 0,
    habit_streak: Math.max(
      0,
      ...(habitsResult.data ?? []).map((habit) => Number(habit.streak_current ?? 0)),
    ),
    level_reached: Number(profileResult.data?.level ?? 1),
    life_areas_with_goals: new Set((lifeAreas ?? []).map((goal) => goal.life_area)).size,
  };

  const { data: lockedAchievements, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "locked");

  if (error) {
    throw new Error(error.message);
  }

  const unlocked = [];

  for (const achievement of lockedAchievements ?? []) {
    const currentValue = values[String(achievement.condition_type)] ?? 0;

    if (currentValue >= Number(achievement.condition_value)) {
      const { error: updateError } = await supabase
        .from("achievements")
        .update({ status: "unlocked", unlocked_at: new Date().toISOString() })
        .eq("id", achievement.id)
        .eq("user_id", userId)
        .eq("status", "locked");

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (Number(achievement.xp_reward) > 0) {
        await awardXpOnce({
          amount: Number(achievement.xp_reward),
          reason: `Достижение: ${achievement.title}`,
          sourceId: achievement.id,
          sourceType: "achievement",
          supabase,
          userId,
        });
      }

      unlocked.push(achievement);
    }
  }

  return unlocked;
}

