import type { SupabaseClient } from "@supabase/supabase-js";

import type { Challenge, ChallengeStage, Goal } from "@/lib/domain/types";

export type ChallengeWithMeta = Challenge & {
  goalTitle: string | null;
  nextStepTitle: string | null;
};

export async function getChallengesPageData(supabase: SupabaseClient, userId: string) {
  const [
    { data: challenges, error: challengesError },
    { data: activeSteps, error: stepsError },
    { data: goals, error: goalsError },
    { data: templates, error: templatesError },
  ] = await Promise.all([
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("is_template", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("challenge_stages")
      .select("challenge_id, title, order_index")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("order_index", { ascending: true }),
    supabase.from("goals").select("id, title").eq("user_id", userId),
    supabase
      .from("challenges")
      .select("*")
      .eq("is_template", true)
      .order("is_premium", { ascending: true }),
  ]);

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  if (stepsError) {
    throw new Error(stepsError.message);
  }

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  if (templatesError) {
    throw new Error(templatesError.message);
  }

  const goalTitles = new Map((goals ?? []).map((goal) => [goal.id, goal.title]));
  const nextStepByChallenge = new Map<string, string>();

  for (const step of activeSteps ?? []) {
    if (!nextStepByChallenge.has(step.challenge_id)) {
      nextStepByChallenge.set(step.challenge_id, step.title);
    }
  }

  const withMeta: ChallengeWithMeta[] = (challenges ?? []).map((challenge) => ({
    ...(challenge as Challenge),
    goalTitle: challenge.goal_id ? (goalTitles.get(challenge.goal_id) ?? null) : null,
    nextStepTitle: nextStepByChallenge.get(challenge.id) ?? null,
  }));

  return {
    active: withMeta.filter((item) => item.status === "active"),
    archived: withMeta.filter((item) => item.status === "archived"),
    completed: withMeta.filter((item) => item.status === "completed"),
    goals: (goals ?? []) as Array<Pick<Goal, "id" | "title">>,
    paused: withMeta.filter((item) => item.status === "paused"),
    templates: (templates ?? []) as Challenge[],
  };
}

export async function getChallengeDetailData(
  supabase: SupabaseClient,
  userId: string,
  challengeId: string,
) {
  const [{ data: challenge }, { data: stages }, { data: goals }] = await Promise.all([
    supabase
      .from("challenges")
      .select("*")
      .eq("id", challengeId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("challenge_stages")
      .select("*")
      .eq("challenge_id", challengeId)
      .eq("user_id", userId)
      .order("order_index", { ascending: true }),
    supabase.from("goals").select("id, title, life_area, progress").eq("user_id", userId),
  ]);

  const linkedGoal = challenge?.goal_id
    ? (goals ?? []).find((goal) => goal.id === challenge.goal_id) ?? null
    : null;

  return {
    challenge: challenge as Challenge | null,
    goals: (goals ?? []) as Array<Pick<Goal, "id" | "title" | "life_area" | "progress">>,
    linkedGoal,
    stages: (stages ?? []) as ChallengeStage[],
  };
}
