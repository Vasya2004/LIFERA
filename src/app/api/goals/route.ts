import { getCurrentUser } from "@/lib/auth/session";
import { jsonSupabaseError } from "@/lib/api/errors";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { assertCanCreateGoal } from "@/lib/domain/subscription";
import { setPrimaryGoal } from "@/lib/domain/primary-goal";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { data, error: queryError } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (queryError) {
    return jsonSupabaseError("goals:GET", queryError, 500, "Не удалось загрузить цели.");
  }

  return jsonOk({ goals: data ?? [] });
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const gate = await assertCanCreateGoal(supabase, user.id);

  if (!gate.allowed) {
    return jsonPlanLimitError(gate.reason ?? "Достигнут лимит целей на Free-плане.");
  }

  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as Record<string, unknown>;
  const title = String(body.title ?? "").trim();

  if (!title) {
    return jsonError("Название цели обязательно.", 422);
  }

  const { data, error: insertError } = await supabase
    .from("goals")
    .insert({
      description: body.description ?? null,
      life_area: body.life_area ?? "projects",
      status: body.status ?? "active",
      target_date: body.target_date ?? null,
      title,
      user_id: user.id,
    })
    .select("*")
    .single();

  if (insertError) {
    return jsonSupabaseError("goals:POST", insertError, 400, "Не удалось создать цель.");
  }

  if (body.is_primary === true) {
    await setPrimaryGoal(supabase, user.id, data.id);
  }

  if (typeof body.linked_wish_id === "string" && body.linked_wish_id) {
    await supabase
      .from("wishes")
      .update({ linked_goal_id: data.id })
      .eq("id", body.linked_wish_id)
      .eq("user_id", user.id);
  }

  return jsonOk({ goal: data }, 201);
}
