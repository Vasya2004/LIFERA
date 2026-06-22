import type { SupabaseClient } from "@supabase/supabase-js";

export async function setPrimaryGoal(
  supabase: SupabaseClient,
  userId: string,
  goalId: string | null,
) {
  if (goalId) {
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id")
      .eq("id", goalId)
      .eq("user_id", userId)
      .maybeSingle();

    if (goalError) {
      throw new Error(goalError.message);
    }

    if (!goal) {
      throw new Error("Цель не найдена.");
    }
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ primary_goal_id: goalId })
    .eq("user_id", userId)
    .select("primary_goal_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
