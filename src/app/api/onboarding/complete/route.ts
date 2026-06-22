import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { completeUserOnboarding } from "@/lib/domain/onboarding";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const { error, user } = await getCurrentUser();

  if (!user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const serviceSupabase = createSupabaseServiceClient();

  if (!serviceSupabase) {
    return jsonError("SUPABASE_SERVICE_ROLE_KEY is required for onboarding writes.", 503);
  }

  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as Record<string, unknown>;
  const lifeAreas = Array.isArray(body.selected_life_areas)
    ? body.selected_life_areas.map(String)
    : [];
  const goalTitle = String(body.goal_title ?? "").trim();
  const goalDescription =
    typeof body.goal_description === "string" ? body.goal_description : null;

  if (goalTitle.length < 3) {
    return jsonError("Название цели должно быть не короче 3 символов.", 422);
  }

  try {
    const result = await completeUserOnboarding({
      payload: {
        achievement_category:
          typeof body.achievement_category === "string" ? body.achievement_category : null,
        achievement_description:
          typeof body.achievement_description === "string" ? body.achievement_description : null,
        achievement_title:
          typeof body.achievement_title === "string" ? body.achievement_title : null,
        goal_description: goalDescription,
        goal_life_area: typeof body.goal_life_area === "string" ? body.goal_life_area : undefined,
        goal_target_date:
          typeof body.goal_target_date === "string" ? body.goal_target_date : null,
        goal_title: goalTitle,
        habit_frequency:
          typeof body.habit_frequency === "string" ? body.habit_frequency : undefined,
        habit_title: typeof body.habit_title === "string" ? body.habit_title : null,
        habit_xp_reward: Number(body.habit_xp_reward ?? 10),
        health_comment: typeof body.health_comment === "string" ? body.health_comment : null,
        health_discomfort_level:
          typeof body.health_discomfort_level === "string"
            ? body.health_discomfort_level
            : undefined,
        health_zone: typeof body.health_zone === "string" ? body.health_zone : undefined,
        selected_life_areas: lifeAreas,
      },
      supabase: serviceSupabase,
      userId: user.id,
    });

    return jsonOk(result);
  } catch (onboardingError) {
    return jsonError(
      onboardingError instanceof Error ? onboardingError.message : "Onboarding failed.",
      400,
    );
  }
}
