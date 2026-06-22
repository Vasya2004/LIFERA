import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { jsonPlanLimitError } from "@/lib/api/plan-limit";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/response";
import { archiveHabit, deleteHabit, updateHabit, type HabitInput } from "@/lib/domain/habits";
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
  const parsed = await parseJsonBody(request);

  if (!parsed.ok) {
    return parsed.response;
  }

  const body = parsed.data as HabitInput & { status?: "active" | "archived" };

  try {
    const habit = await updateHabit(supabase, user.id, id, body);
    revalidatePath("/habits");
    revalidatePath("/dashboard");
    return jsonOk({ habit });
  } catch (updateError) {
    if (isPlanLimitError(updateError)) {
      return jsonPlanLimitError(updateError.message);
    }

    return jsonError(updateError instanceof Error ? updateError.message : "Update failed.", 400);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const url = new URL(request.url);
  const hard = url.searchParams.get("hard") === "true";

  try {
    if (hard) {
      await deleteHabit(supabase, user.id, id);
      revalidatePath("/habits");
      revalidatePath("/dashboard");
      return jsonOk({ deleted: true });
    }
    const habit = await archiveHabit(supabase, user.id, id);
    revalidatePath("/habits");
    revalidatePath("/dashboard");
    return jsonOk({ habit });
  } catch (archiveError) {
    return jsonError(archiveError instanceof Error ? archiveError.message : "Operation failed.", 400);
  }
}
