import { getCurrentUser } from "@/lib/auth/session";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { createChallengeWithStages } from "@/lib/domain/challenges";
import { isPlanLimitError } from "@/lib/domain/plan-limit-error";
import { assertCanUseAiGeneration } from "@/lib/domain/subscription";

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const gate = await assertCanUseAiGeneration(supabase, user.id);

  if (!gate.allowed) {
    return jsonPlanLimitError(gate.reason ?? "AI-генерация недоступна на Free-плане.");
  }

  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as Record<string, unknown>;
  const goalTitle = String(body.goal_title ?? "Новая цель").trim();
  const goalId = typeof body.goal_id === "string" && body.goal_id ? body.goal_id : null;

  try {
    const challenge = await createChallengeWithStages({
      description: `Rule-based структура плана для цели "${goalTitle}".`,
      difficulty: "medium",
      durationDays: 7,
      goalId,
      supabase,
      title: `План цели: ${goalTitle}`,
      userId: user.id,
    });

    const { data: stages } = await supabase
      .from("challenge_stages")
      .select("*")
      .eq("challenge_id", challenge.id)
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    return jsonOk({ challenge, stages: stages ?? [] }, 201);
  } catch (generateError) {
    if (isPlanLimitError(generateError)) {
      return jsonPlanLimitError(generateError.message);
    }

    return jsonError(
      generateError instanceof Error ? generateError.message : "Challenge generation failed.",
      400,
    );
  }
}
