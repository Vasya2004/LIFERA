import { getCurrentUser } from "@/lib/auth/session";
import { jsonSafeError } from "@/lib/api/errors";
import { jsonError, jsonOk } from "@/lib/api/response";
import { createFinanceEntry, getFinanceBranchData } from "@/lib/domain/finance";

export async function GET() {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  try {
    const data = await getFinanceBranchData(supabase, user.id);
    return jsonOk(data);
  } catch (financeError) {
    return jsonSafeError("finance:GET", financeError, 500, "Не удалось загрузить финансовые данные.");
  }
}

export async function POST(request: Request) {
  const { error, supabase, user } = await getCurrentUser();

  if (!supabase || !user) {
    return jsonError(error ?? "Unauthorized.", error === "Supabase is not configured." ? 503 : 401);
  }

  const body = await request.json();

  try {
    const result = await createFinanceEntry(supabase, user.id, {
      date: body.date ? String(body.date) : undefined,
      monthly_expenses: Number(body.monthly_expenses ?? 0),
      monthly_income: Number(body.monthly_income ?? 0),
      note: body.note ?? null,
      savings_amount: Number(body.savings_amount ?? 0),
      target_amount: Number(body.target_amount ?? 0),
    });
    return jsonOk(result, 201);
  } catch (createError) {
    return jsonSafeError("finance:POST", createError, 400);
  }
}
