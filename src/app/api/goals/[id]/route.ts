import { getCurrentUser } from "@/lib/auth/session";
import { jsonSupabaseError } from "@/lib/api/errors";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { assertCanActivateGoal } from "@/lib/domain/subscription";
import { setPrimaryGoal } from "@/lib/domain/primary-goal";

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

  if ("title" in body) {
    const title = typeof body.title === "string" ? body.title.trim() : "";

    if (title.length < 2) {
      return jsonError("Название цели должно быть не короче 2 символов.", 400);
    }

    body.title = title;
  }

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

  if (body.is_primary === true) {
    await setPrimaryGoal(supabase, user.id, id);
  }

  if ("linked_wish_id" in body) {
    await supabase
      .from("wishes")
      .update({ linked_goal_id: null })
      .eq("linked_goal_id", id)
      .eq("user_id", user.id);

    if (typeof body.linked_wish_id === "string" && body.linked_wish_id) {
      await supabase
        .from("wishes")
        .update({ linked_goal_id: id })
        .eq("id", body.linked_wish_id)
        .eq("user_id", user.id);
    }
  }

  return jsonOk({ goal: data });
}

export async function DELETE(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;

  const { data: existing, error: fetchError } = await supabase
    .from("goals")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return jsonError("Цель не найдена.", 404);
  }

  const { error: updateError } = await supabase
    .from("goals")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return jsonSupabaseError("goals:DELETE", updateError, 400, "Не удалось архивировать цель.");
  }

  return jsonOk({ ok: true });
}
