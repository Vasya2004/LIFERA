import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { completeUserOnboarding } from "@/lib/domain/onboarding";

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json();
  const lifeAreas = Array.isArray(body.selected_life_areas)
    ? body.selected_life_areas.map(String)
    : [];
  const goalTitle = String(body.goal_title ?? "").trim();
  const challengeTitle = String(body.challenge_title ?? "Стартовый челлендж").trim();

  if (!goalTitle) {
    return jsonError("Название цели обязательно.", 422);
  }

  try {
    const result = await completeUserOnboarding({
      payload: {
        challenge_title: challengeTitle,
        goal_description: body.goal_description ?? null,
        goal_title: goalTitle,
        selected_life_areas: lifeAreas,
      },
      supabase,
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
