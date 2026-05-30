import type { SupabaseClient } from "@supabase/supabase-js";

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

export async function buildRuleBasedRecommendation(supabase: SupabaseClient, userId: string) {
  const [{ data: goals }, { data: challenges }, { data: habits }] = await Promise.all([
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  const activeGoals = goals ?? [];
  const activeChallenges = challenges ?? [];
  const activeHabits = habits ?? [];
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
          "Создайте первую цель и стартовый челлендж. Затем добавьте небольшой ежедневный ритуал прокачки, чтобы XP шёл не только от миссий.",
        title: "Начните с одной цели",
        type: "next_step",
      };
    }

    return {
      content: weakestGoal
        ? `Создайте первый ритуал прокачки для цели «${weakestGoal.title}». Короткий ежедневный ритуал усилит прогресс без перегруза.`
        : "Добавьте первый ритуал прокачки в разделе «Привычки», чтобы получать XP за регулярность.",
      source_goal_id: weakestGoal?.id ?? null,
      title: "Запустите первый ритуал",
      type: "habit_start",
    };
  }

  if (staleHabit) {
    return {
      content: `Ритуал «${staleHabit.title}» давно не выполнялся. Упростите его до 5–10 минут или снизьте частоту — устойчивость важнее идеального объёма.`,
      source_habit_id: staleHabit.id,
      title: "Упростите ритуал",
      type: "habit_recovery",
    };
  }

  if (topStreakHabit && Number(topStreakHabit.streak_current) >= 3) {
    return {
      content: `Серия ${topStreakHabit.streak_current} дней по ритуалу «${topStreakHabit.title}» — сильный сигнал стабильности. Закрепите ритм и свяжите его с ближайшей целью или миссией.`,
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
      content: `У цели «${goalWithoutHabit.title}» пока нет связанного ритуала. Добавьте небольшую ежедневную практику в той же сфере жизни.`,
      source_goal_id: goalWithoutHabit.id,
      title: "Свяжите цель с ритуалом",
      type: "habit_link",
    };
  }

  if (!weakestGoal && !activeChallenge) {
    return {
      content:
        "Создайте первую цель и стартовый челлендж. Lifera начнет считать прогресс, XP и рекомендации после первого этапа.",
      title: "Начните с одной цели",
      type: "next_step",
    };
  }

  if (activeChallenge) {
    return {
      content: `Продолжите челлендж «${activeChallenge.title}». Лучший следующий шаг — завершить текущий активный этап и зафиксировать прогресс.`,
      source_challenge_id: activeChallenge.id,
      title: "Завершите ближайший этап",
      type: "next_step",
    };
  }

  return {
    content: `Цель «${weakestGoal.title}» пока имеет самый низкий прогресс. Создайте челлендж на 5 этапов, чтобы превратить ее в измеримую траекторию.`,
    source_goal_id: weakestGoal.id,
    title: "Превратите цель в челлендж",
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
