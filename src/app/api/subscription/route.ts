import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import {
  FREE_AI_WEEKLY_LIMIT,
  FREE_LIMITS,
  FREE_PROGRESS_HISTORY_DAYS,
  getUserPlan,
  hasProAccess,
  hasUltraAccess,
} from "@/lib/domain/subscription";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { data, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subscriptionError) {
    return jsonError("Не удалось загрузить подписку.", 500);
  }

  const plan = await getUserPlan(supabase, user.id);

  return jsonOk({
    limits: FREE_LIMITS,
    plan,
    subscription: data,
    features: {
      aiWeeklyLimit: hasProAccess(plan) ? null : FREE_AI_WEEKLY_LIMIT,
      progressHistoryDays: hasProAccess(plan) ? null : FREE_PROGRESS_HISTORY_DAYS,
      proAccess: hasProAccess(plan),
      ultraAccess: hasUltraAccess(plan),
    },
  });
}
