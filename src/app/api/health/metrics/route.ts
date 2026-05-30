import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createHealthEntry, getHealthBranchData } from "@/lib/domain/health";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  try {
    const data = await getHealthBranchData(supabase, user.id);
    return jsonOk(data);
  } catch (healthError) {
    return jsonSafeError("health:GET", healthError, 500, "Не удалось загрузить wellness-данные.");
  }
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json();

  try {
    const result = await createHealthEntry(supabase, user.id, {
      activity_minutes: Number(body.activity_minutes ?? 0),
      date: body.date ? String(body.date) : undefined,
      energy_level: Number(body.energy_level ?? 5),
      note: body.note ?? null,
      recovery_score: Number(body.recovery_score ?? 5),
      sleep_hours: Number(body.sleep_hours ?? 7),
    });
    return jsonOk(result, 201);
  } catch (createError) {
    return jsonSafeError("health:POST", createError, 400);
  }
}
