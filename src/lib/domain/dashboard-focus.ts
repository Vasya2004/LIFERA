import type { Challenge, ChallengeStage, Goal, Habit } from "@/lib/domain/types";

export type DashboardFocusMission = {
  challengeId: string;
  challengeTitle: string;
  goalTitle: string | null;
  kind: "mission";
  stageDescription: string | null;
  stageTitle: string;
  xpReward: number;
};

export type DashboardFocusRitual = {
  challengeTitle: string | null;
  goalTitle: string | null;
  habitId: string;
  habitTitle: string;
  kind: "ritual";
  streak: number;
  xpReward: number;
};

export type DashboardFocusStart = {
  kind: "start";
};

export type DashboardFocus =
  | DashboardFocusMission
  | DashboardFocusRitual
  | DashboardFocusStart;

type ResolveFocusInput = {
  activeChallenges: Challenge[];
  activeGoals: Goal[];
  activeHabits: Habit[];
  completedTodayHabitIds: Set<string>;
  nextStage: ChallengeStage | null;
  primaryChallenge: Challenge | null;
  primaryGoal: Goal | null;
};

export function resolveDashboardFocus({
  activeChallenges,
  activeGoals,
  activeHabits,
  completedTodayHabitIds,
  nextStage,
  primaryChallenge,
  primaryGoal,
}: ResolveFocusInput): DashboardFocus {
  if (nextStage && primaryChallenge) {
    return {
      challengeId: primaryChallenge.id,
      challengeTitle: primaryChallenge.title,
      goalTitle: primaryGoal?.title ?? null,
      kind: "mission",
      stageDescription: nextStage.description,
      stageTitle: nextStage.title,
      xpReward: Number(nextStage.xp_reward ?? 0),
    };
  }

  const incompleteHabit = activeHabits.find((habit) => !completedTodayHabitIds.has(habit.id));

  if (incompleteHabit) {
    const linkedGoal = incompleteHabit.linked_goal_id
      ? activeGoals.find((goal) => goal.id === incompleteHabit.linked_goal_id)
      : null;
    const linkedChallenge = incompleteHabit.linked_challenge_id
      ? activeChallenges.find((challenge) => challenge.id === incompleteHabit.linked_challenge_id)
      : null;

    return {
      challengeTitle: linkedChallenge?.title ?? null,
      goalTitle: linkedGoal?.title ?? null,
      habitId: incompleteHabit.id,
      habitTitle: incompleteHabit.title,
      kind: "ritual",
      streak: Number(incompleteHabit.streak_current ?? 0),
      xpReward: Number(incompleteHabit.xp_reward ?? 0),
    };
  }

  return { kind: "start" };
}

export type DashboardRecommendationAction = {
  href: string;
  label: string;
  reason: string;
};

type RecommendationInput = {
  content: string;
  source_challenge_id?: string | null;
  source_goal_id?: string | null;
  source_habit_id?: string | null;
  title: string;
  type: string;
};

export function resolveRecommendationAction(
  recommendation: RecommendationInput,
): DashboardRecommendationAction {
  const { content, source_challenge_id, type } = recommendation;

  switch (type) {
    case "habit_start":
    case "habit_recovery":
    case "habit_momentum":
    case "habit_link":
      return {
        href: "/habits",
        label: "Перейти к привычкам",
        reason: "Рекомендация основана на ваших целях и регулярности привычек.",
      };
    case "next_step":
      return {
        href: "/dashboard",
        label: "Открыть фокус дня",
        reason: source_challenge_id
          ? "Следующий шаг показан на главной без перехода в legacy-раздел."
          : "Есть активная привычка — продолжите ближайшее действие на главной.",
      };
    case "goal_analysis":
      return {
        href: "/habits",
        label: "Создать привычку",
        reason: "Цель лучше поддерживать регулярными привычками.",
      };
    default:
      if (content.includes("прогресс") || content.includes("XP")) {
        return {
          href: "/dashboard",
          label: "Открыть главную",
          reason: "Рекомендация учитывает текущую динамику прокачки.",
        };
      }
      return {
        href: "/goals",
        label: "Создать цель",
        reason: "Начните с одной цели — Lifera построит траекторию вокруг неё.",
      };
  }
}
