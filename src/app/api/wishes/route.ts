import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createWish, listWishes } from "@/lib/domain/wishes";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  try {
    const wishes = await listWishes(supabase, user.id);
    return jsonOk({ wishes });
  } catch (wishesError) {
    return jsonSafeError("wishes:GET", wishesError, 500, "Не удалось загрузить желания.");
  }
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json().catch(() => ({}));

  try {
    const wish = await createWish(supabase, user.id, body);
    return jsonOk({ wish }, 201);
  } catch (wishesError) {
    return jsonSafeError("wishes:POST", wishesError, 400, "Не удалось создать желание.");
  }
}
