import { getCurrentUser } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api/response";
import { completeStage } from "@/lib/domain/challenges";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type Params = {
  params: Promise<{ id: string; stageId: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const { id, stageId } = await params;
  const serviceSupabase = createSupabaseServiceClient();

  if (!serviceSupabase) {
    return jsonError(
      "Сервер не настроен для начисления XP: добавьте SUPABASE_SERVICE_ROLE_KEY в .env.local и перезапустите приложение.",
      503,
    );
  }

  try {
    const result = await completeStage({
      challengeId: id,
      serviceSupabase,
      stageId,
      supabase,
      userId: user.id,
    });

    return jsonOk(result);
  } catch (completeError) {
    return jsonError(
      completeError instanceof Error ? completeError.message : "Stage completion failed.",
      400,
    );
  }
}
