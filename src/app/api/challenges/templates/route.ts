import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";

export async function GET() {
  const { error, supabase } = await getCurrentUser();

  if (!supabase) {
    return jsonError(error ?? "Supabase is not configured.", 503);
  }

  const { data, error: queryError } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_template", true)
    .order("is_premium", { ascending: true });

  if (queryError) {
    return jsonError(queryError.message, 500);
  }

  return jsonOk({ templates: data ?? [] });
}

