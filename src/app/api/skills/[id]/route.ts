import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { updateSkill } from "@/lib/domain/skills";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const skill = await updateSkill(supabase, user.id, id, {
      category: body.category,
      level: body.level !== undefined ? Number(body.level) : undefined,
      progress: body.progress !== undefined ? Number(body.progress) : undefined,
      status: body.status,
      title: body.title !== undefined ? String(body.title) : undefined,
    });
    return jsonOk({ skill });
  } catch (updateError) {
    return jsonError(updateError instanceof Error ? updateError.message : "Update failed.", 400);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const body = await request.json();

  if (body.action !== "archive") {
    return jsonError("Unsupported action.", 422);
  }

  try {
    const skill = await updateSkill(supabase, user.id, id, { status: "archived" });
    return jsonOk({ skill });
  } catch (archiveError) {
    return jsonError(archiveError instanceof Error ? archiveError.message : "Archive failed.", 400);
  }
}
