import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { uncompleteHabit } from "@/lib/domain/habits";
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
    return jsonError("SUPABASE_SERVICE_ROLE_KEY is required.", 503);
  }

  const { id } = await params;

  try {
    const result = await uncompleteHabit(serviceSupabase, user.id, id);
    revalidatePath("/habits");
    revalidatePath("/dashboard");
    return jsonOk(result);
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Failed to undo habit completion.",
      400,
    );
  }
}
