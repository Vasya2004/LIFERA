import type { SupabaseClient } from "@supabase/supabase-js";

import {
  createChallengeWithStages,
  insertStarterStagesForChallenge,
} from "@/lib/domain/challenges";
import { normalizeIntendedPlan } from "@/lib/domain/plan-catalog";
import type { PlanTier } from "@/lib/domain/types";

async function readIntendedPlan(
  supabase: SupabaseClient,
  userId: string,
): Promise<PlanTier | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("intended_plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.message.includes("intended_plan")) {
      return null;
    }

    throw new Error(error.message);
  }

  return normalizeIntendedPlan(data?.intended_plan ?? null);
}

export type OnboardingPayload = {
  challenge_title: string;
  goal_description?: string | null;
  goal_title: string;
  selected_life_areas: string[];
};

export type OnboardingResult = {
  alreadyCompleted: boolean;
  challenge: { id: string; title: string } | null;
  goal: { id: string; title: string } | null;
  intended_plan: PlanTier | null;
};

export async function completeUserOnboarding({
  payload,
  supabase,
  userId,
}: {
  payload: OnboardingPayload;
  supabase: SupabaseClient;
  userId: string;
}): Promise<OnboardingResult> {
  const lifeAreas = payload.selected_life_areas.filter(Boolean);
  const goalTitle = payload.goal_title.trim();
  const challengeTitle = payload.challenge_title.trim() || "Стартовый челлендж";

  if (!goalTitle) {
    throw new Error("Название цели обязательно.");
  }

  const { data: profile, error: profileQueryError } = await supabase
    .from("user_profiles")
    .select("onboarding_completed")
    .eq("user_id", userId)
    .single();

  if (profileQueryError) {
    throw new Error(profileQueryError.message);
  }

  if (profile.onboarding_completed) {
    return {
      alreadyCompleted: true,
      challenge: null,
      goal: null,
      intended_plan: await readIntendedPlan(supabase, userId),
    };
  }

  const { data: existingGoals, error: goalsQueryError } = await supabase
    .from("goals")
    .select("id, title, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (goalsQueryError) {
    throw new Error(goalsQueryError.message);
  }

  let goal =
    (existingGoals ?? []).find((item) => item.status === "active") ??
    (existingGoals ?? [])[0] ??
    null;

  if (!goal) {
    const { data: insertedGoal, error: goalError } = await supabase
      .from("goals")
      .insert({
        description: payload.goal_description ?? null,
        life_area: lifeAreas[0] ?? "projects",
        status: "active",
        title: goalTitle,
        user_id: userId,
      })
      .select("id, title, status")
      .single();

    if (goalError) {
      throw new Error(goalError.message);
    }

    goal = insertedGoal;
  }

  const { data: existingChallenges, error: challengesQueryError } = await supabase
    .from("challenges")
    .select("id, title, goal_id, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (challengesQueryError) {
    throw new Error(challengesQueryError.message);
  }

  let challenge =
    (existingChallenges ?? []).find((item) => item.status === "active") ??
    (existingChallenges ?? [])[0] ??
    null;

  if (!challenge) {
    const created = await createChallengeWithStages({
      description: "Первый челлендж, созданный во время onboarding.",
      goalId: goal.id,
      supabase,
      title: challengeTitle,
      userId,
    });
    challenge = { goal_id: goal.id, id: created.id, status: "active", title: created.title };
  } else {
    const { count, error: stagesCountError } = await supabase
      .from("challenge_stages")
      .select("id", { count: "exact", head: true })
      .eq("challenge_id", challenge.id)
      .eq("user_id", userId);

    if (stagesCountError) {
      throw new Error(stagesCountError.message);
    }

    if (!count) {
      await insertStarterStagesForChallenge({
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        supabase,
        userId,
      });
    }
  }

  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({
      onboarding_completed: true,
      selected_life_areas: lifeAreas.length > 0 ? lifeAreas : ["projects"],
    })
    .eq("user_id", userId);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    alreadyCompleted: false,
    challenge: { id: challenge.id, title: challenge.title },
    goal: { id: goal.id, title: goal.title },
    intended_plan: await readIntendedPlan(supabase, userId),
  };
}
