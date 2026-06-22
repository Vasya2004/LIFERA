import type { SupabaseClient } from "@supabase/supabase-js";

import type { Challenge, Goal, Habit } from "@/lib/domain/types";

type RecommendationData = {
  challenges?: Challenge[];
  goals?: Goal[];
  habits?: Habit[];
};

function daysSince(dateValue: string | null) {
  if (!dateValue) {
    return Number.POSITIVE_INFINITY;
  }

  const last = new Date(dateValue.slice(0, 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export async function buildRuleBasedRecommendation(
  supabase: SupabaseClient,
  userId: string,
  prefetchedData?: RecommendationData
) {
  let activeGoals = prefetchedData?.goals;
  let activeChallenges = prefetchedData?.challenges;
  let activeHabits = prefetchedData?.habits;

  if (!activeGoals || !activeChallenges || !activeHabits) {
    const [goalsResult, challengesResult, habitsResult] = await Promise.all([
      !activeGoals
        ? supabase.from("goals").select("*").eq("user_id", userId).eq("status", "active").order("created_at", { ascending: false })
        : Promise.resolve({ data: activeGoals }),
      !activeChallenges
        ? supabase.from("challenges").select("*").eq("user_id", userId).eq("status", "active").order("created_at", { ascending: false })
        : Promise.resolve({ data: activeChallenges }),
      !activeHabits
        ? supabase.from("habits").select("*").eq("user_id", userId).eq("status", "active").order("created_at", { ascending: false })
        : Promise.resolve({ data: activeHabits }),
    ]);

    activeGoals = activeGoals ?? (goalsResult.data ?? []);
    activeChallenges = activeChallenges ?? (challengesResult.data ?? []);
    activeHabits = activeHabits ?? (habitsResult.data ?? []);
  }

  activeGoals = activeGoals ?? [];
  activeChallenges = activeChallenges ?? [];
  activeHabits = activeHabits ?? [];
  const weakestGoal = [...activeGoals].sort((a, b) => Number(a.progress) - Number(b.progress))[0];
  const activeChallenge = activeChallenges[0];
  const topStreakHabit = [...activeHabits].sort(
    (a, b) => Number(b.streak_current) - Number(a.streak_current),
  )[0];
  const staleHabit = [...activeHabits]
    .filter((habit) => daysSince(habit.last_completed_at) >= 3)
    .sort((a, b) => daysSince(b.last_completed_at) - daysSince(a.last_completed_at))[0];

  if (activeHabits.length === 0) {
    if (!weakestGoal && !activeChallenge) {
      return {
        content:
          "Создайте первую цель и регулярную привычку, чтобы XP шёл от устойчивого движения.",
        title: "Начните с одной цели",
        type: "next_step",
      };
    }

    return {
      content: weakestGoal
        ? `Создайте первую привычку для цели «${weakestGoal.title}». Короткая регулярная практика усилит движение без перегруза.`
        : "Добавьте первую привычку в разделе «Привычки», чтобы получать XP за регулярность.",
      source_goal_id: weakestGoal?.id ?? null,
      title: "Запустите первую привычку",
      type: "habit_start",
    };
  }

  if (staleHabit) {
    return {
      content: `Привычка «${staleHabit.title}» давно не выполнялась. Упростите её до 5–10 минут или снизьте частоту — устойчивость важнее идеального объёма.`,
      source_habit_id: staleHabit.id,
      title: "Упростите привычку",
      type: "habit_recovery",
    };
  }

  if (topStreakHabit && Number(topStreakHabit.streak_current) >= 3) {
    return {
      content: `Серия ${topStreakHabit.streak_current} дней по привычки «${topStreakHabit.title}» — сильный сигнал стабильности. Закрепите ритм.`,
      source_habit_id: topStreakHabit.id,
      title: "Серия растёт — продолжайте",
      type: "habit_momentum",
    };
  }

  const goalWithoutHabit = activeGoals.find(
    (goal) => !activeHabits.some((habit) => habit.linked_goal_id === goal.id),
  );

  if (goalWithoutHabit) {
    return {
      content: `У цели «${goalWithoutHabit.title}» пока нет регулярной привычки. Добавьте небольшую практику в той же сфере жизни.`,
      source_goal_id: goalWithoutHabit.id,
      title: "Добавьте привычку к цели",
      type: "habit_link",
    };
  }

  if (!weakestGoal && !activeChallenge) {
    return {
      content:
        "Создайте первую цель и регулярную привычку. Lifera начнёт считать XP и рекомендации после первых действий.",
      title: "Начните с одной цели",
      type: "next_step",
    };
  }

  if (activeChallenge) {
    return {
      content: `Продолжите план «${activeChallenge.title}». Лучший следующий шаг — завершить текущий активный этап и зафиксировать движение.`,
      source_challenge_id: activeChallenge.id,
      title: "Завершите ближайший этап",
      type: "next_step",
    };
  }

  return {
    content: `Цель «${weakestGoal.title}» пока имеет самый низкий прогресс. Добавьте регулярную привычку, чтобы поддержать движение.`,
    source_goal_id: weakestGoal.id,
    title: "Добавьте привычку к цели",
    type: "goal_analysis",
  };
}

export async function persistRecommendation(supabase: SupabaseClient, userId: string) {
  const recommendation = await buildRuleBasedRecommendation(supabase, userId);

  const { data, error } = await supabase
    .from("ai_recommendations")
    .insert({ ...recommendation, user_id: userId })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
