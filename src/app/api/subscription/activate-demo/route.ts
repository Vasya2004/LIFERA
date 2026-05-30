import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { normalizePlanTier } from "@/lib/domain/plan-catalog";
import {
  activateDemoPlan,
  getUserPlan,
  isDemoPremiumEnabled,
  type PaidPlanTier,
} from "@/lib/domain/subscription";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  if (!isDemoPremiumEnabled()) {
    return jsonError("Demo-планы недоступны в этой среде.", 403);
  }

  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json().catch(() => ({}));
  const requestedPlan = normalizePlanTier(String(body.plan ?? "pro"));
  const plan: PaidPlanTier = requestedPlan === "ultra" ? "ultra" : "pro";

  try {
    const serviceSupabase = createSupabaseServiceClient();

    if (!serviceSupabase) {
      return jsonError("SUPABASE_SERVICE_ROLE_KEY is required for subscription writes.", 503);
    }

    await activateDemoPlan(supabase, user.id, plan, serviceSupabase);
    const activePlan = await getUserPlan(supabase, user.id);
    return jsonOk({ ok: true, plan: activePlan });
  } catch (subscriptionError) {
    return jsonError(
      subscriptionError instanceof Error ? subscriptionError.message : "Subscription update failed.",
      400,
    );
  }
}
