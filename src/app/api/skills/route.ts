import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createSkill, getSkillsBranchData } from "@/lib/domain/skills";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  try {
    const data = await getSkillsBranchData(supabase, user.id);
    return jsonOk(data);
  } catch (skillsError) {
    return jsonSafeError("skills:GET", skillsError, 500, "Не удалось загрузить навыки.");
  }
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json();

  try {
    const skill = await createSkill(supabase, user.id, {
      category: body.category,
      title: String(body.title ?? ""),
    });
    return jsonOk({ skill }, 201);
  } catch (createError) {
    return jsonSafeError("skills:POST", createError, 400);
  }
}
