import type { SupabaseClient } from "@supabase/supabase-js";

import type { Challenge, ChallengeStage, Goal } from "@/lib/domain/types";

export type ChallengeWithMeta = Challenge & {
  completedStagesCount: number;
  goalTitle: string | null;
  lifeArea: string | null;
  nextStepTitle: string | null;
  nextStepXp: number | null;
  totalStagesCount: number;
};

export type ChallengesPageSummary = {
  activeCount: number;
  averageProgress: number;
  completedCount: number;
  spotlightChallenge: {
    id: string;
    progress: number;
    title: string;
  } | null;
  stagesCompleted: number;
  totalCount: number;
};

type StageRow = Pick<ChallengeStage, "challenge_id" | "status" | "title" | "xp_reward">;

function buildStageMaps(stages: StageRow[]) {
  const completedByChallenge = new Map<string, number>();
  const totalByChallenge = new Map<string, number>();
  const nextStepByChallenge = new Map<string, { title: string; xp: number }>();

  for (const stage of stages) {
    totalByChallenge.set(stage.challenge_id, (totalByChallenge.get(stage.challenge_id) ?? 0) + 1);

    if (stage.status === "completed") {
      completedByChallenge.set(
        stage.challenge_id,
        (completedByChallenge.get(stage.challenge_id) ?? 0) + 1,
      );
    }

    if (stage.status === "active" && !nextStepByChallenge.has(stage.challenge_id)) {
      nextStepByChallenge.set(stage.challenge_id, {
        title: stage.title,
        xp: Number(stage.xp_reward),
      });
    }
  }

  return { completedByChallenge, nextStepByChallenge, totalByChallenge };
}

function enrichChallenge(
  challenge: Challenge,
  goalMeta: Map<string, { life_area: string; title: string }>,
  stageMaps: ReturnType<typeof buildStageMaps>,
): ChallengeWithMeta {
  const goal = challenge.goal_id ? goalMeta.get(challenge.goal_id) : null;
  const nextStep = stageMaps.nextStepByChallenge.get(challenge.id);

  return {
    ...(challenge as Challenge),
    completedStagesCount: stageMaps.completedByChallenge.get(challenge.id) ?? 0,
    goalTitle: goal?.title ?? null,
    lifeArea: goal?.life_area ?? null,
    nextStepTitle: nextStep?.title ?? null,
    nextStepXp: nextStep?.xp ?? null,
    totalStagesCount: stageMaps.totalByChallenge.get(challenge.id) ?? 0,
  };
}

export function resolveContinueMission(active: ChallengeWithMeta[]) {
  if (active.length === 0) {
    return null;
  }

  const withNextStep = active.filter((challenge) => challenge.nextStepTitle);
  const pool = withNextStep.length > 0 ? withNextStep : active;

  return [...pool].sort((a, b) => {
    const progressDiff = Number(a.progress) - Number(b.progress);
    if (progressDiff !== 0) {
      return progressDiff;
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  })[0];
}

function resolveSpotlightChallenge(active: ChallengeWithMeta[]) {
  const focus = resolveContinueMission(active);
  if (!focus) {
    return null;
  }

  return {
    id: focus.id,
    progress: Number(focus.progress),
    title: focus.title,
  };
}

export async function getChallengesPageData(supabase: SupabaseClient, userId: string) {
  const [
    { data: challenges, error: challengesError },
    { data: stages, error: stagesError },
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
      .select("challenge_id, title, status, xp_reward")
      .eq("user_id", userId),
    supabase.from("goals").select("id, title, life_area").eq("user_id", userId),
    supabase
      .from("challenges")
      .select("*")
      .eq("is_template", true)
      .order("is_premium", { ascending: true }),
  ]);

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  if (stagesError) {
    throw new Error(stagesError.message);
  }

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  if (templatesError) {
    throw new Error(templatesError.message);
  }

  const goalMeta = new Map(
    (goals ?? []).map((goal) => [
      goal.id,
      { life_area: goal.life_area as string, title: goal.title as string },
    ]),
  );
  const stageMaps = buildStageMaps((stages ?? []) as StageRow[]);

  const withMeta = (challenges ?? []).map((challenge) =>
    enrichChallenge(challenge as Challenge, goalMeta, stageMaps),
  );

  const active = withMeta.filter((item) => item.status === "active");
  const paused = withMeta.filter((item) => item.status === "paused");
  const completed = withMeta.filter((item) => item.status === "completed");
  const archived = withMeta.filter((item) => item.status === "archived");

  const stagesCompleted = (stages ?? []).filter((stage) => stage.status === "completed").length;
  const averageProgress =
    active.length > 0
      ? Math.round(active.reduce((sum, item) => sum + Number(item.progress), 0) / active.length)
      : 0;

  const summary: ChallengesPageSummary = {
    activeCount: active.length,
    averageProgress,
    completedCount: completed.length,
    spotlightChallenge: resolveSpotlightChallenge(active),
    stagesCompleted,
    totalCount: withMeta.length,
  };

  return {
    active,
    archived,
    completed,
    continueMission: resolveContinueMission(active),
    goals: (goals ?? []) as Array<Pick<Goal, "id" | "life_area" | "title">>,
    paused,
    summary,
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
    goals: (goals ?? []) as Array<Pick<Goal, "id" | "life_area" | "progress" | "title">>,
    linkedGoal,
    stages: (stages ?? []) as ChallengeStage[],
  };
}
