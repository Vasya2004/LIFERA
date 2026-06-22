import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate } from "@/lib/utils/date";
import type { Challenge, ChallengeStage, Goal, Habit, Skill, Wish } from "@/lib/domain/types";

export type GoalDetailChallenge = Challenge & {
  completedStagesCount: number;
  nextStage: ChallengeStage | null;
  stages: ChallengeStage[];
  totalStagesCount: number;
};

export type GoalDetailHabit = {
  completedToday: boolean;
  habit: Habit;
};

export type GoalDetailRecommendation = {
  ctaHref: string;
  ctaLabel: string;
  reason: string;
  title: string;
};

export type GoalDetailData = {
  activeChallenge: GoalDetailChallenge | null;
  completedStagesCount: number;
  goal: Goal | null;
  habits: GoalDetailHabit[];
  profilePrimaryGoalId: string | null;
  recommendation: GoalDetailRecommendation;
  skill: Pick<Skill, "id" | "title"> | null;
  stages: ChallengeStage[];
  totalStagesCount: number;
  wish: Wish | null;
  wishes: Wish[];
};

function isMissingWishesSchema(error: { message?: string } | null) {
  return (error?.message ?? "").includes("wishes");
}

function buildChallengesWithStages(
  challenges: Challenge[],
  stages: ChallengeStage[],
): GoalDetailChallenge[] {
  const stagesByChallenge = new Map<string, ChallengeStage[]>();

  for (const stage of stages) {
    const list = stagesByChallenge.get(stage.challenge_id) ?? [];
    list.push(stage);
    stagesByChallenge.set(stage.challenge_id, list);
  }

  return challenges.map((challenge) => {
    const challengeStages = stagesByChallenge.get(challenge.id) ?? [];
    const completedStagesCount = challengeStages.filter(
      (stage) => stage.status === "completed",
    ).length;

    return {
      ...challenge,
      completedStagesCount,
      nextStage: challengeStages.find((stage) => stage.status === "active") ?? null,
      stages: challengeStages,
      totalStagesCount: challengeStages.length,
    };
  });
}

function resolveActiveChallenge(challenges: GoalDetailChallenge[]) {
  const active = challenges.filter((challenge) => challenge.status === "active");
  const pool = active.length > 0 ? active : challenges;

  return (
    [...pool].sort((a, b) => {
      const activeDiff = Number(Boolean(b.nextStage)) - Number(Boolean(a.nextStage));
      if (activeDiff !== 0) {
        return activeDiff;
      }

      const progressDiff = Number(a.progress) - Number(b.progress);
      if (progressDiff !== 0) {
        return progressDiff;
      }

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })[0] ?? null
  );
}

function buildGoalRecommendation(input: {
  activeChallenge: GoalDetailChallenge | null;
  goal: Goal;
  habits: GoalDetailHabit[];
}) {
  const activeHabits = input.habits.filter((item) => item.habit.status === "active");
  const incompleteHabit = activeHabits.find((item) => !item.completedToday);

  if (!input.activeChallenge) {
    return {
      ctaHref: "#goal-plan",
      ctaLabel: "Открыть план цели",
      reason: "У цели пока нет плана с этапами, поэтому прогрессу не хватает явной траектории.",
      title: "Превратите цель в план",
    };
  }

  if (input.activeChallenge.nextStage) {
    return {
      ctaHref: "#goal-plan",
      ctaLabel: "Открыть этап",
      reason: `Следующий лучший шаг — завершить этап «${input.activeChallenge.nextStage.title}».`,
      title: "Продолжите план цели",
    };
  }

  if (activeHabits.length === 0) {
    return {
      ctaHref: "/habits",
      ctaLabel: "Добавить привычку",
      reason: "У цели есть план, но нет регулярной привычки, которая поддерживает движение между этапами.",
      title: "Добавьте регулярность",
    };
  }

  if (incompleteHabit) {
    return {
      ctaHref: "/habits",
      ctaLabel: "Открыть привычки",
      reason: `Сегодня ещё можно выполнить привычку «${incompleteHabit.habit.title}» и усилить цель регулярностью.`,
      title: "Закрепите прогресс сегодня",
    };
  }

  if (Number(input.goal.progress) >= 80) {
    return {
      ctaHref: "#progress",
      ctaLabel: "Проверить прогресс",
      reason: "Цель близка к завершению — проверьте прогресс и зафиксируйте финальные действия.",
      title: "Подготовьте закрытие цели",
    };
  }

  return {
    ctaHref: "/dashboard",
    ctaLabel: "Вернуться в фокус",
    reason: "План и привычки активны — продолжайте текущий темп без добавления лишних сущностей.",
    title: "Система цели собрана",
  };
}

export async function getGoalDetailData(
  supabase: SupabaseClient,
  userId: string,
  goalId: string,
): Promise<GoalDetailData> {
  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goalId)
    .eq("user_id", userId)
    .maybeSingle();

  if (goalError) {
    throw new Error(goalError.message);
  }

  if (!goal) {
    return {
      activeChallenge: null,
      completedStagesCount: 0,
      goal: null,
      habits: [],
      profilePrimaryGoalId: null,
      recommendation: {
        ctaHref: "/goals",
        ctaLabel: "Все цели",
        reason: "Цель не найдена или недоступна.",
        title: "Цель недоступна",
      },
      skill: null,
      stages: [],
      totalStagesCount: 0,
      wish: null,
      wishes: [],
    };
  }

  const [{ data: challenges, error: challengesError }, { data: habits, error: habitsError }] =
    await Promise.all([
      supabase
        .from("challenges")
        .select("*")
        .eq("user_id", userId)
        .eq("goal_id", goal.id)
        .eq("is_template", false)
        .order("created_at", { ascending: false }),
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .eq("linked_goal_id", goal.id)
        .order("created_at", { ascending: false }),
    ]);

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  if (habitsError) {
    throw new Error(habitsError.message);
  }

  const challengeRows = (challenges ?? []) as Challenge[];
  const habitRows = (habits ?? []) as Habit[];

  const [
    stagesResult,
    todayLogsResult,
    skillResult,
    wishResult,
    wishesResult,
    profileResult,
  ] = await Promise.all([
    challengeRows.length > 0
      ? supabase
          .from("challenge_stages")
          .select("*")
          .eq("user_id", userId)
          .in(
            "challenge_id",
            challengeRows.map((challenge) => challenge.id),
          )
          .order("order_index", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
    habitRows.length > 0
      ? supabase
          .from("habit_logs")
          .select("habit_id")
          .eq("user_id", userId)
          .eq("completed_on", todayIsoDate())
          .in(
            "habit_id",
            habitRows.map((habit) => habit.id),
          )
      : Promise.resolve({ data: [], error: null }),
    goal.skill_id
      ? supabase
          .from("skills")
          .select("id,title")
          .eq("user_id", userId)
          .eq("id", goal.skill_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("wishes")
      .select("*")
      .eq("user_id", userId)
      .eq("linked_goal_id", goal.id)
      .neq("status", "archived")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("wishes")
      .select("*")
      .eq("user_id", userId)
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
    supabase
      .from("user_profiles")
      .select("primary_goal_id")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (stagesResult.error) {
    throw new Error(stagesResult.error.message);
  }

  if (todayLogsResult.error) {
    throw new Error(todayLogsResult.error.message);
  }

  if (skillResult.error) {
    throw new Error(skillResult.error.message);
  }

  if (wishResult.error && !isMissingWishesSchema(wishResult.error)) {
    throw new Error(wishResult.error.message);
  }

  if (wishesResult.error && !isMissingWishesSchema(wishesResult.error)) {
    throw new Error(wishesResult.error.message);
  }

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  const stages = (stagesResult.data ?? []) as ChallengeStage[];
  const completedTodayIds = new Set((todayLogsResult.data ?? []).map((log) => log.habit_id));
  const habitsWithCompletion = habitRows.map((habit) => ({
    completedToday: completedTodayIds.has(habit.id),
    habit,
  }));
  const challengesWithStages = buildChallengesWithStages(challengeRows, stages);
  const activeChallenge = resolveActiveChallenge(challengesWithStages);

  return {
    activeChallenge,
    completedStagesCount: stages.filter((stage) => stage.status === "completed").length,
    goal: goal as Goal,
    habits: habitsWithCompletion,
    profilePrimaryGoalId:
      typeof profileResult.data?.primary_goal_id === "string"
        ? profileResult.data.primary_goal_id
        : null,
    recommendation: buildGoalRecommendation({
      activeChallenge,
      goal: goal as Goal,
      habits: habitsWithCompletion,
    }),
    skill: skillResult.data as Pick<Skill, "id" | "title"> | null,
    stages,
    totalStagesCount: stages.length,
    wish: wishResult.error ? null : ((wishResult.data as Wish | null) ?? null),
    wishes: wishesResult.error ? [] : ((wishesResult.data as Wish[] | null) ?? []),
  };
}
