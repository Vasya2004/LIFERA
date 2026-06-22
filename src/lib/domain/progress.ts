import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate, rollingLast7Days } from "@/lib/utils/date";
import { calculateLevel } from "@/lib/domain/gamification";
import { LIFE_AREA_LABELS } from "@/lib/domain/labels";
import { getProgressHistoryCutoff, getUserPlan } from "@/lib/domain/subscription";
import type { LifeArea } from "@/lib/domain/types";
import type { PlanTier } from "@/lib/domain/types";

export type LifeAreaStatus = "rising" | "stable" | "declining";

export type ProgressLifeArea = {
  area: LifeArea;
  challengesCount: number;
  goalsCount: number;
  habitsCount: number;
  progressPercent: number;
  status: LifeAreaStatus;
  weeklyActivity: number;
  weeklyXp: number;
};

export type ProgressInsight = {
  content: string;
  title: string;
};

export type RecentProgressEvent = {
  amount: number | null;
  description: string;
  id: string;
  occurredAt: string;
  title: string;
  type: "achievement" | "habit" | "stage" | "xp";
};

export type ProgressRecommendation = {
  content: string;
  ctaHref: string;
  ctaLabel: string;
  title: string;
};

export { XP_SOURCE_LABELS } from "@/lib/domain/labels";

export const LIFE_AREA_STATUS_LABELS: Record<LifeAreaStatus, string> = {
  declining: "Проседает",
  rising: "Растёт",
  stable: "Стабильно",
};

export type ProgressData = {
  achievements: {
    nextLocked: {
      conditionHint: string;
      title: string;
    } | null;
    recentUnlocked: Array<{
      description: string;
      id: string;
      title: string;
      unlocked_at: string | null;
      xp_reward: number;
    }>;
    total: number;
    unlocked: number;
    unlockedThisWeek: number;
  };
  challenges: {
    active: number;
    averageProgress: number;
    completed: number;
    completedStagesThisWeek: number;
    items: Array<{
      id: string;
      nextStageTitle: string | null;
      progress: number;
      title: string;
    }>;
  };
  goals: {
    active: number;
    averageProgress: number;
    completed: number;
    items: Array<{
      id: string;
      life_area: string;
      progress: number;
      title: string;
    }>;
  };
  habits: {
    active: number;
    bestStreak: number;
    completedToday: number;
    completedThisWeek: number;
    completionRate: number;
    items: Array<{
      completedToday: boolean;
      id: string;
      streak_current: number;
      title: string;
      xp_reward: number;
    }>;
    weeklyXp: number;
  };
  insight: ProgressInsight;
  lifeAreas: ProgressLifeArea[];
  loadError: string | null;
  profile: {
    level: number;
    life_score: number;
    levelProgressPercent: number;
    xpToNextLevel: number;
    xp_total: number;
  };
  recentHabitLogs: Array<{
    completed_on: string;
    id: string;
    title: string;
    xp_awarded: number;
  }>;
  recentEvents: RecentProgressEvent[];
  recommendation: ProgressRecommendation;
  recentXpTransactions: Array<{
    amount: number;
    created_at: string;
    id: string;
    reason: string;
    source_type: string;
  }>;
  subscription: {
    historyDays: number | null;
    historyLimited: boolean;
    tier: PlanTier;
  };
  weekly: {
    achievementsUnlocked: number;
    challengeStagesCompleted: number;
    daily: Array<{
      achievements: number;
      date: string;
      habits: number;
      label: string;
      stages: number;
      xp: number;
    }>;
    habitCompletions: number;
    xp: number;
  };
  xp: {
    bySource: {
      achievement: number;
      challenge_stage: number;
      habit_log: number;
      other: number;
    };
    toNextLevel: number;
    total: number;
    weekly: number;
  };
};

function weekStartIsoDate() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function dayLabel(isoDate: string) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric" }).format(
    new Date(isoDate),
  );
}

export function calculateWeeklyXp(
  transactions: Array<{ amount: number; created_at: string }>,
  weekStart: string,
) {
  return transactions
    .filter((item) => item.created_at.slice(0, 10) >= weekStart)
    .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
}

export function calculateXpBySource(
  transactions: Array<{ amount: number; source_type: string }>,
) {
  const totals = {
    achievement: 0,
    challenge_stage: 0,
    habit_log: 0,
    other: 0,
  };

  for (const item of transactions) {
    const amount = Number(item.amount ?? 0);
    if (item.source_type === "challenge_stage") {
      totals.challenge_stage += amount;
    } else if (item.source_type === "habit_log") {
      totals.habit_log += amount;
    } else if (item.source_type === "achievement") {
      totals.achievement += amount;
    } else {
      totals.other += amount;
    }
  }

  return totals;
}

function lifeAreaStatus(weeklyActivity: number, progressPercent: number): LifeAreaStatus {
  if (weeklyActivity >= 2) {
    return "rising";
  }

  if (weeklyActivity === 0 && progressPercent > 0) {
    return "declining";
  }

  return "stable";
}

export function buildProgressInsight(input: {
  challenges: ProgressData["challenges"];
  goals: ProgressData["goals"];
  habits: ProgressData["habits"];
  weekly: ProgressData["weekly"];
  xpTotal: number;
}): ProgressInsight {
  const { challenges, goals, habits, weekly, xpTotal } = input;
  const hasSystem = goals.active > 0 || challenges.active > 0 || habits.active > 0;

  if (!hasSystem && xpTotal === 0) {
    return {
      content:
        "Выберите один фокус: создайте цель, запустите челлендж или добавьте небольшой ежедневный ритуал. Lifera начнёт считать динамику после первого XP.",
      title: "Сфокусируйте старт",
    };
  }

  if (habits.active > 0 && habits.completedThisWeek === 0) {
    return {
      content:
        "Ритуалы созданы, но на этой неделе без выполнений. Упростите ритуал до 5–10 минут или снизьте частоту — устойчивость важнее объёма.",
      title: "Упростите ритуал",
    };
  }

  const stalledChallenge = challenges.items.find(
    (item) => item.progress < 100 && weekly.challengeStagesCompleted === 0,
  );

  if (stalledChallenge && challenges.active > 0) {
    return {
      content: `Челлендж «${stalledChallenge.title}» без завершённых шагов на этой неделе. Следующий шаг${stalledChallenge.nextStageTitle ? ` «${stalledChallenge.nextStageTitle}»` : ""} даст XP и сдвинет прогресс.`,
      title: "Завершите ближайший шаг",
    };
  }

  if (goals.active >= 3 && goals.averageProgress < 25) {
    return {
      content:
        "Много активных целей при низком среднем прогрессе. Сфокусируйтесь на одной цели и связанном челлендже или ритуале на ближайшую неделю.",
      title: "Сузьте фокус",
    };
  }

  if (weekly.xp > 0 && (weekly.habitCompletions > 0 || weekly.challengeStagesCompleted > 0)) {
    return {
      content:
        "На этой неделе есть движение: XP, ритуалы или шаги привычек. Закрепите текущий ритм — повторяемость сильнее разовых рывков.",
      title: "Траектория стабильна",
    };
  }

  return {
    content:
      "Продолжайте связку цель → привычка или ритуал → XP. Даже небольшое ежедневное действие даёт измеримую динамику в аналитике.",
    title: "Держите темп",
  };
}

export function buildRecentProgressFeed(input: {
  recentXpTransactions: ProgressData["recentXpTransactions"];
}): RecentProgressEvent[] {
  const events: RecentProgressEvent[] = [];

  for (const transaction of input.recentXpTransactions) {
    let title = "Получен опыт";
    let type: RecentProgressEvent["type"] = "xp";

    if (transaction.source_type === "challenge_stage") {
      title = "Завершён этап";
      type = "stage";
    } else if (transaction.source_type === "habit_log") {
      title = "Выполнен ритуал";
      type = "habit";
    } else if (transaction.source_type === "achievement") {
      title = "Открыто достижение";
      type = "achievement";
    }

    events.push({
      amount: transaction.amount,
      description: transaction.reason,
      id: transaction.id,
      occurredAt: transaction.created_at,
      title,
      type,
    });
  }

  return events
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 8);
}

export function buildProgressRecommendation(input: {
  challenges: ProgressData["challenges"];
  goals: ProgressData["goals"];
  habits: ProgressData["habits"];
  lifeAreas: ProgressLifeArea[];
  weekly: ProgressData["weekly"];
}): ProgressRecommendation {
  const { challenges, goals, habits, lifeAreas, weekly } = input;

  if (weekly.xp === 0) {
    return {
      content:
        "На этой неделе пока нет активности. Вернитесь к фокусу дня и выполните одно простое действие.",
      ctaHref: "/dashboard",
      ctaLabel: "Продолжить фокус",
      title: "Начните с одного действия",
    };
  }

  if (habits.active > 0 && habits.completedThisWeek === 0) {
    return {
      content:
        "Ритуалы созданы, но на этой неделе без выполнений. Отметьте один ритуал — это даст опыт и вернёт ритм.",
      ctaHref: "/habits",
      ctaLabel: "Открыть ритуалы",
      title: "Вернитесь к ритуалам",
    };
  }

  if (challenges.active > 0 && weekly.challengeStagesCompleted === 0) {
    return {
      content:
        "Активные привычки есть, но этапы на этой неделе не завершались. Откройте привычку и закройте ближайший шаг.",
      ctaHref: "/challenges",
      ctaLabel: "Открыть привычки",
      title: "Продолжите привычку",
    };
  }

  const decliningAreas = lifeAreas.filter(
    (area) =>
      area.status === "declining" &&
      (area.goalsCount > 0 || area.challengesCount > 0 || area.habitsCount > 0),
  );
  const unevenGoals = goals.active >= 3 && goals.averageProgress < 25;

  if (decliningAreas.length >= 2 || unevenGoals) {
    return {
      content:
        "Сферы развиваются неравномерно. Сфокусируйтесь на одной цели и связанной привычки или ритуале.",
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      title: "Сбалансируйте цели",
    };
  }

  return {
    content:
      "На этой неделе система растёт. Продолжайте текущий фокус — повторяемость важнее разовых рывков.",
    ctaHref: "/dashboard",
    ctaLabel: "Продолжить фокус",
    title: "Держите темп",
  };
}

export function calculateLifeAreas(input: {
  challenges: Array<{ goal_id: string | null; id: string; life_area?: string | null }>;
  goals: Array<{ id: string; life_area: string; progress: number; status: string }>;
  habits: Array<{ life_area: string; status: string }>;
  habitLogsWeek: Array<{ habit_id: string; xp_awarded: number }>;
  stageCompletionsWeek: Array<{ challenge_id: string; xp_reward: number }>;
  habitsById: Map<string, { life_area: string }>;
  challengesById: Map<string, { goal_id: string | null }>;
  goalsById: Map<string, { life_area: string }>;
}): ProgressLifeArea[] {
  const areas = Object.keys(LIFE_AREA_LABELS) as LifeArea[];

  return areas.map((area) => {
    const areaGoals = input.goals.filter(
      (goal) => goal.life_area === area && goal.status === "active",
    );
    const areaChallenges = input.challenges.filter((challenge) => {
      if (challenge.goal_id) {
        return input.goalsById.get(challenge.goal_id)?.life_area === area;
      }

      return false;
    });
    const areaHabits = input.habits.filter(
      (habit) => habit.life_area === area && habit.status === "active",
    );

    const progressPercent =
      areaGoals.length > 0
        ? Math.round(
            areaGoals.reduce((sum, goal) => sum + Number(goal.progress ?? 0), 0) /
              areaGoals.length,
          )
        : 0;

    let weeklyActivity = 0;
    let weeklyXp = 0;

    for (const log of input.habitLogsWeek) {
      const habit = input.habitsById.get(log.habit_id);
      if (habit?.life_area === area) {
        weeklyActivity += 1;
        weeklyXp += Number(log.xp_awarded ?? 0);
      }
    }

    for (const stage of input.stageCompletionsWeek) {
      const challenge = input.challengesById.get(stage.challenge_id);
      const goalArea = challenge?.goal_id
        ? input.goalsById.get(challenge.goal_id)?.life_area
        : null;
      if (goalArea === area) {
        weeklyActivity += 1;
        weeklyXp += Number(stage.xp_reward ?? 0);
      }
    }

    return {
      area,
      challengesCount: areaChallenges.length,
      goalsCount: areaGoals.length,
      habitsCount: areaHabits.length,
      progressPercent,
      status: lifeAreaStatus(weeklyActivity, progressPercent),
      weeklyActivity,
      weeklyXp,
    };
  });
}

export async function getProgressData(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProgressData> {
  const weekStart = weekStartIsoDate();
  const today = todayIsoDate();
  const last7 = rollingLast7Days();

  const [
    profileResult,
    goalsResult,
    challengesResult,
    stagesResult,
    habitsResult,
    habitLogsResult,
    weekHabitLogsResult,
    xpResult,
    achievementsResult,
  ] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", userId).single(),
    supabase.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("is_template", false)
      .order("created_at", { ascending: false }),
    supabase.from("challenge_stages").select("*").eq("user_id", userId),
    supabase.from("habits").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("completed_on", { ascending: false })
      .limit(8),
    supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("completed_on", weekStart),
    supabase
      .from("xp_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("achievements").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
  ]);

  const firstError =
    profileResult.error?.message ??
    goalsResult.error?.message ??
    challengesResult.error?.message ??
    stagesResult.error?.message ??
    habitsResult.error?.message ??
    habitLogsResult.error?.message ??
    weekHabitLogsResult.error?.message ??
    xpResult.error?.message ??
    achievementsResult.error?.message ??
    null;

  if (profileResult.error || !profileResult.data) {
    throw new Error(firstError ?? "Profile not found.");
  }

  const profile = profileResult.data;
  const planTier = await getUserPlan(supabase, userId);
  const historyCutoff = getProgressHistoryCutoff(planTier);
  const goals = goalsResult.data ?? [];
  const challenges = (challengesResult.data ?? []).filter((item) => !item.is_template);
  const stages = stagesResult.data ?? [];
  const habits = habitsResult.data ?? [];
  const habitLogs = habitLogsResult.data ?? [];
  const weekHabitLogs = weekHabitLogsResult.data ?? [];
  const xpTransactionsRaw = xpResult.data ?? [];
  const xpTransactions = historyCutoff
    ? xpTransactionsRaw.filter((item) => item.created_at.slice(0, 10) >= historyCutoff)
    : xpTransactionsRaw;
  const achievements = achievementsResult.data ?? [];

  const xpFromLedger = xpTransactionsRaw.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  const xpTotal = Math.max(Number(profile.xp_total ?? 0), xpFromLedger);
  const levelMeta = calculateLevel(xpTotal);
  const xpWeekly = calculateWeeklyXp(xpTransactions, weekStart);
  const xpBySource = calculateXpBySource(xpTransactions);

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const activeChallenges = challenges.filter((challenge) => challenge.status === "active");
  const completedChallenges = challenges.filter((challenge) => challenge.status === "completed");
  const activeHabits = habits.filter((habit) => habit.status === "active");

  const completedStagesWeek = stages.filter(
    (stage) =>
      stage.status === "completed" &&
      stage.completed_at &&
      stage.completed_at.slice(0, 10) >= weekStart,
  );

  const habitsById = new Map(activeHabits.map((habit) => [habit.id, habit]));
  const challengesById = new Map(challenges.map((challenge) => [challenge.id, challenge]));
  const goalsById = new Map(goals.map((goal) => [goal.id, goal]));

  const todayHabitIds = new Set(
    weekHabitLogs.filter((log) => log.completed_on === today).map((log) => log.habit_id),
  );

  const habitCompletionRate =
    activeHabits.length > 0
      ? Math.min(
          100,
          Math.round((weekHabitLogs.length / Math.max(1, activeHabits.length * 7)) * 100),
        )
      : 0;

  const challengeItems = activeChallenges.slice(0, 5).map((challenge) => {
    const nextStage = stages.find(
      (stage) => stage.challenge_id === challenge.id && stage.status === "active",
    );

    return {
      id: challenge.id,
      nextStageTitle: nextStage?.title ?? null,
      progress: Number(challenge.progress ?? 0),
      title: challenge.title,
    };
  });

  const habitItems = activeHabits.slice(0, 5).map((habit) => ({
    completedToday: todayHabitIds.has(habit.id),
    id: habit.id,
    streak_current: Number(habit.streak_current ?? 0),
    title: habit.title,
    xp_reward: Number(habit.xp_reward ?? 0),
  }));

  const lifeAreas = calculateLifeAreas({
    challenges,
    challengesById,
    goals,
    goalsById,
    habitLogsWeek: weekHabitLogs,
    habits: activeHabits,
    habitsById,
    stageCompletionsWeek: completedStagesWeek,
  });

  const unlockedAchievements = achievements.filter((item) => item.status === "unlocked");
  const lockedAchievements = achievements.filter((item) => item.status === "locked");
  const recentUnlocked = [...unlockedAchievements]
    .sort((a, b) => {
      const aTime = a.unlocked_at ? new Date(a.unlocked_at).getTime() : 0;
      const bTime = b.unlocked_at ? new Date(b.unlocked_at).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  const nextLocked = lockedAchievements[0]
    ? {
        conditionHint: `${lockedAchievements[0].condition_type}: ${lockedAchievements[0].condition_value}`,
        title: lockedAchievements[0].title,
      }
    : null;

  const achievementsUnlockedWeek = unlockedAchievements.filter(
    (item) => item.unlocked_at && item.unlocked_at.slice(0, 10) >= weekStart,
  ).length;

  const daily = last7.map((date) => {
    const dayXp = xpTransactions
      .filter((item) => item.created_at.slice(0, 10) === date)
      .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
    const dayHabits = weekHabitLogs.filter((log) => log.completed_on === date).length;
    const dayStages = completedStagesWeek.filter(
      (stage) => stage.completed_at && stage.completed_at.slice(0, 10) === date,
    ).length;
    const dayAchievements = unlockedAchievements.filter(
      (item) => item.unlocked_at && item.unlocked_at.slice(0, 10) === date,
    ).length;

    return {
      achievements: dayAchievements,
      date,
      habits: dayHabits,
      label: dayLabel(date),
      stages: dayStages,
      xp: dayXp,
    };
  });

  const recentHabitLogs = (historyCutoff
    ? habitLogs.filter((log) => log.completed_on >= historyCutoff)
    : habitLogs
  ).map((log) => {
    const habit = habitsById.get(log.habit_id) ?? habits.find((item) => item.id === log.habit_id);
    return {
      completed_on: log.completed_on,
      id: log.id,
      title: habit?.title ?? "Ритуал",
      xp_awarded: Number(log.xp_awarded ?? 0),
    };
  });

  const goalsAnalytics = {
    active: activeGoals.length,
    averageProgress:
      activeGoals.length > 0
        ? Math.round(
            activeGoals.reduce((sum, goal) => sum + Number(goal.progress ?? 0), 0) /
              activeGoals.length,
          )
        : 0,
    completed: completedGoals.length,
    items: activeGoals.slice(0, 5).map((goal) => ({
      id: goal.id,
      life_area: goal.life_area,
      progress: Number(goal.progress ?? 0),
      title: goal.title,
    })),
  };

  const challengesAnalytics = {
    active: activeChallenges.length,
    averageProgress:
      activeChallenges.length > 0
        ? Math.round(
            activeChallenges.reduce((sum, item) => sum + Number(item.progress ?? 0), 0) /
              activeChallenges.length,
          )
        : 0,
    completed: completedChallenges.length,
    completedStagesThisWeek: completedStagesWeek.length,
    items: challengeItems,
  };

  const habitsAnalytics = {
    active: activeHabits.length,
    bestStreak: activeHabits.reduce(
      (max, habit) => Math.max(max, Number(habit.streak_best ?? 0)),
      0,
    ),
    completedToday: todayHabitIds.size,
    completedThisWeek: weekHabitLogs.length,
    completionRate: habitCompletionRate,
    items: habitItems,
    weeklyXp: weekHabitLogs.reduce((sum, log) => sum + Number(log.xp_awarded ?? 0), 0),
  };

  const weekly = {
    achievementsUnlocked: achievementsUnlockedWeek,
    challengeStagesCompleted: completedStagesWeek.length,
    daily,
    habitCompletions: weekHabitLogs.length,
    xp: xpWeekly,
  };

  const recentXpTransactions = xpTransactions.slice(0, 8).map((item) => ({
    amount: Number(item.amount ?? 0),
    created_at: item.created_at,
    id: item.id,
    reason: item.reason,
    source_type: item.source_type,
  }));

  const recentEvents = buildRecentProgressFeed({ recentXpTransactions });
  const recommendation = buildProgressRecommendation({
    challenges: challengesAnalytics,
    goals: goalsAnalytics,
    habits: habitsAnalytics,
    lifeAreas,
    weekly,
  });

  return {
    achievements: {
      nextLocked,
      recentUnlocked,
      total: achievements.length,
      unlocked: unlockedAchievements.length,
      unlockedThisWeek: achievementsUnlockedWeek,
    },
    challenges: challengesAnalytics,
    goals: goalsAnalytics,
    habits: habitsAnalytics,
    insight: buildProgressInsight({
      challenges: challengesAnalytics,
      goals: goalsAnalytics,
      habits: habitsAnalytics,
      weekly,
      xpTotal,
    }),
    lifeAreas,
    loadError: firstError,
    profile: {
      level: levelMeta.level,
      life_score: Number(profile.life_score ?? 0),
      levelProgressPercent: levelMeta.levelProgress,
      xpToNextLevel: levelMeta.xpToNextLevel,
      xp_total: xpTotal,
    },
    recentEvents,
    recentHabitLogs,
    recommendation,
    recentXpTransactions,
    subscription: {
      historyDays: historyCutoff ? 7 : null,
      historyLimited: Boolean(historyCutoff),
      tier: planTier,
    },
    weekly,
    xp: {
      bySource: xpBySource,
      toNextLevel: levelMeta.xpToNextLevel,
      total: xpTotal,
      weekly: xpWeekly,
    },
  };
}
