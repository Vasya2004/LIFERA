import { getCurrentUser } from "@/lib/auth/session";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk } from "@/lib/api/response";
import { persistRecommendation } from "@/lib/domain/ai";
import { isPlanLimitError } from "@/lib/domain/plan-limit-error";
import { assertCanCreateAiRecommendation } from "@/lib/domain/subscription";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const gate = await assertCanCreateAiRecommendation(supabase, user.id);

  if (!gate.allowed) {
    return jsonPlanLimitError(gate.reason ?? "Достигнут лимит AI-рекомендаций.");
  }

  try {
    const recommendation = await persistRecommendation(supabase, user.id);
    return jsonOk({ recommendation });
  } catch (aiError) {
    if (isPlanLimitError(aiError)) {
      return jsonPlanLimitError(aiError.message);
    }

    return jsonError(
      aiError instanceof Error ? aiError.message : "AI recommendation failed.",
      500,
    );
  }
}
