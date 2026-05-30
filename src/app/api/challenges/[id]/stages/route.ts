import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id } = await params;
  const { data, error: queryError } = await supabase
    .from("challenge_stages")
    .select("*")
    .eq("challenge_id", id)
    .eq("user_id", user.id)
    .order("order_index", { ascending: true });

  if (queryError) {
    return jsonError(queryError.message, 500);
  }

  return jsonOk({ stages: data ?? [] });
}

