import { getCurrentUser } from "@/lib/auth/session";
import { jsonSupabaseError } from "@/lib/api/errors";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { assertCanActivateChallenge } from "@/lib/domain/subscription";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  for (const key of ["description", "difficulty", "duration_days", "goal_id", "status", "title"]) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  const { data: existing, error: existingError } = await supabase
    .from("challenges")
    .select("status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError || !existing) {
    return jsonError("Челлендж не найден.", 404);
  }

  const activationGate = await assertCanActivateChallenge(
    supabase,
    user.id,
    existing.status,
    typeof body.status === "string" ? body.status : undefined,
  );

  if (!activationGate.allowed) {
    return jsonPlanLimitError(
      activationGate.reason ?? "Достигнут лимит челленджей на Free-плане.",
    );
  }

  const { data, error: updateError } = await supabase
    .from("challenges")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateError) {
    return jsonSupabaseError("challenges:PUT", updateError, 400, "Не удалось обновить челлендж.");
  }

  return jsonOk({ challenge: data });
}

export async function DELETE(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const { error: deleteError } = await supabase
    .from("challenges")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return jsonSupabaseError("challenges:DELETE", deleteError, 400, "Не удалось удалить челлендж.");
  }

  return jsonOk({ ok: true });
}
