import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate } from "@/lib/utils/date";
import { awardXpOnce, calculateLevel, checkAchievements } from "@/lib/domain/gamification";
import { PlanLimitError } from "@/lib/domain/plan-limit-error";
import { assertCanActivateHabit } from "@/lib/domain/subscription";
import type { HabitFrequency, HabitStatus, LifeArea } from "@/lib/domain/types";

export type HabitInput = {
  description?: string | null;
  frequency?: HabitFrequency;
  life_area?: LifeArea;
  linked_challenge_id?: string | null;
  linked_goal_id?: string | null;
  linked_skill_id?: string | null;
  title?: string;
  xp_reward?: number;
};

function yesterdayIsoDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

function lastCompletedDate(lastCompletedAt: string | null) {
  return lastCompletedAt ? lastCompletedAt.slice(0, 10) : null;
}

export async function listHabits(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createHabit(
  supabase: SupabaseClient,
  userId: string,
  input: HabitInput,
) {
  const title = String(input.title ?? "").trim();

  if (!title) {
    throw new Error("Habit title is required.");
  }

  const { data, error } = await supabase
    .from("habits")
    .insert({
      description: input.description ?? null,
      frequency: input.frequency ?? "daily",
      life_area: input.life_area ?? "projects",
      linked_challenge_id: input.linked_challenge_id ?? null,
      linked_goal_id: input.linked_goal_id ?? null,
      linked_skill_id: input.linked_skill_id ?? null,
      title,
      user_id: userId,
      xp_reward: Number(input.xp_reward ?? 10),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
  input: HabitInput & { status?: HabitStatus },
) {
  const updates: Record<string, unknown> = {};

  for (const key of [
    "description",
    "frequency",
    "life_area",
    "linked_challenge_id",
    "linked_goal_id",
    "linked_skill_id",
    "status",
    "title",
    "xp_reward",
  ]) {
    if (key in input) {
      updates[key] = input[key as keyof typeof input];
    }
  }

  if ("status" in input) {
    const { data: existing, error: existingError } = await supabase
      .from("habits")
      .select("status")
      .eq("id", habitId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError || !existing) {
      throw new Error("Habit not found.");
    }

    const activationGate = await assertCanActivateHabit(
      supabase,
      userId,
      existing.status,
      input.status,
    );

    if (!activationGate.allowed) {
      throw new PlanLimitError(activationGate.reason ?? "Достигнут лимит привычек на Free-плане.");
    }
  }

  const { data, error } = await supabase
    .from("habits")
    .update(updates)
    .eq("id", habitId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function archiveHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
) {
  return updateHabit(supabase, userId, habitId, { status: "archived" });
}

export async function completeHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
) {
  const today = todayIsoDate();
  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("*")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habit) {
    throw new Error(habitError?.message ?? "Habit not found.");
  }

  if (habit.status !== "active") {
    throw new Error("Only active habits can be completed.");
  }

  const { data: existingLog, error: logQueryError } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("completed_on", today)
    .maybeSingle();

  if (logQueryError) {
    throw new Error(logQueryError.message);
  }

  if (existingLog) {
    return {
      achievements: [],
      alreadyCompleted: true,
      habit,
      log: existingLog,
      xp: { awarded: false, level: null, xpTotal: null },
      xpAwarded: 0,
    };
  }

  const xpAwarded = Number(habit.xp_reward ?? 10);
  const { data: log, error: insertLogError } = await supabase
    .from("habit_logs")
    .insert({
      completed_on: today,
      habit_id: habitId,
      user_id: userId,
      xp_awarded: xpAwarded,
    })
    .select("*")
    .single();

  if (insertLogError) {
    throw new Error(insertLogError.message);
  }

  const nextStreak =
    lastCompletedDate(habit.last_completed_at) === yesterdayIsoDate()
      ? Number(habit.streak_current ?? 0) + 1
      : 1;
  const nextBest = Math.max(Number(habit.streak_best ?? 0), nextStreak);

  const xp = await awardXpOnce({
    amount: xpAwarded,
    reason: `Привычка: ${habit.title}`,
    sourceId: log.id,
    sourceType: "habit_log",
    supabase,
    userId,
  });

  const { data: updatedHabit, error: updateError } = await supabase
    .from("habits")
    .update({
      last_completed_at: new Date().toISOString(),
      streak_best: nextBest,
      streak_current: nextStreak,
    })
    .eq("id", habitId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  const achievements = xp.awarded ? await checkAchievements(supabase, userId) : [];

  return {
    achievements,
    alreadyCompleted: false,
    habit: updatedHabit,
    log,
    xp,
    xpAwarded: xp.awarded ? xpAwarded : 0,
  };
}

export async function uncompleteHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
) {
  const today = todayIsoDate();

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("*")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habit) {
    throw new Error(habitError?.message ?? "Habit not found.");
  }

  const { data: log, error: logError } = await supabase
    .from("habit_logs")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("completed_on", today)
    .select("*")
    .maybeSingle();

  if (logError) {
    throw new Error(logError.message);
  }

  if (!log) {
    return { habit, log: null, undone: false };
  }

  const xpReverted = Number(log.xp_awarded ?? 0);

  if (xpReverted > 0) {
    await supabase
      .from("xp_transactions")
      .delete()
      .eq("source_id", log.id)
      .eq("source_type", "habit_log")
      .eq("user_id", userId);

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("xp_total")
      .eq("user_id", userId)
      .single();

    if (profile) {
      const newTotal = Math.max(0, Number(profile.xp_total ?? 0) - xpReverted);
      const { level } = calculateLevel(newTotal);
      await supabase
        .from("user_profiles")
        .update({ level, xp_total: newTotal })
        .eq("user_id", userId);
    }
  }

  const nextStreak = Math.max(0, Number(habit.streak_current ?? 0) - 1);

  const { data: updatedHabit, error: updateError } = await supabase
    .from("habits")
    .update({ streak_current: nextStreak })
    .eq("id", habitId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { habit: updatedHabit, log, undone: true, xpReverted };
}

export async function deleteHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
) {
  const { error: logsError } = await supabase
    .from("habit_logs")
    .delete()
    .eq("habit_id", habitId)
    .eq("user_id", userId);

  if (logsError) {
    throw new Error(logsError.message);
  }

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}
