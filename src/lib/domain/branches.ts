import type { SupabaseClient } from "@supabase/supabase-js";

import type { Challenge, Goal, Habit, LifeArea } from "@/lib/domain/types";

export type BranchActivities = {
  challenges: Challenge[];
  goals: Goal[];
  habits: Habit[];
};

export type BranchRecommendation = {
  content: string;
  ctaHref: string;
  ctaLabel: string;
  title: string;
};

export function sanitizeBranchNote(note: string | null | undefined, maxLength = 500): string | null {
  if (note == null) {
    return null;
  }

  const trimmed = String(note).trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

export async function getBranchActivities(
  supabase: SupabaseClient,
  userId: string,
  lifeAreas: LifeArea[],
): Promise<BranchActivities> {
  const areaSet = new Set(lifeAreas);

  const [{ data: goals, error: goalsError }, { data: habits, error: habitsError }, { data: challenges, error: challengesError }] =
    await Promise.all([
      supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["active", "backlog"])
        .order("created_at", { ascending: false }),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false }),
      supabase
        .from("challenges")
        .select("*")
        .eq("user_id", userId)
        .eq("is_template", false)
        .in("status", ["active", "paused"])
        .order("created_at", { ascending: false }),
    ]);

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  if (habitsError) {
    throw new Error(habitsError.message);
  }

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  const filteredGoals = (goals ?? []).filter((goal) => areaSet.has(goal.life_area as LifeArea));
  const goalIds = new Set(filteredGoals.map((goal) => goal.id));

  return {
    goals: filteredGoals as Goal[],
    habits: (habits ?? []).filter((habit) => areaSet.has(habit.life_area as LifeArea)) as Habit[],
    challenges: (challenges ?? []).filter(
      (challenge) => challenge.goal_id && goalIds.has(challenge.goal_id),
    ) as Challenge[],
  };
}
