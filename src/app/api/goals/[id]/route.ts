import { getCurrentUser } from "@/lib/auth/session";
import { jsonSupabaseError } from "@/lib/api/errors";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk } from "@/lib/api/response";
import { assertCanActivateGoal } from "@/lib/domain/subscription";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};

  for (const key of ["description", "life_area", "progress", "status", "target_date", "title", "skill_id"]) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  const { data: existing, error: existingError } = await supabase
    .from("goals")
    .select("status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError || !existing) {
    return jsonError("Цель не найдена.", 404);
  }

  const activationGate = await assertCanActivateGoal(
    supabase,
    user.id,
    existing.status,
    typeof body.status === "string" ? body.status : undefined,
  );

  if (!activationGate.allowed) {
    return jsonPlanLimitError(activationGate.reason ?? "Достигнут лимит целей на Free-плане.");
  }

  const { data, error: updateError } = await supabase
    .from("goals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateError) {
    return jsonSupabaseError("goals:PUT", updateError, 400, "Не удалось обновить цель.");
  }

  return jsonOk({ goal: data });
}

export async function DELETE(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const { error: deleteError } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return jsonSupabaseError("goals:DELETE", deleteError, 400, "Не удалось удалить цель.");
  }

  return jsonOk({ ok: true });
}
