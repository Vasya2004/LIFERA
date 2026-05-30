import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError, jsonSupabaseError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { createChallengeWithStages } from "@/lib/domain/challenges";
import { isPlanLimitError } from "@/lib/domain/plan-limit-error";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { data, error: queryError } = await supabase
    .from("challenges")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (queryError) {
    return jsonSupabaseError("challenges:GET", queryError, 500, "Не удалось загрузить челленджи.");
  }

  return jsonOk({ challenges: data ?? [] });
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json();
  const templateId = body.template_id ? String(body.template_id) : null;

  let title = String(body.title ?? "").trim();
  let description = body.description ?? null;
  let difficulty = body.difficulty ?? "medium";
  let durationDays = Number(body.duration_days ?? 7);
  let isPremium = Boolean(body.is_premium);

  if (templateId) {
    const { data: template, error: templateError } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", templateId)
      .eq("is_template", true)
      .maybeSingle();

    if (templateError || !template) {
      return jsonError("Шаблон челленджа не найден.", 404);
    }

    title = title || template.title;
    description = description ?? template.description;
    difficulty = template.difficulty;
    durationDays = Number(template.duration_days ?? 7);
    isPremium = template.is_premium;
  }

  if (!title) {
    return jsonError("Название челленджа обязательно.", 422);
  }

  try {
    const challenge = await createChallengeWithStages({
      description,
      difficulty,
      durationDays,
      goalId: body.goal_id ?? null,
      isPremium,
      supabase,
      title,
      userId: user.id,
    });

    return jsonOk({ challenge }, 201);
  } catch (createError) {
    if (isPlanLimitError(createError)) {
      return jsonPlanLimitError(createError.message);
    }

    return jsonSafeError("challenges:POST", createError, 400, "Не удалось создать челлендж.");
  }
}

