import type { SupabaseClient } from "@supabase/supabase-js";

import { getGoalsWithChallenges, type GoalWithChallenges } from "@/lib/domain/goals";
import type { Challenge, GoalStatus, Wish } from "@/lib/domain/types";

export type GoalListItem = {
  goal: GoalWithChallenges;
  isPrimary: boolean;
  primaryChallenge: Challenge | null;
  linkedWish: Wish | null;
};

export type GoalsPageSummary = {
  activeCount: number;
  averageProgress: number;
  backlogCount: number;
  completedCount: number;
  primaryGoal: {
    id: string;
    progress: number;
    targetDate: string | null;
    title: string;
    wishTitle: string | null;
  } | null;
  spotlightGoal: {
    id: string;
    progress: number;
    title: string;
  } | null;
  totalCount: number;
};

function primaryChallengeForGoal(goal: GoalWithChallenges) {
  return (
    goal.linkedChallenges.find((challenge) => challenge.status === "active") ??
    goal.linkedChallenges[0] ??
    null
  );
}

function isMissingStage2Schema(error: { message?: string } | null) {
  const message = error?.message ?? "";
  return message.includes("primary_goal_id") || message.includes("wishes");
}

function toListItem(
  goal: GoalWithChallenges,
  input: { primaryGoalId: string | null; wishesByGoal: Map<string, Wish> },
): GoalListItem {
  return {
    goal,
    isPrimary: input.primaryGoalId === goal.id,
    linkedWish: input.wishesByGoal.get(goal.id) ?? null,
    primaryChallenge: primaryChallengeForGoal(goal),
  };
}

function resolveSpotlightGoal(activeGoals: GoalWithChallenges[]) {
  if (activeGoals.length === 0) {
    return null;
  }

  const withChallenge = activeGoals.filter((goal) =>
    goal.linkedChallenges.some((challenge) => challenge.status === "active"),
  );

  const pool = withChallenge.length > 0 ? withChallenge : activeGoals;
  const spotlight = [...pool].sort((a, b) => Number(a.progress) - Number(b.progress))[0];

  return {
    id: spotlight.id,
    progress: Number(spotlight.progress),
    title: spotlight.title,
  };
}

export async function getGoalsPageData(supabase: SupabaseClient, userId: string) {
  const [
    { goals, totalGoals },
    { data: profile, error: profileError },
    { data: wishes, error: wishesError },
  ] = await Promise.all([
    getGoalsWithChallenges(supabase, userId),
    supabase
      .from("user_profiles")
      .select("primary_goal_id")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("wishes")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "archived")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (profileError && !isMissingStage2Schema(profileError)) {
    throw new Error(profileError.message);
  }

  if (wishesError && !isMissingStage2Schema(wishesError)) {
    throw new Error(wishesError.message);
  }

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const backlogGoals = goals.filter((goal) => goal.status === "backlog");
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const archivedGoals = goals.filter((goal) => goal.status === "archived");
  const primaryGoalId =
    profileError || !profile ? null : ((profile.primary_goal_id as string | null | undefined) ?? null);
  const wishesList = wishesError ? [] : ((wishes ?? []) as Wish[]);
  const wishesByGoal = new Map<string, Wish>();

  for (const wish of wishesList) {
    if (wish.linked_goal_id && !wishesByGoal.has(wish.linked_goal_id)) {
      wishesByGoal.set(wish.linked_goal_id, wish);
    }
  }

  const primaryGoal =
    goals.find((goal) => goal.id === primaryGoalId) ??
    activeGoals.find((goal) => goal.status === "active") ??
    null;

  const averageProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((sum, goal) => sum + Number(goal.progress), 0) / activeGoals.length,
        )
      : 0;

  const summary: GoalsPageSummary = {
    activeCount: activeGoals.length,
    averageProgress,
    backlogCount: backlogGoals.length,
    completedCount: completedGoals.length,
    primaryGoal: primaryGoal
      ? {
          id: primaryGoal.id,
          progress: Number(primaryGoal.progress),
          targetDate: primaryGoal.target_date,
          title: primaryGoal.title,
          wishTitle: wishesByGoal.get(primaryGoal.id)?.title ?? null,
        }
      : null,
    spotlightGoal: resolveSpotlightGoal(activeGoals),
    totalCount: totalGoals,
  };

  const listContext = { primaryGoalId, wishesByGoal };

  return {
    active: activeGoals.map((goal) => toListItem(goal, listContext)),
    archived: archivedGoals.map((goal) => toListItem(goal, listContext)),
    backlog: backlogGoals.map((goal) => toListItem(goal, listContext)),
    completed: completedGoals.map((goal) => toListItem(goal, listContext)),
    summary,
    wishes: wishesList,
  };
}

export const GOALS_SECTION_LABELS: Record<GoalStatus, string> = {
  active: "Активные цели",
  archived: "Архив",
  backlog: "В планах",
  completed: "Завершённые",
};
