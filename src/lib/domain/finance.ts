import type { SupabaseClient } from "@supabase/supabase-js";

import { getBranchActivities, sanitizeBranchNote } from "@/lib/domain/branches";
import type { Challenge, Goal, Habit } from "@/lib/domain/types";

export const FINANCE_METRIC_TYPES = [
  "savings_amount",
  "target_amount",
  "monthly_income",
  "monthly_expenses",
] as const;

export type FinanceMetricType = (typeof FINANCE_METRIC_TYPES)[number];

export type FinanceEntryInput = {
  date?: string;
  monthly_expenses: number;
  monthly_income: number;
  note?: string | null;
  savings_amount: number;
  target_amount: number;
};

export type FinanceSnapshot = {
  date: string;
  monthly_expenses: number;
  monthly_income: number;
  note: string | null;
  savings_amount: number;
  savingsProgress: number;
  target_amount: number;
};

export type FinanceInsight = {
  content: string;
  title: string;
};

export type FinanceBranchData = {
  activities: {
    challenges: Challenge[];
    goals: Goal[];
    habits: Habit[];
  };
  financeScore: number;
  history: FinanceSnapshot[];
  insight: FinanceInsight;
  latest: FinanceSnapshot | null;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function clampFinanceValue(type: FinanceMetricType, value: number) {
  return Math.min(1_000_000_000, Math.max(0, value));
}

function savingsProgress(savings: number, target: number) {
  if (target <= 0) {
    return savings > 0 ? 100 : 0;
  }

  return Math.min(100, Math.round((savings / target) * 100));
}

function groupFinanceSnapshots(
  rows: Array<{ date: string; metric_type: string; note?: string | null; value: number }>,
): FinanceSnapshot[] {
  const byDate = new Map<string, FinanceSnapshot>();

  for (const row of rows) {
    const current =
      byDate.get(row.date) ??
      ({
        date: row.date,
        monthly_expenses: 0,
        monthly_income: 0,
        note: null,
        savings_amount: 0,
        savingsProgress: 0,
        target_amount: 0,
      } satisfies FinanceSnapshot);

    if (row.metric_type === "savings_amount") current.savings_amount = Number(row.value);
    if (row.metric_type === "target_amount") current.target_amount = Number(row.value);
    if (row.metric_type === "monthly_income") current.monthly_income = Number(row.value);
    if (row.metric_type === "monthly_expenses") current.monthly_expenses = Number(row.value);
    if (row.note) {
      current.note = row.note;
    }

    current.savingsProgress = savingsProgress(current.savings_amount, current.target_amount);
    byDate.set(row.date, current);
  }

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function computeFinanceScore(input: {
  activities: FinanceBranchData["activities"];
  latest: FinanceSnapshot | null;
}) {
  const { activities, latest } = input;

  if (!latest) {
    return activities.goals.length > 0 ? 20 : 0;
  }

  const savingsPart = latest.savingsProgress * 0.5;
  const stabilityPart =
    latest.monthly_income > 0
      ? Math.min(30, Math.round((1 - latest.monthly_expenses / latest.monthly_income) * 30))
      : 0;
  const goalsPart = Math.min(
    20,
    activities.goals.reduce((sum, goal) => sum + Number(goal.progress ?? 0), 0) /
      Math.max(1, activities.goals.length) /
      5,
  );

  return Math.min(100, Math.round(savingsPart + stabilityPart + goalsPart));
}

export function buildFinanceInsight(input: {
  activities: FinanceBranchData["activities"];
  latest: FinanceSnapshot | null;
}): FinanceInsight {
  const { activities, latest } = input;

  if (activities.goals.length === 0) {
    return {
      content:
        "Создайте финансовую цель в сфере «Финансы» — накопление, подушка или крупная покупка — и отслеживайте прогресс через челлендж.",
      title: "Задайте финансовый квест",
    };
  }

  if (activities.habits.length === 0) {
    return {
      content:
        "Добавьте короткий ритуал финансового учёта — еженедельный обзор или фиксация накоплений — без сложного бухгалтерского трекера.",
      title: "Ритуал финансовой устойчивости",
    };
  }

  if (latest && latest.target_amount > 0) {
    return {
      content: `Накопления: ${latest.savingsProgress}% к цели. Можно обновлять snapshot и уточнять шаги в связанном квесте — без обещаний доходности.`,
      title: "Прогресс к цели накоплений",
    };
  }

  return {
    content:
      "Финансовая ветка активна через цели и ритуалы. Внесите snapshot накоплений, чтобы видеть динамику устойчивости.",
    title: "Финансовая траектория",
  };
}

export async function createFinanceEntry(
  supabase: SupabaseClient,
  userId: string,
  input: FinanceEntryInput,
) {
  const date = input.date ?? todayIsoDate();
  const note = sanitizeBranchNote(input.note);

  const values: Array<{ metric_type: FinanceMetricType; value: number }> = [
    { metric_type: "savings_amount", value: clampFinanceValue("savings_amount", input.savings_amount) },
    { metric_type: "target_amount", value: clampFinanceValue("target_amount", input.target_amount) },
    { metric_type: "monthly_income", value: clampFinanceValue("monthly_income", input.monthly_income) },
    {
      metric_type: "monthly_expenses",
      value: clampFinanceValue("monthly_expenses", input.monthly_expenses),
    },
  ];

  await supabase.from("finance_metrics").delete().eq("user_id", userId).eq("date", date);

  const rows = values.map((item) => ({
    date,
    metric_type: item.metric_type,
    note: item.metric_type === "savings_amount" ? note : null,
    user_id: userId,
    value: item.value,
  }));

  const { error } = await supabase.from("finance_metrics").insert(rows);

  if (error) {
    throw new Error("Не удалось сохранить финансовый snapshot.");
  }

  return { date };
}

export async function getFinanceBranchData(
  supabase: SupabaseClient,
  userId: string,
): Promise<FinanceBranchData> {
  const [metricsResult, activities] = await Promise.all([
    supabase
      .from("finance_metrics")
      .select("date,metric_type,value,note")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(28),
    getBranchActivities(supabase, userId, ["finance"]),
  ]);

  if (metricsResult.error) {
    throw new Error("Не удалось загрузить финансовые данные.");
  }

  const history = groupFinanceSnapshots(metricsResult.data ?? []);
  const latest = history[0] ?? null;

  return {
    activities,
    financeScore: computeFinanceScore({ activities, latest }),
    history: history.slice(0, 7),
    insight: buildFinanceInsight({ activities, latest }),
    latest,
  };
}
