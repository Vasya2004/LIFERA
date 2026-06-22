import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { setPrimaryGoal } from "@/lib/domain/primary-goal";

export async function PUT(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as Record<string, unknown>;
  const goalId = typeof body.goal_id === "string" && body.goal_id ? body.goal_id : null;

  try {
    const profile = await setPrimaryGoal(supabase, user.id, goalId);
    return jsonOk({ profile });
  } catch (primaryError) {
    return jsonSafeError("goals:primary", primaryError, 400, "Не удалось выбрать главную цель.");
  }
}
