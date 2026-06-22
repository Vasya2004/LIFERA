import type { SupabaseClient } from "@supabase/supabase-js";

import { awardXpOnce } from "@/lib/domain/gamification";
import { createHabit } from "@/lib/domain/habits";
import { normalizeIntendedPlan } from "@/lib/domain/plan-catalog";
import type { HabitFrequency, LifeArea, PlanTier } from "@/lib/domain/types";

const DEFAULT_LIFE_AREA: LifeArea = "projects";
const STARTER_XP = 50;

const LIFE_AREA_VALUES = new Set<LifeArea>([
  "career",
  "health",
  "finance",
  "education",
  "relationships",
  "creativity",
  "projects",
  "skills",
]);

const HEALTH_ZONE_VALUES = new Set([
  "neck",
  "back",
  "shoulders",
  "arms",
  "knees",
  "feet",
  "head",
  "lower_back",
]);

const DISCOMFORT_LEVEL_VALUES = new Set(["light", "medium", "strong"]);
const HABIT_FREQUENCY_VALUES = new Set<HabitFrequency>(["daily", "weekdays", "weekly", "custom"]);

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

function normalizeLifeArea(value: string | undefined): LifeArea {
  return LIFE_AREA_VALUES.has(value as LifeArea) ? (value as LifeArea) : DEFAULT_LIFE_AREA;
}

function normalizeFrequency(value: string | undefined): HabitFrequency {
  return HABIT_FREQUENCY_VALUES.has(value as HabitFrequency) ? (value as HabitFrequency) : "daily";
}

function normalizeHealthZone(value: string | undefined) {
  return value && HEALTH_ZONE_VALUES.has(value) ? value : null;
}

function normalizeDiscomfortLevel(value: string | undefined) {
  return value && DISCOMFORT_LEVEL_VALUES.has(value) ? value : null;
}

function cleanOptionalString(value: string | null | undefined, maxLength = 500) {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export type OnboardingPayload = {
  achievement_category?: string | null;
  achievement_description?: string | null;
  achievement_title?: string | null;
  goal_description?: string | null;
  goal_life_area?: string;
  goal_target_date?: string | null;
  goal_title: string;
  habit_frequency?: string;
  habit_title?: string | null;
  habit_xp_reward?: number;
  health_comment?: string | null;
  health_discomfort_level?: string;
  health_zone?: string;
  selected_life_areas?: string[];
};

export type OnboardingResult = {
  achievement: { id: string; title: string } | null;
  alreadyCompleted: boolean;
  goal: { id: string; title: string } | null;
  habit: { id: string; title: string } | null;
  healthProblemZone: { id: string; body_zone: string } | null;
  intended_plan: PlanTier | null;
  xpAwarded: number;
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
  const goalTitle = payload.goal_title.trim();
  const goalLifeArea = normalizeLifeArea(payload.goal_life_area ?? payload.selected_life_areas?.[0]);
  const habitTitle = cleanOptionalString(payload.habit_title, 120);
  const habitFrequency = normalizeFrequency(payload.habit_frequency);
  const habitXpReward = Math.min(50, Math.max(5, Number(payload.habit_xp_reward ?? 10)));
  const healthZone = normalizeHealthZone(payload.health_zone);
  const discomfortLevel = normalizeDiscomfortLevel(payload.health_discomfort_level);
  const achievementTitle =
    cleanOptionalString(payload.achievement_title, 120) ?? "Сформулировал первую цель";

  if (goalTitle.length < 3) {
    throw new Error("Название цели должно быть не короче 3 символов.");
  }

  if (!habitTitle || habitTitle.length < 3) {
    throw new Error("Название привычки должно быть не короче 3 символов.");
  }

  if (!healthZone) {
    throw new Error("Выберите проблемную зону здоровья.");
  }

  if (!discomfortLevel) {
    throw new Error("Выберите уровень дискомфорта.");
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
      achievement: null,
      alreadyCompleted: true,
      goal: null,
      habit: null,
      healthProblemZone: null,
      intended_plan: await readIntendedPlan(supabase, userId),
      xpAwarded: 0,
    };
  }

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .insert({
      description: cleanOptionalString(payload.goal_description, 1000),
      life_area: goalLifeArea,
      status: "active",
      target_date: cleanOptionalString(payload.goal_target_date, 20),
      title: goalTitle,
      user_id: userId,
    })
    .select("id,title")
    .single();

  if (goalError) {
    throw new Error("Не удалось создать первую цель.");
  }

  const habit = await createHabit(supabase, userId, {
    frequency: habitFrequency,
    life_area: goalLifeArea,
    linked_goal_id: goal.id,
    title: habitTitle,
    xp_reward: habitXpReward,
  });

  const { data: healthProblemZone, error: healthProblemError } = await supabase
    .from("health_problem_zones")
    .insert({
      body_zone: healthZone,
      comment: cleanOptionalString(payload.health_comment, 500),
      discomfort_level: discomfortLevel,
      user_id: userId,
    })
    .select("id,body_zone")
    .single();

  if (healthProblemError) {
    throw new Error("Не удалось сохранить проблемную зону здоровья.");
  }

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .insert({
      category: cleanOptionalString(payload.achievement_category, 80) ?? "Личное",
      condition_type: "personal_onboarding",
      condition_value: 1,
      description:
        cleanOptionalString(payload.achievement_description, 500) ??
        "Создал первую систему развития в Lifera.",
      importance: "ordinary",
      is_premium: false,
      status: "unlocked",
      title: achievementTitle,
      unlocked_at: new Date().toISOString(),
      user_id: userId,
      xp_reward: STARTER_XP,
    })
    .select("id,title")
    .single();

  if (achievementError) {
    throw new Error("Не удалось сохранить первое достижение.");
  }

  const xp = await awardXpOnce({
    amount: STARTER_XP,
    reason: "Стартовая настройка Lifera",
    sourceId: achievement.id,
    sourceType: "onboarding",
    supabase,
    userId,
  });

  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
      primary_goal_id: goal.id,
      selected_life_areas: [goalLifeArea],
    })
    .eq("user_id", userId);

  if (profileError) {
    throw new Error("Не удалось завершить настройку профиля.");
  }

  return {
    achievement: { id: achievement.id, title: achievement.title },
    alreadyCompleted: false,
    goal: { id: goal.id, title: goal.title },
    habit: { id: habit.id, title: habit.title },
    healthProblemZone: {
      body_zone: healthProblemZone.body_zone,
      id: healthProblemZone.id,
    },
    intended_plan: await readIntendedPlan(supabase, userId),
    xpAwarded: xp.awarded ? STARTER_XP : 0,
  };
}
