import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError, jsonSupabaseError } from "@/lib/api/errors";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
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

  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as Record<string, unknown>;
  const templateId = body.template_id ? String(body.template_id) : null;
  const goalId = typeof body.goal_id === "string" && body.goal_id ? body.goal_id : null;

  let title = String(body.title ?? "").trim();
  let description = (body.description ?? null) as string | null;
  let difficulty = String(body.difficulty ?? "medium") as "easy" | "medium" | "hard";
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
    difficulty = template.difficulty as "easy" | "medium" | "hard";
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
      goalId,
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
