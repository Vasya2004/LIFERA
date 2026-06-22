import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { createHabit, listHabits, type HabitInput } from "@/lib/domain/habits";
import { assertCanCreateHabit } from "@/lib/domain/subscription";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  try {
    const habits = await listHabits(supabase, user.id);
    return jsonOk({ habits });
  } catch (habitsError) {
    return jsonError(habitsError instanceof Error ? habitsError.message : "Habits failed.", 500);
  }
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as HabitInput;

  const gate = await assertCanCreateHabit(supabase, user.id);

  if (!gate.allowed) {
    return jsonPlanLimitError(gate.reason ?? "Достигнут лимит привычек на Free-плане.");
  }

  try {
    const habit = await createHabit(supabase, user.id, body);
    revalidatePath("/habits");
    revalidatePath("/dashboard");
    return jsonOk({ habit }, 201);
  } catch (createError) {
    return jsonError(createError instanceof Error ? createError.message : "Create failed.", 400);
  }
}
