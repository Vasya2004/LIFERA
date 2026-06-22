import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate } from "@/lib/utils/date";
import { buildRuleBasedRecommendation } from "@/lib/domain/ai";
import { resolveRecommendationAction } from "@/lib/domain/dashboard-focus";
import { calculateLifeAreas } from "@/lib/domain/progress";

export type AssistantSnapshot = {
  activeChallenges: number;
  activeGoals: number;
  activeLifeAreas: number;
  ritualsToday: number;
  ritualsTotal: number;
  unlockedAchievements: number;
  weeklyXp: number;
};

export type AssistantMainRecommendation = {
  ctaHref: string;
  ctaLabel: string;
  effect: string;
  reason: string;
  recommendation: string;
  title: string;
};

export type AssistantRecommendationPriority = "high" | "low" | "medium";

export type AssistantRecommendationCard = {
  category: "achievements" | "focus" | "life_areas" | "missions";
  categoryLabel: string;
  ctaHref: string;
  ctaLabel: string;
  explanation: string;
  id: string;
  priority: AssistantRecommendationPriority;
  title: string;
};

export type AssistantAttentionArea = {
  ctaHref?: string;
  ctaLabel?: string;
  id: string;
  message: string;
  tone: "positive" | "warning";
};

export type AssistantPageData = {
  advancedAiEnabled: boolean;
  attentionAreas: AssistantAttentionArea[];
  cards: AssistantRecommendationCard[];
  mainRecommendation: AssistantMainRecommendation;
  snapshot: AssistantSnapshot;
};

const CATEGORY_LABELS: Record<AssistantRecommendationCard["category"], string> = {
  focus: "Фокус",
  achievements: "Достижения",
  life_areas: "Сферы жизни",
  missions: "Привычки",
};

function weekStartIsoDate() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export function resolveAssistantAction(input: {
  hasActiveChallenges: boolean;
  hasActiveGoals: boolean;
  hasActiveHabits: boolean;
  weeklyChallengeStages: number;
  weeklyHabitCompletions: number;
  weeklyXp: number;
}) {
  if (input.weeklyXp === 0) {
    return { ctaHref: "/dashboard", ctaLabel: "Продолжить фокус" };
  }

  if (input.hasActiveHabits && input.weeklyHabitCompletions === 0) {
    return { ctaHref: "/habits", ctaLabel: "Открыть привычки" };
  }

  if (input.hasActiveChallenges && input.weeklyChallengeStages === 0) {
    return { ctaHref: "/dashboard", ctaLabel: "Продолжить фокус" };
  }

  if (input.hasActiveGoals && !input.hasActiveChallenges) {
    return { ctaHref: "/goals", ctaLabel: "Открыть цели" };
  }

  return { ctaHref: "/dashboard", ctaLabel: "Продолжить фокус" };
}

export function buildAssistantMainRecommendation(input: {
  activeChallenges: number;
  activeGoals: number;
  activeHabits: number;
  averageGoalProgress: number;
  decliningLifeAreas: number;
  ruleRecommendation: Awaited<ReturnType<typeof buildRuleBasedRecommendation>>;
  weeklyChallengeStages: number;
  weeklyHabitCompletions: number;
  weeklyXp: number;
}): AssistantMainRecommendation {
  if (input.weeklyXp === 0) {
    return {
      ctaHref: "/dashboard",
      ctaLabel: "Продолжить фокус",
      effect: "Вы снова запустите цикл опыта и прогресса.",
      reason: "На этой неделе пока нет активности.",
      recommendation: "Вернитесь к одному простому действию.",
      title: "Начните с одного действия",
    };
  }

  if (input.weeklyHabitCompletions === 0 && input.activeHabits > 0) {
    return {
      ctaHref: "/habits",
      ctaLabel: "Открыть привычки",
      effect: "Привычки вернут регулярность и стабильный опыт.",
      reason: "Привычки созданы, но на этой неделе без выполнений.",
      recommendation: "Отметьте одну привычку сегодня.",
      title: "Вернитесь к привычкам",
    };
  }

  if (input.activeChallenges > 0 && input.weeklyChallengeStages === 0) {
    return {
      ctaHref: "/dashboard",
      ctaLabel: "Продолжить фокус",
      effect: "Завершение этапа сдвинет привычку и связанные цели.",
      reason: "Активные привычки есть, но этапы на этой неделе не завершались.",
      recommendation: "Продолжите ближайшее действие на главной.",
      title: "Продолжите привычку",
    };
  }

  if (input.activeGoals >= 3 && input.averageGoalProgress < 25) {
    return {
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      effect: "Один фокус даст более заметный прогресс по системе.",
      reason: "Много активных целей при низком среднем прогрессе.",
      recommendation: "Сузьте фокус до одной цели и регулярной привычки.",
      title: "Сбалансируйте цели",
    };
  }

  if (input.decliningLifeAreas >= 2) {
    return {
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      effect: "Баланс сфер сделает прогресс устойчивее.",
      reason: "Несколько сфер жизни проседают по активности.",
      recommendation: "Выберите одну сферу и усилите её привычкой.",
      title: "Усильте сферы жизни",
    };
  }

  const dashboardAction = resolveRecommendationAction(input.ruleRecommendation);

  return {
    ctaHref: dashboardAction.href,
    ctaLabel: dashboardAction.label,
    effect: "Повторяемость важнее разовых рывков — закрепите текущий ритм.",
    reason: dashboardAction.reason,
    recommendation: input.ruleRecommendation.content,
    title: input.ruleRecommendation.title,
  };
}

function priorityRank(priority: AssistantRecommendationPriority) {
  return priority === "high" ? 0 : priority === "medium" ? 1 : 2;
}

export function buildAssistantRecommendations(input: {
  activeChallenges: number;
  activeGoals: number;
  activeHabits: number;
  activeLifeAreas: number;
  decliningLifeAreas: number;
  unlockedAchievements: number;
  weeklyChallengeStages: number;
  weeklyHabitCompletions: number;
  weeklyXp: number;
}): AssistantRecommendationCard[] {
  const cards: AssistantRecommendationCard[] = [];

  cards.push({
    category: "focus",
    categoryLabel: CATEGORY_LABELS.focus,
    ctaHref: input.weeklyXp > 0 ? "/dashboard" : "/dashboard",
    ctaLabel: "Продолжить фокус",
    explanation:
      input.weeklyXp > 0
        ? `На этой неделе уже ${input.weeklyXp} опыта — продолжайте текущий фокус.`
        : "На этой неделе пока нет активности — начните с одного действия.",
    id: "focus",
    priority: input.weeklyXp === 0 ? "high" : "medium",
    title: input.weeklyXp > 0 ? "Фокус работает" : "Нужен старт недели",
  });

  cards.push({
    category: "missions",
    categoryLabel: CATEGORY_LABELS.missions,
    ctaHref: "/habits",
    ctaLabel: "Открыть привычки",
    explanation:
      input.activeHabits === 0
        ? "Привычки не созданы — добавьте короткое регулярное действие."
        : input.weeklyHabitCompletions === 0
          ? "Привычки есть, но на этой неделе без выполнений."
          : `Выполнено ${input.weeklyHabitCompletions} привычек за неделю.`,
    id: "rituals",
    priority:
      input.activeHabits === 0 || input.weeklyHabitCompletions === 0 ? "high" : "low",
    title: "Привычки",
  });

  cards.push({
    category: "missions",
    categoryLabel: CATEGORY_LABELS.missions,
    ctaHref: "/dashboard",
    ctaLabel: "Продолжить фокус",
    explanation:
      input.activeChallenges === 0
        ? "Нет активного плана — начните с цели или регулярной привычки."
        : input.weeklyChallengeStages === 0
          ? "Привычки активны, но этапы на этой неделе не завершались."
          : `Завершено ${input.weeklyChallengeStages} этапов за неделю.`,
    id: "missions",
    priority:
      input.activeChallenges === 0 || input.weeklyChallengeStages === 0 ? "high" : "medium",
    title: "Привычки",
  });

  cards.push({
    category: "achievements",
    categoryLabel: CATEGORY_LABELS.achievements,
    ctaHref: "/achievements",
    ctaLabel: "Открыть достижения",
    explanation:
      input.unlockedAchievements === 0
        ? "Достижения ещё не открыты — первая привычка запустит вехи."
        : `Открыто ${input.unlockedAchievements} достижений — система фиксирует рост.`,
    id: "achievements",
    priority: input.unlockedAchievements === 0 ? "medium" : "low",
    title: "Достижения",
  });

  if (input.decliningLifeAreas > 0 || input.activeLifeAreas > 0) {
    cards.push({
      category: "life_areas",
      categoryLabel: CATEGORY_LABELS.life_areas,
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      explanation:
        input.decliningLifeAreas > 0
          ? `${input.decliningLifeAreas} сфер проседают — усилите одну из них.`
          : `Активность в ${input.activeLifeAreas} сферах жизни.`,
      id: "life_areas",
      priority: input.decliningLifeAreas > 0 ? "high" : "low",
      title: "Сферы жизни",
    });
  }

  return cards
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 4);
}

export function buildAttentionAreas(input: {
  activeChallenges: number;
  activeGoals: number;
  activeHabits: number;
  decliningLifeAreas: number;
  financeEntries: number;
  healthEntries: number;
  skillsCount: number;
  unlockedAchievements: number;
  weeklyHabitCompletions: number;
  weeklyXp: number;
}): AssistantAttentionArea[] {
  const areas: AssistantAttentionArea[] = [];

  if (input.activeGoals === 0) {
    areas.push({
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      id: "no-goals",
      message: "Нет активных целей — системе не на что опираться.",
      tone: "warning",
    });
  }

  if (input.activeChallenges === 0) {
    areas.push({
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      id: "no-challenges",
      message: "Нет активного плана цели — движение может стоять.",
      tone: "warning",
    });
  }

  if (input.activeHabits === 0) {
    areas.push({
      ctaHref: "/habits",
      ctaLabel: "Открыть привычки",
      id: "no-habits",
      message: "Нет привычек — регулярность не отслеживается.",
      tone: "warning",
    });
  }

  if (input.weeklyXp === 0) {
    areas.push({
      ctaHref: "/dashboard",
      ctaLabel: "Продолжить фокус",
      id: "no-weekly-xp",
      message: "На этой неделе пока нет опыта.",
      tone: "warning",
    });
  }

  if (input.activeHabits > 0 && input.weeklyHabitCompletions === 0) {
    areas.push({
      ctaHref: "/habits",
      ctaLabel: "Открыть привычки",
      id: "weak-rituals",
      message: "Слабая регулярность привычек на этой неделе.",
      tone: "warning",
    });
  }

  if (input.unlockedAchievements === 0) {
    areas.push({
      ctaHref: "/achievements",
      ctaLabel: "Открыть достижения",
      id: "no-achievements",
      message: "Достижения ещё не открыты.",
      tone: "warning",
    });
  }

  if (input.skillsCount === 0) {
    areas.push({
      ctaHref: "/skills",
      ctaLabel: "Открыть навыки",
      id: "empty-skills",
      message: "Ветка навыков пока пустая.",
      tone: "warning",
    });
  }

  if (input.healthEntries === 0) {
    areas.push({
      ctaHref: "/health",
      ctaLabel: "Открыть здоровье",
      id: "empty-health",
      message: "Ветка здоровья пока без записей.",
      tone: "warning",
    });
  }

  if (input.financeEntries === 0) {
    areas.push({
      ctaHref: "/finance",
      ctaLabel: "Открыть финансы",
      id: "empty-finance",
      message: "Финансовая ветка пока без данных.",
      tone: "warning",
    });
  }

  if (areas.length === 0) {
    return [
      {
        id: "stable",
        message: "Система развивается стабильно. Продолжайте текущий фокус.",
        tone: "positive",
      },
    ];
  }

  return areas.slice(0, 6);
}

export async function getAssistantPageData(
  supabase: SupabaseClient,
  userId: string,
): Promise<AssistantPageData> {
  const weekStart = weekStartIsoDate();
  const today = todayIsoDate();

  const [
    goalsResult,
    challengesResult,
    habitsResult,
    weekHabitLogsResult,
    todayHabitLogsResult,
    xpWeekResult,
    achievementsResult,
    weekCompletedStagesResult,
    skillsResult,
    healthResult,
    financeResult,
  ] = await Promise.all([
    supabase.from("goals").select("*").eq("user_id", userId),
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("is_template", false),
    supabase.from("habits").select("*").eq("user_id", userId).eq("status", "active"),
    supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("completed_on", weekStart),
    supabase
      .from("habit_logs")
      .select("habit_id")
      .eq("user_id", userId)
      .eq("completed_on", today),
    supabase
      .from("xp_transactions")
      .select("amount,created_at")
      .eq("user_id", userId)
      .gte("created_at", `${weekStart}T00:00:00`),
    supabase.from("achievements").select("*").eq("user_id", userId),
    supabase
      .from("challenge_stages")
      .select("id,challenge_id,xp_reward,completed_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .gte("completed_at", `${weekStart}T00:00:00`),
    supabase.from("skills").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase
      .from("health_metrics")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("finance_metrics")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const goals = goalsResult.data ?? [];
  const challenges = (challengesResult.data ?? []).filter((item) => !item.is_template);
  const habits = habitsResult.data ?? [];
  const weekHabitLogs = weekHabitLogsResult.data ?? [];
  const todayHabitIds = new Set((todayHabitLogsResult.data ?? []).map((log) => log.habit_id));
  const achievements = achievementsResult.data ?? [];
  const completedStagesWeek = weekCompletedStagesResult.data ?? [];

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const activeChallenges = challenges.filter((challenge) => challenge.status === "active");
  const ruleRecommendation = await buildRuleBasedRecommendation(supabase, userId, {
    goals: activeGoals,
    challenges: activeChallenges,
    habits,
  });
  const unlockedAchievements = achievements.filter((item) => item.status === "unlocked");
  const weeklyXp = (xpWeekResult.data ?? []).reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0,
  );

  const habitsById = new Map(habits.map((habit) => [habit.id, habit]));
  const challengesById = new Map(challenges.map((challenge) => [challenge.id, challenge]));
  const goalsById = new Map(goals.map((goal) => [goal.id, goal]));

  const lifeAreas = calculateLifeAreas({
    challenges,
    challengesById,
    goals,
    goalsById,
    habitLogsWeek: weekHabitLogs,
    habits,
    habitsById,
    stageCompletionsWeek: completedStagesWeek,
  });

  const decliningLifeAreas = lifeAreas.filter((area) => area.status === "declining").length;
  const activeLifeAreas = lifeAreas.filter(
    (area) => area.weeklyActivity > 0 || area.goalsCount > 0 || area.habitsCount > 0,
  ).length;

  const averageGoalProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((sum, goal) => sum + Number(goal.progress ?? 0), 0) /
            activeGoals.length,
        )
      : 0;

  const snapshot: AssistantSnapshot = {
    activeChallenges: activeChallenges.length,
    activeGoals: activeGoals.length,
    activeLifeAreas,
    ritualsToday: todayHabitIds.size,
    ritualsTotal: habits.length,
    unlockedAchievements: unlockedAchievements.length,
    weeklyXp,
  };

  const mainRecommendation = buildAssistantMainRecommendation({
    activeChallenges: activeChallenges.length,
    activeGoals: activeGoals.length,
    activeHabits: habits.length,
    averageGoalProgress,
    decliningLifeAreas,
    ruleRecommendation,
    weeklyChallengeStages: completedStagesWeek.length,
    weeklyHabitCompletions: weekHabitLogs.length,
    weeklyXp,
  });

  const cards = buildAssistantRecommendations({
    activeChallenges: activeChallenges.length,
    activeGoals: activeGoals.length,
    activeHabits: habits.length,
    activeLifeAreas,
    decliningLifeAreas,
    unlockedAchievements: unlockedAchievements.length,
    weeklyChallengeStages: completedStagesWeek.length,
    weeklyHabitCompletions: weekHabitLogs.length,
    weeklyXp,
  });

  const attentionAreas = buildAttentionAreas({
    activeChallenges: activeChallenges.length,
    activeGoals: activeGoals.length,
    activeHabits: habits.length,
    decliningLifeAreas,
    financeEntries: financeResult.count ?? 0,
    healthEntries: healthResult.count ?? 0,
    skillsCount: skillsResult.count ?? 0,
    unlockedAchievements: unlockedAchievements.length,
    weeklyHabitCompletions: weekHabitLogs.length,
    weeklyXp,
  });

  return {
    advancedAiEnabled: Boolean(process.env.OPENAI_API_KEY?.trim()),
    attentionAreas,
    cards,
    mainRecommendation,
    snapshot,
  };
}

export const ASSISTANT_PRIORITY_LABELS: Record<AssistantRecommendationPriority, string> = {
  high: "Высокий",
  low: "Низкий",
  medium: "Средний",
};
