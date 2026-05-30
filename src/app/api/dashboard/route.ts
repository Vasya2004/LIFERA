import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getDashboardData } from "@/lib/domain/dashboard";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  try {
    const dashboard = await getDashboardData(supabase, user.id);
    return jsonOk({ dashboard });
  } catch (dashboardError) {
    return jsonError(
      dashboardError instanceof Error ? dashboardError.message : "Dashboard failed.",
      500,
    );
  }
}

