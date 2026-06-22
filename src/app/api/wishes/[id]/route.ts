import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { archiveWish, updateWish } from "@/lib/domain/wishes";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const wish = await updateWish(supabase, user.id, id, body);
    return jsonOk({ wish });
  } catch (wishesError) {
    return jsonSafeError("wishes:PUT", wishesError, 400, "Не удалось обновить желание.");
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;

  try {
    const wish = await archiveWish(supabase, user.id, id);
    return jsonOk({ wish });
  } catch (wishesError) {
    return jsonSafeError("wishes:DELETE", wishesError, 400, "Не удалось архивировать желание.");
  }
}
