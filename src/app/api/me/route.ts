import { getCurrentUser } from "@/lib/auth/session";
import { jsonSupabaseError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    return jsonSupabaseError("me:GET", profileError, 500, "Не удалось загрузить профиль.");
  }

  return jsonOk({ email: user.email, profile });
}

export async function PUT(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json();
  const updates: Record<string, string | null> = {};

  if ("avatar_url" in body) {
    updates.avatar_url = body.avatar_url ?? null;
  }

  if ("full_name" in body) {
    updates.full_name = body.full_name ?? null;
  }

  if ("preferred_theme" in body) {
    updates.preferred_theme = body.preferred_theme ?? "system";
  }

  const { data, error: updateError } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (updateError) {
    return jsonSupabaseError("me:PUT", updateError, 400, "Не удалось обновить профиль.");
  }

  return jsonOk({ profile: data });
}
