import type { SupabaseClient } from "@supabase/supabase-js";

import { calculateLevel } from "@/lib/domain/gamification";
import { buildRuleBasedRecommendation } from "@/lib/domain/ai";

export async function getDashboardData(supabase: SupabaseClient, userId: string) {
  const [
    profileResult,
    goalsResult,
    challengesResult,
    achievementsResult,
    habitsResult,
    habitLogsTodayResult,
    stagesResult,
    subscriptionResult,
    aiRecommendation,
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", userId).single(),
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("habit_logs")
      .select("habit_id,completed_on")
      .eq("user_id", userId)
      .eq("completed_on", new Date().toISOString().slice(0, 10)),
    supabase
      .from("challenge_stages")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("order_index", { ascending: true }),
    supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
    buildRuleBasedRecommendation(supabase, userId),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  const profile = profileResult.data;
  const levelMeta = calculateLevel(Number(profile.xp_total));

  const activeChallenges = (challengesResult.data ?? []).filter((item) => item.status === "active");
  const activeGoals = (goalsResult.data ?? []).filter((item) => item.status === "active");
  const activeStages = stagesResult.data ?? [];

  const primaryChallenge =
    activeChallenges.find((challenge) =>
      activeStages.some((stage) => stage.challenge_id === challenge.id),
    ) ??
    activeChallenges[0] ??
    null;

  const nextStage =
    (primaryChallenge
      ? activeStages.find((stage) => stage.challenge_id === primaryChallenge.id)
      : null) ??
    activeStages[0] ??
    null;

  const primaryGoal =
    activeGoals.find((goal) => goal.id === primaryChallenge?.goal_id) ??
    [...activeGoals].sort((a, b) => Number(a.progress) - Number(b.progress))[0] ??
    null;
  const recentUnlockedAchievements = (achievementsResult.data ?? [])
    .filter((item) => item.status === "unlocked")
    .sort((a, b) => {
      const aTime = a.unlocked_at ? new Date(a.unlocked_at).getTime() : 0;
      const bTime = b.unlocked_at ? new Date(b.unlocked_at).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return {
    achievements: achievementsResult.data ?? [],
    activeChallenges,
    activeGoals,
    activeHabits: habitsResult.data ?? [],
    aiRecommendation,
    habitLogsToday: habitLogsTodayResult.data ?? [],
    nextStage,
    primaryChallenge,
    primaryGoal,
    profile: { ...profile, ...levelMeta },
    recentUnlockedAchievements,
    subscription: subscriptionResult.data ?? null,
  };
}
