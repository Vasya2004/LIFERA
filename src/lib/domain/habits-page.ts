import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate, weekStartDate } from "@/lib/utils/date";
import type { Habit } from "@/lib/domain/types";

export type HabitWeekDayStatus = "completed" | "missed" | "today" | "upcoming";

export type HabitWeekDay = {
  date: string;
  label: string;
  status: HabitWeekDayStatus;
};

export type HabitRhythmItem = {
  days: HabitWeekDay[];
  habitId: string;
  habitTitle: string;
};

export type HabitsTodaySummary = {
  bestStreak: number;
  completedToday: number;
  completionRateWeek: number;
  totalActive: number;
  xpToday: number;
};

export type HabitChecklistItemData = {
  challengeTitle: string | null;
  completedToday: boolean;
  goalTitle: string | null;
  habit: Habit;
  skillTitle: string | null;
};

const weekdayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function linkedTitle(items: Array<{ id: string; title: string }>, id: string | null) {
  return items.find((item) => item.id === id)?.title ?? null;
}

function buildRhythmDays(
  habitId: string,
  logs: Array<{ habit_id: string; completed_on: string }>,
  weekStart: string,
  today: string,
): HabitWeekDay[] {
  const completedOnDates = new Set(
    logs.filter((log) => log.habit_id === habitId).map((log) => log.completed_on),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const label = weekdayLabels[index] ?? date.slice(5);
    const done = completedOnDates.has(date);

    if (date > today) {
      return { date, label, status: "upcoming" as const };
    }

    if (date === today) {
      return { date, label, status: done ? ("completed" as const) : ("today" as const) };
    }

    return { date, label, status: done ? ("completed" as const) : ("missed" as const) };
  });
}

export async function getHabitsPageData(supabase: SupabaseClient, userId: string) {
  const weekStart = weekStartDate();
  const today = todayIsoDate();

  const [habitsResult, goalsResult, skillsResult, challengesResult, logsResult, todayLogsResult] =
    await Promise.all([
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase.from("goals").select("id,title").eq("user_id", userId),
      supabase.from("skills").select("id,title").eq("user_id", userId),
      supabase.from("challenges").select("id,title").eq("user_id", userId),
      supabase
        .from("habit_logs")
        .select("habit_id,completed_on,xp_awarded")
        .eq("user_id", userId)
        .gte("completed_on", weekStart),
      supabase
        .from("habit_logs")
        .select("habit_id,xp_awarded")
        .eq("user_id", userId)
        .eq("completed_on", today),
    ]);

  const firstError =
    habitsResult.error?.message ??
    goalsResult.error?.message ??
    skillsResult.error?.message ??
    challengesResult.error?.message ??
    logsResult.error?.message ??
    todayLogsResult.error?.message ??
    null;

  if (firstError) {
    throw new Error(firstError);
  }

  const allHabits = (habitsResult.data ?? []) as Habit[];
  const activeHabits = allHabits.filter((habit) => habit.status === "active");
  const archivedHabits = allHabits.filter((habit) => habit.status === "archived");
  const goals = goalsResult.data ?? [];
  const skills = skillsResult.data ?? [];
  const challenges = challengesResult.data ?? [];
  const weekLogs = logsResult.data ?? [];
  const todayLogs = todayLogsResult.data ?? [];

  const completedTodayIds = new Set(todayLogs.map((log) => log.habit_id));
  const completedToday = completedTodayIds.size;
  const totalActive = activeHabits.length;
  const xpToday = todayLogs.reduce((sum, log) => sum + Number(log.xp_awarded ?? 0), 0);
  const bestStreak =
    activeHabits.length > 0
      ? Math.max(...activeHabits.map((habit) => Number(habit.streak_best ?? 0)))
      : 0;
  const completionRateWeek =
    totalActive > 0
      ? Math.min(100, Math.round((weekLogs.length / Math.max(1, totalActive * 7)) * 100))
      : 0;

  const todaySummary: HabitsTodaySummary = {
    bestStreak,
    completedToday,
    completionRateWeek,
    totalActive,
    xpToday,
  };

  const checklist: HabitChecklistItemData[] = activeHabits.map((habit) => ({
    challengeTitle: linkedTitle(challenges, habit.linked_challenge_id),
    completedToday: completedTodayIds.has(habit.id),
    goalTitle: linkedTitle(goals, habit.linked_goal_id),
    habit,
    skillTitle: linkedTitle(skills, habit.linked_skill_id),
  }));

  const weeklyRhythm: HabitRhythmItem[] = activeHabits.map((habit) => ({
    days: buildRhythmDays(habit.id, weekLogs, weekStart, today),
    habitId: habit.id,
    habitTitle: habit.title,
  }));

  return {
    archivedHabits,
    challenges,
    checklist,
    goals,
    skills,
    todaySummary,
    weeklyRhythm,
  };
}
