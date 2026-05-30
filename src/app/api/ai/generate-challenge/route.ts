import { getCurrentUser } from "@/lib/auth/session";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk } from "@/lib/api/response";
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

  const body = await request.json();
  const goalTitle = String(body.goal_title ?? "Новая цель").trim();

  try {
    const challenge = await createChallengeWithStages({
      description: `Rule-based структура челленджа для цели "${goalTitle}".`,
      difficulty: "medium",
      durationDays: 7,
      goalId: body.goal_id ?? null,
      supabase,
      title: `Челлендж: ${goalTitle}`,
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
