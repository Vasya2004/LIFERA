import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { completeHabit } from "@/lib/domain/habits";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { error, user } = await getCurrentUser();

  if (!user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const serviceSupabase = createSupabaseServiceClient();

  if (!serviceSupabase) {
    return jsonError("SUPABASE_SERVICE_ROLE_KEY is required for habit XP writes.", 503);
  }

  const { id } = await params;

  try {
    const result = await completeHabit(serviceSupabase, user.id, id);
    return jsonOk(result);
  } catch (completeError) {
    return jsonError(
      completeError instanceof Error ? completeError.message : "Habit completion failed.",
      400,
    );
  }
}
