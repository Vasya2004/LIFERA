import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { data, error: queryError } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("is_premium", { ascending: true })
    .order("created_at", { ascending: true });

  if (queryError) {
    return jsonError(queryError.message, 500);
  }

  return jsonOk({ achievements: data ?? [] });
}

