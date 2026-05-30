import type { SupabaseClient } from "@supabase/supabase-js";

import type { Challenge, Goal } from "@/lib/domain/types";

export type GoalWithChallenges = Goal & {
  linkedChallenges: Challenge[];
};

export async function getGoalsWithChallenges(supabase: SupabaseClient, userId: string) {
  const [{ data: goals, error: goalsError }, { data: challenges, error: challengesError }] =
    await Promise.all([
      supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("challenges")
        .select("*")
        .eq("user_id", userId)
        .eq("is_template", false)
        .order("created_at", { ascending: false }),
    ]);

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  const challengesByGoal = new Map<string, Challenge[]>();

  for (const challenge of challenges ?? []) {
    if (!challenge.goal_id) {
      continue;
    }

    const list = challengesByGoal.get(challenge.goal_id) ?? [];
    list.push(challenge as Challenge);
    challengesByGoal.set(challenge.goal_id, list);
  }

  const goalsWithChallenges: GoalWithChallenges[] = (goals ?? []).map((goal) => ({
    ...(goal as Goal),
    linkedChallenges: challengesByGoal.get(goal.id) ?? [],
  }));

  return {
    goals: goalsWithChallenges,
    totalGoals: goalsWithChallenges.length,
  };
}
