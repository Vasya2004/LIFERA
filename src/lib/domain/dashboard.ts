import type { SupabaseClient } from "@supabase/supabase-js";

import { calculateLevel } from "@/lib/domain/gamification";
import { buildRuleBasedRecommendation } from "@/lib/domain/ai";
import { todayIsoDate } from "@/lib/utils/date";
import type { Goal, Habit, HabitFrequency, Wish } from "@/lib/domain/types";

export type DashboardMissionStages = {
  completed: number;
  total: number;
};

export type DashboardWeeklyPulse = {
  daily: Array<{
    date: string;
    habits: number;
    isToday?: boolean;
    label: string;
    stages: number;
    xp: number;
  }>;
  habitCompletions: number;
  hasActivity: boolean;
  stagesCompleted: number;
  xp: number;
};

export type DashboardFinanceSummary =
  | { state: "empty" }
  | {
      capital: number;
      index: number;
      monthlyGoal: number | null;
      progress: number;
      state: "ready";
    };

export type DashboardHealthSummary =
  | { state: "empty" }
  | {
      activityMinutes: number;
      energy: number;
      index: number;
      recovery: number;
      sleepHours: number;
      state: "ready";
    };

export type DashboardAchievementSummary = {
  nextTitle: string | null;
  progress: number;
  total: number;
  unlocked: number;
};

export type DashboardLiferaRecommendation = {
  action: {
    href: string;
    label: string;
    reason: string;
  };
  content: string;
  title: string;
};

export type DashboardProgressSummary = {
  completedMissions: number;
  goalProgress: number;
  hasMovement: boolean;
  level: number;
  streak: number;
  unlockedAchievements: number;
  xp: number;
};

export type DashboardTodayHabit = Habit & {
  goalTitle: string | null;
};

function isHabitScheduledToday(habit: Habit, today: string) {
  const frequency = habit.frequency as HabitFrequency | null;

  if (frequency === "daily" || frequency === "custom" || !frequency) {
    return true;
  }

  const todayDay = new Date(`${today}T12:00:00`).getDay();

  if (frequency === "weekdays") {
    return todayDay >= 1 && todayDay <= 5;
  }

  if (frequency === "weekly") {
    const createdDay = new Date(`${habit.created_at.slice(0, 10)}T12:00:00`).getDay();
    return createdDay === todayDay;
  }

  return true;
}

function latestMetricValue(
  rows: Array<{ date: string; metric_type: string; value: number }>,
  type: string,
) {
  return Number(rows.find((row) => row.metric_type === type)?.value ?? 0);
}

function buildFinanceSummary(
  rows: Array<{ date: string; metric_type: string; value: number }>,
): DashboardFinanceSummary {
  if (rows.length === 0) {
    return { state: "empty" };
  }

  const savings = latestMetricValue(rows, "savings_amount");
  const target = latestMetricValue(rows, "target_amount");
  const income = latestMetricValue(rows, "monthly_income");
  const expenses = latestMetricValue(rows, "monthly_expenses");
  const progress = target > 0 ? Math.min(100, Math.round((savings / target) * 100)) : 0;
  const stability = income > 0 ? Math.max(0, Math.min(100, Math.round(((income - expenses) / income) * 100))) : 0;

  return {
    capital: savings,
    index: Math.round((progress + stability) / 2),
    monthlyGoal: target > 0 ? target : null,
    progress,
    state: "ready",
  };
}

function buildHealthSummary(
  rows: Array<{ date: string; metric_type: string; value: number }>,
): DashboardHealthSummary {
  if (rows.length === 0) {
    return { state: "empty" };
  }

  const energy = latestMetricValue(rows, "energy_level");
  const sleepHours = latestMetricValue(rows, "sleep_hours");
  const activityMinutes = latestMetricValue(rows, "activity_minutes");
  const recovery = latestMetricValue(rows, "recovery_score");
  const energyPart = (energy / 10) * 30;
  const recoveryPart = (recovery / 10) * 30;
  const sleepPart = Math.min(1, sleepHours / 8) * 25;
  const activityPart = Math.min(1, activityMinutes / 45) * 15;

  return {
    activityMinutes,
    energy,
    index: Math.round(energyPart + recoveryPart + sleepPart + activityPart),
    recovery,
    sleepHours,
    state: "ready",
  };
}

function buildAchievementSummary(
  achievements: Array<{ status: string; title: string }>,
): DashboardAchievementSummary {
  const unlocked = achievements.filter((item) => item.status === "unlocked").length;
  const next = achievements.find((item) => item.status === "locked") ?? null;
  const total = achievements.length;

  return {
    nextTitle: next?.title ?? null,
    progress: total > 0 ? Math.round((unlocked / total) * 100) : 0,
    total,
    unlocked,
  };
}

function buildDashboardRecommendation(input: {
  mainWish: Wish | null;
  primaryGoal: Goal | null;
  todayHabits: DashboardTodayHabit[];
  xpTotal: number;
}): DashboardLiferaRecommendation {
  if (!input.primaryGoal) {
    return {
      action: { href: "/goals", label: "Создать цель", reason: "missing_goal" },
      content: "Начните с одной главной цели, чтобы Lifera собрала вокруг нее привычки и фокус.",
      title: "Создайте главную цель",
    };
  }

  if (!input.mainWish) {
    return {
      action: { href: "/goals/wishes", label: "Добавить желание", reason: "missing_wish" },
      content: "Свяжите желание с целью, чтобы добавить понятный мотиватор к ежедневным действиям.",
      title: "Добавьте желание к цели",
    };
  }

  if (input.todayHabits.length === 0) {
    return {
      action: { href: "/habits", label: "Создать привычку", reason: "missing_habit" },
      content: "У цели есть мотиватор, но нет активной привычки. Добавьте привычку.",
      title: "Добавьте привычку",
    };
  }

  if (input.xpTotal > 0 && Number(input.primaryGoal.progress ?? 0) < 20) {
    return {
      action: { href: "/habits", label: "Продолжить", reason: "low_progress" },
      content: "Опыт уже есть. Вернитесь к ближайшей привычке, чтобы сдвинуть прогресс цели.",
      title: "Вернитесь к ближайшему действию",
    };
  }

  return {
    action: { href: "/habits", label: "Открыть привычку", reason: "active_habit" },
    content: `Следующий шаг: ${input.todayHabits[0]?.title ?? "выполнить активную привычку"}.`,
    title: "Продолжите активную привычку",
  };
}

export async function getDashboardData(supabase: SupabaseClient, userId: string) {
  const today = todayIsoDate();
  const [
    profileResult,
    goalsResult,
    challengesResult,
    achievementsResult,
    habitsResult,
    habitLogsTodayResult,
    stagesResult,
    subscriptionResult,
    wishesResult,
    healthMetricsResult,
    financeMetricsResult,
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
      .order("created_at", { ascending: false }),
    supabase
      .from("habit_logs")
      .select("habit_id,completed_on")
      .eq("user_id", userId)
      .eq("completed_on", today),
    supabase
      .from("challenge_stages")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("order_index", { ascending: true }),
    supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("wishes")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "archived")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("health_metrics")
      .select("date,metric_type,value")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(4),
    supabase
      .from("finance_metrics")
      .select("date,metric_type,value")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(4),
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

  const explicitPrimaryGoal =
    typeof profile.primary_goal_id === "string"
      ? activeGoals.find((goal) => goal.id === profile.primary_goal_id) ?? null
      : null;
  const primaryGoal =
    explicitPrimaryGoal ??
    activeGoals.find((goal) => goal.id === primaryChallenge?.goal_id) ??
    [...activeGoals].sort((a, b) => Number(a.progress) - Number(b.progress))[0] ??
    null;
  const wishes = (wishesResult.data ?? []) as Wish[];
  const mainWish =
    wishes.find((wish) => wish.is_primary) ??
    wishes.find((wish) => wish.linked_goal_id === primaryGoal?.id) ??
    null;
  const activeHabits = (habitsResult.data ?? []) as Habit[];
  const aiRecommendation = await buildRuleBasedRecommendation(supabase, userId, {
    goals: activeGoals,
    challenges: activeChallenges,
    habits: activeHabits,
  });
  const todayHabits: DashboardTodayHabit[] = activeHabits
    .filter((habit) => isHabitScheduledToday(habit, today))
    .map((habit) => ({
      ...habit,
      goalTitle: activeGoals.find((goal) => goal.id === habit.linked_goal_id)?.title ?? null,
    }));
  const linkedPrimaryGoalHabits = primaryGoal
    ? todayHabits.filter((habit) => habit.linked_goal_id === primaryGoal.id)
    : [];
  const nextMission = todayHabits.find(
    (habit) => !(habitLogsTodayResult.data ?? []).some((log) => log.habit_id === habit.id),
  ) ?? todayHabits[0] ?? activeHabits[0] ?? null;
  const financeSummary = buildFinanceSummary(financeMetricsResult.data ?? []);
  const healthSummary = buildHealthSummary(healthMetricsResult.data ?? []);
  const achievementsSummary = buildAchievementSummary(achievementsResult.data ?? []);
  const completedMissions = (habitLogsTodayResult.data ?? []).length;
  const streak = activeHabits.reduce(
    (max, habit) => Math.max(max, Number(habit.streak_current ?? 0)),
    0,
  );
  const progressSummary: DashboardProgressSummary = {
    completedMissions,
    goalProgress: Number(primaryGoal?.progress ?? 0),
    hasMovement:
      Number(profile.xp_total ?? 0) > 0 ||
      completedMissions > 0 ||
      achievementsSummary.unlocked > 0 ||
      Number(primaryGoal?.progress ?? 0) > 0,
    level: Number(levelMeta.level ?? profile.level ?? 1),
    streak,
    unlockedAchievements: achievementsSummary.unlocked,
    xp: Number(profile.xp_total ?? 0),
  };
  const liferaRecommendation = buildDashboardRecommendation({
    mainWish,
    primaryGoal,
    todayHabits,
    xpTotal: Number(profile.xp_total ?? 0),
  });
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
    activeHabits,
    activeMissions: todayHabits,
    aiRecommendation,
    achievementsSummary,
    financeSummary,
    habitLogsToday: habitLogsTodayResult.data ?? [],
    healthSummary,
    liferaRecommendation,
    mainWish,
    nextStage,
    nextMission,
    primaryChallenge,
    primaryGoal,
    progressSummary,
    profile: { ...profile, ...levelMeta },
    recentUnlockedAchievements,
    subscription: subscriptionResult.data ?? null,
    linkedPrimaryGoalHabits,
    todayHabits,
    todayMissions: todayHabits,
    userLevel: progressSummary.level,
    xp: progressSummary.xp,
    streak: progressSummary.streak,
  };
}
