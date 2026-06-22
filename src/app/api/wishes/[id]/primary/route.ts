import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { setPrimaryWish } from "@/lib/domain/wishes";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;

  try {
    const wish = await setPrimaryWish(supabase, user.id, id);
    return jsonOk({ wish });
  } catch (wishesError) {
    return jsonSafeError("wishes:primary", wishesError, 400, "Не удалось выбрать главное желание.");
  }
}
