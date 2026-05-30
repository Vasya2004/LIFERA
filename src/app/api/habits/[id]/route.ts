import { getCurrentUser } from "@/lib/auth/session";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk } from "@/lib/api/response";
import { archiveHabit, updateHabit } from "@/lib/domain/habits";
import { isPlanLimitError } from "@/lib/domain/plan-limit-error";

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
    const habit = await updateHabit(supabase, user.id, id, body);
    return jsonOk({ habit });
  } catch (updateError) {
    if (isPlanLimitError(updateError)) {
      return jsonPlanLimitError(updateError.message);
    }

    return jsonError(updateError instanceof Error ? updateError.message : "Update failed.", 400);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;

  try {
    const habit = await archiveHabit(supabase, user.id, id);
    return jsonOk({ habit });
  } catch (archiveError) {
    return jsonError(archiveError instanceof Error ? archiveError.message : "Archive failed.", 400);
  }
}
