import type { SupabaseClient } from "@supabase/supabase-js";

import type { Achievement } from "@/lib/domain/types";

export type AchievementCategory = "goals" | "missions" | "progress";

export type AchievementProgressValues = {
  completed_challenges: number;
  completed_stages: number;
  goals_completed: number;
  goals_created: number;
  habit_completions: number;
  habit_streak: number;
  level_reached: number;
  life_areas_with_goals: number;
  xp_total: number;
};

export type AchievementProgressEstimate = {
  current: number;
  percent: number;
  target: number;
};

export type EnrichedAchievement = Achievement & {
  category: AchievementCategory;
  conditionText: string;
  ctaHref: string;
  ctaLabel: string;
  progress: AchievementProgressEstimate | null;
};

export type AchievementsPageSummary = {
  nextAchievementTitle: string | null;
  totalCount: number;
  unlockedCount: number;
  unlockedPercent: number;
  xpFromAchievements: number;
};

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  goals: "Цели",
  missions: "Привычки",
  progress: "Прогресс",
};

const CATEGORY_ORDER: AchievementCategory[] = ["missions", "goals", "progress"];

export function resolveAchievementCategory(conditionType: string): AchievementCategory {
  switch (conditionType) {
    case "completed_stages":
    case "challenge_stage_completed":
    case "completed_challenges":
    case "challenge_completed":
      return "missions";
    case "habit_completions":
    case "habit_completed":
    case "habit_streak":
      return "missions";
    case "goals_created":
    case "goal_created":
    case "goal_completed":
    case "life_areas_with_goals":
      return "goals";
    case "level_reached":
    case "xp_total":
      return "progress";
    default:
      return "progress";
  }
}

export function formatAchievementCondition(conditionType: string, conditionValue: number) {
  switch (conditionType) {
    case "completed_stages":
    case "challenge_stage_completed":
      return `Завершите ${conditionValue} ${
        conditionValue === 1 ? "этап привычки" : "этапов привычек"
      }.`;
    case "completed_challenges":
    case "challenge_completed":
      return conditionValue === 1
        ? "Завершите первую привычку."
        : `Завершите ${conditionValue} привычек.`;
    case "goal_completed":
      return conditionValue === 1
        ? "Завершите первую цель."
        : `Завершите ${conditionValue} целей.`;
    case "goals_created":
    case "goal_created":
      return conditionValue === 1
        ? "Создайте первую цель."
        : `Создайте ${conditionValue} целей.`;
    case "life_areas_with_goals":
      return `Создайте цели в ${conditionValue} сферах жизни.`;
    case "habit_completions":
    case "habit_completed":
      return `Выполните ${conditionValue} ${
        conditionValue === 1 ? "привычку" : "привычек"
      }.`;
    case "habit_streak":
      return `Поддерживайте серию привычки ${conditionValue} ${
        conditionValue === 1 ? "день" : "дней"
      } подряд.`;
    case "level_reached":
      return `Достигните ${conditionValue} уровня.`;
    case "xp_total":
      return `Наберите ${conditionValue} опыта.`;
    default:
      return "Продолжайте выполнять действия в Lifera.";
  }
}

export function resolveAchievementAction(conditionType: string) {
  switch (resolveAchievementCategory(conditionType)) {
    case "missions":
      return { ctaHref: "/habits", ctaLabel: "Открыть привычки" };
    case "goals":
      return { ctaHref: "/goals", ctaLabel: "Открыть цели" };
    case "progress":
    default:
      return { ctaHref: "/dashboard", ctaLabel: "Продолжить фокус" };
  }
}

function resolveProgressKey(conditionType: string) {
  switch (conditionType) {
    case "challenge_stage_completed":
      return "completed_stages";
    case "challenge_completed":
      return "completed_challenges";
    case "goal_created":
      return "goals_created";
    case "goal_completed":
      return "goals_completed";
    case "habit_completed":
      return "habit_completions";
    case "xp_total":
      return "xp_total";
    default:
      return conditionType;
  }
}

export function estimateAchievementProgress(
  conditionType: string,
  conditionValue: number,
  values: AchievementProgressValues,
): AchievementProgressEstimate | null {
  const key = resolveProgressKey(conditionType);
  const current = values[key as keyof AchievementProgressValues];

  if (typeof current !== "number" || conditionValue <= 0) {
    return null;
  }

  const percent = Math.min(100, Math.round((current / conditionValue) * 100));

  return {
    current,
    percent,
    target: conditionValue,
  };
}

export function enrichAchievement(
  achievement: Achievement,
  values: AchievementProgressValues,
): EnrichedAchievement {
  const action = resolveAchievementAction(achievement.condition_type);

  return {
    ...achievement,
    category: resolveAchievementCategory(achievement.condition_type),
    conditionText: formatAchievementCondition(
      achievement.condition_type,
      achievement.condition_value,
    ),
    ctaHref: action.ctaHref,
    ctaLabel: action.ctaLabel,
    progress: estimateAchievementProgress(
      achievement.condition_type,
      achievement.condition_value,
      values,
    ),
  };
}

export function resolveNextAchievement(
  locked: EnrichedAchievement[],
): EnrichedAchievement | null {
  const candidates = locked.filter((achievement) => !achievement.is_premium);

  if (candidates.length === 0) {
    return null;
  }

  return [...candidates].sort((a, b) => {
    const aPercent = a.progress?.percent ?? 0;
    const bPercent = b.progress?.percent ?? 0;

    if (bPercent !== aPercent) {
      return bPercent - aPercent;
    }

    return a.condition_value - b.condition_value;
  })[0];
}

export async function getAchievementProgressValues(
  supabase: SupabaseClient,
  userId: string,
): Promise<AchievementProgressValues> {
  const [
    { count: completedStages },
    { count: goalsCreated },
    { count: completedGoals },
    { count: completedChallenges },
    { count: habitCompletions },
    profileResult,
    habitsResult,
    { data: lifeAreas },
  ] = await Promise.all([
    supabase
      .from("challenge_stages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase.from("goals").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("goals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("challenges")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("habit_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("user_profiles").select("level, xp_total").eq("user_id", userId).single(),
    supabase.from("habits").select("streak_current").eq("user_id", userId).eq("status", "active"),
    supabase.from("goals").select("life_area").eq("user_id", userId),
  ]);

  return {
    completed_challenges: completedChallenges ?? 0,
    completed_stages: completedStages ?? 0,
    goals_completed: completedGoals ?? 0,
    goals_created: goalsCreated ?? 0,
    habit_completions: habitCompletions ?? 0,
    habit_streak: Math.max(
      0,
      ...(habitsResult.data ?? []).map((habit) => Number(habit.streak_current ?? 0)),
    ),
    level_reached: Number(profileResult.data?.level ?? 1),
    life_areas_with_goals: new Set((lifeAreas ?? []).map((goal) => goal.life_area)).size,
    xp_total: Number(profileResult.data?.xp_total ?? 0),
  };
}

export async function getAchievementsPageData(supabase: SupabaseClient, userId: string) {
  const [{ data: achievements, error }, progressValues] = await Promise.all([
    supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    getAchievementProgressValues(supabase, userId),
  ]);

  if (error) {
    throw new Error(error.message);
  }

  const items = (achievements ?? []).map((achievement) =>
    enrichAchievement(achievement as Achievement, progressValues),
  );

  const unlocked = items
    .filter((achievement) => achievement.status === "unlocked")
    .sort((a, b) => {
      const aTime = a.unlocked_at ? new Date(a.unlocked_at).getTime() : 0;
      const bTime = b.unlocked_at ? new Date(b.unlocked_at).getTime() : 0;
      return bTime - aTime;
    });

  const locked = items.filter(
    (achievement) => achievement.status === "locked" && !achievement.is_premium,
  );
  const premiumLocked = items.filter(
    (achievement) => achievement.status === "locked" && achievement.is_premium,
  );

  const nextAchievement = resolveNextAchievement(locked);
  const xpFromAchievements = unlocked.reduce(
    (sum, achievement) => sum + Number(achievement.xp_reward ?? 0),
    0,
  );

  const summary: AchievementsPageSummary = {
    nextAchievementTitle: nextAchievement?.title ?? null,
    totalCount: items.length,
    unlockedCount: unlocked.length,
    unlockedPercent:
      items.length > 0 ? Math.round((unlocked.length / items.length) * 100) : 0,
    xpFromAchievements,
  };

  return {
    all: items,
    locked,
    nextAchievement,
    premiumLocked,
    summary,
    unlocked,
  };
}

export function groupAchievementsByCategory(achievements: EnrichedAchievement[]) {
  return CATEGORY_ORDER.map((category) => ({
    achievements: achievements.filter((achievement) => achievement.category === category),
    category,
  })).filter((group) => group.achievements.length > 0);
}
