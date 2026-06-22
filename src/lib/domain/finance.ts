import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate } from "@/lib/utils/date";
import { getBranchActivities, sanitizeBranchNote, type BranchRecommendation } from "@/lib/domain/branches";
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

export type FinanceStatusLabel = "moving" | "needs_snapshot" | "near_goal";

export const FINANCE_STATUS_LABELS: Record<FinanceStatusLabel, string> = {
  moving: "Движение есть",
  near_goal: "Цель близко",
  needs_snapshot: "Нужен новый снимок",
};

export type FinanceTrendPoint = {
  date: string;
  isLatest: boolean;
  label: string;
  progress: number;
  savings: number;
  target: number;
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
  recommendation: BranchRecommendation;
  status: FinanceStatusLabel;
  trend: FinanceTrendPoint[];
};

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

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
}

export function computeFinanceStatus(input: {
  history: FinanceSnapshot[];
  latest: FinanceSnapshot | null;
}): FinanceStatusLabel {
  const { history, latest } = input;

  if (!latest) {
    return "needs_snapshot";
  }

  if (latest.target_amount > 0 && latest.savingsProgress >= 80) {
    return "near_goal";
  }

  if (history.length >= 2) {
    const previous = history[1];
    if (latest.savings_amount > previous.savings_amount || latest.savingsProgress > previous.savingsProgress) {
      return "moving";
    }
  } else if (latest.savings_amount > 0) {
    return "moving";
  }

  return "needs_snapshot";
}

function buildFinanceTrend(history: FinanceSnapshot[]): FinanceTrendPoint[] {
  const chronological = [...history].reverse().slice(-7);

  return chronological.map((entry, index) => ({
    date: entry.date,
    isLatest: index === chronological.length - 1,
    label: dayLabel(entry.date),
    progress: entry.savingsProgress,
    savings: entry.savings_amount,
    target: entry.target_amount,
  }));
}

export function buildFinanceRecommendation(input: {
  activities: FinanceBranchData["activities"];
  latest: FinanceSnapshot | null;
}): BranchRecommendation {
  const { activities, latest } = input;

  if (!latest) {
    return {
      content:
        "Добавьте первый финансовый снимок — накопления и цель помогут видеть движение к устойчивости.",
      ctaHref: "#finance-entry",
      ctaLabel: "Добавить снимок",
      title: "Добавьте первый финансовый снимок",
    };
  }

  if (activities.goals.length === 0) {
    return {
      content:
        "Создайте финансовую цель — накопление, подушка или крупная покупка — и отслеживайте прогресс через привычки.",
      ctaHref: "/goals",
      ctaLabel: "Создать цель",
      title: "Создайте финансовую цель",
    };
  }

  if (activities.habits.length === 0) {
    return {
      content:
        "Добавьте привычку учёта — короткий еженедельный обзор накоплений без сложного трекера.",
      ctaHref: "/habits",
      ctaLabel: "Создать привычку",
      title: "Добавьте привычку учёта",
    };
  }

  if (latest.savingsProgress < 15 && latest.target_amount > 0) {
    return {
      content:
        "Прогресс к цели пока небольшой. Обновляйте снимки и удерживайте привычку финансового учёта.",
      ctaHref: "#finance-entry",
      ctaLabel: "Обновить снимок",
      title: "Добавьте привычку учёта",
    };
  }

  return {
    content: "Финансовая ветка активна. Продолжайте отслеживать динамику накоплений.",
    ctaHref: "/finance",
    ctaLabel: "Обновить снимок",
    title: "Продолжайте отслеживать динамику",
  };
}

export function buildFinanceInsight(input: {
  activities: FinanceBranchData["activities"];
  latest: FinanceSnapshot | null;
}): FinanceInsight {
  const recommendation = buildFinanceRecommendation(input);
  return {
    content: recommendation.content,
    title: recommendation.title,
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

  const rows = values.map((item) => ({
    date,
    metric_type: item.metric_type,
    note: item.metric_type === "savings_amount" ? note : null,
    user_id: userId,
    value: item.value,
  }));

  const { error: deleteError } = await supabase
    .from("finance_metrics")
    .delete()
    .eq("user_id", userId)
    .eq("date", date)
    .in("metric_type", FINANCE_METRIC_TYPES);

  if (deleteError) {
    throw new Error("Не удалось сохранить финансовый снимок.");
  }

  const { error: insertError } = await supabase.from("finance_metrics").insert(rows);

  if (insertError) {
    throw new Error("Не удалось сохранить финансовый снимок.");
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
  const insightInput = { activities, latest };

  return {
    activities,
    financeScore: computeFinanceScore({ activities, latest }),
    history: history.slice(0, 7),
    insight: buildFinanceInsight(insightInput),
    latest,
    recommendation: buildFinanceRecommendation(insightInput),
    status: computeFinanceStatus({ history, latest }),
    trend: buildFinanceTrend(history.slice(0, 7)),
  };
}

export type FinanceSubscription = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  billing_day: number;
  period: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export const FINANCE_ASSET_CATEGORIES = [
  "cash",
  "investment",
  "crypto",
  "property",
  "other",
] as const;

export type FinanceAssetCategory = (typeof FINANCE_ASSET_CATEGORIES)[number];

export const FINANCE_ASSET_CATEGORY_LABELS: Record<FinanceAssetCategory, string> = {
  cash: "Деньги",
  crypto: "Криптовалюта",
  investment: "Инвестиции",
  other: "Другое",
  property: "Имущество",
};

export type FinanceAsset = {
  amount: number;
  category: FinanceAssetCategory;
  created_at: string;
  currency: string;
  id: string;
  name: string;
  notes: string | null;
  updated_at: string;
  user_id: string;
};

export type FinanceDebt = {
  created_at: string;
  deadline: string | null;
  id: string;
  interest_rate: number | null;
  monthly_payment: number | null;
  name: string;
  notes: string | null;
  remaining_amount: number;
  total_amount: number;
  updated_at: string;
  user_id: string;
};

export type FinanceNetWorthSnapshot = {
  id: string;
  net_worth: number;
  recorded_at: string;
  total_assets: number;
  total_debts: number;
  user_id: string;
};

export type FinanceAssetInput = {
  amount: number;
  category?: FinanceAssetCategory | string;
  currency?: string;
  name: string;
  notes?: string | null;
};

export type FinanceDebtInput = {
  deadline?: string | null;
  interest_rate?: number | null;
  monthly_payment?: number | null;
  name: string;
  notes?: string | null;
  remaining_amount: number;
  total_amount: number;
};

export type FinanceNetWorthPoint = {
  label: string;
  netWorth: number;
  recordedAt: string;
  totalAssets: number;
  totalDebts: number;
};

export type FinancePortfolioData = {
  assets: FinanceAsset[];
  debts: FinanceDebt[];
  history: FinanceNetWorthPoint[];
  latestSnapshot: FinanceNetWorthSnapshot | null;
  summary: {
    debtLoad: number;
    netWorth: number;
    totalAssets: number;
    totalDebts: number;
  };
};

function normalizeAssetCategory(value: string | undefined): FinanceAssetCategory {
  return FINANCE_ASSET_CATEGORIES.includes(value as FinanceAssetCategory)
    ? (value as FinanceAssetCategory)
    : "other";
}

function normalizeAsset(row: Record<string, unknown>): FinanceAsset {
  return {
    amount: Number(row.amount ?? 0),
    category: normalizeAssetCategory(String(row.category ?? "other")),
    created_at: String(row.created_at ?? ""),
    currency: String(row.currency ?? "RUB"),
    id: String(row.id),
    name: String(row.name ?? ""),
    notes: row.notes == null ? null : String(row.notes),
    updated_at: String(row.updated_at ?? ""),
    user_id: String(row.user_id ?? ""),
  };
}

function normalizeDebt(row: Record<string, unknown>): FinanceDebt {
  return {
    created_at: String(row.created_at ?? ""),
    deadline: row.deadline == null ? null : String(row.deadline),
    id: String(row.id),
    interest_rate: row.interest_rate == null ? null : Number(row.interest_rate),
    monthly_payment: row.monthly_payment == null ? null : Number(row.monthly_payment),
    name: String(row.name ?? ""),
    notes: row.notes == null ? null : String(row.notes),
    remaining_amount: Number(row.remaining_amount ?? 0),
    total_amount: Number(row.total_amount ?? 0),
    updated_at: String(row.updated_at ?? ""),
    user_id: String(row.user_id ?? ""),
  };
}

function normalizeNetWorthSnapshot(row: Record<string, unknown>): FinanceNetWorthSnapshot {
  return {
    id: String(row.id),
    net_worth: Number(row.net_worth ?? 0),
    recorded_at: String(row.recorded_at ?? ""),
    total_assets: Number(row.total_assets ?? 0),
    total_debts: Number(row.total_debts ?? 0),
    user_id: String(row.user_id ?? ""),
  };
}

function validateAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} не может быть отрицательной.`);
  }
}

function validateDebtAmounts(totalAmount: number, remainingAmount: number) {
  validateAmount(totalAmount, "Общая сумма");
  validateAmount(remainingAmount, "Остаток долга");

  if (remainingAmount > totalAmount) {
    throw new Error("Остаток долга не может быть больше общей суммы.");
  }
}

function netWorthLabel(recordedAt: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(
    new Date(recordedAt),
  );
}

export async function recordFinanceNetWorthSnapshot(
  supabase: SupabaseClient,
  userId: string,
) {
  const [assetsResult, debtsResult] = await Promise.all([
    supabase.from("finance_assets").select("amount").eq("user_id", userId),
    supabase.from("finance_debts").select("remaining_amount").eq("user_id", userId),
  ]);

  if (assetsResult.error) {
    throw new Error("Не удалось пересчитать активы.");
  }

  if (debtsResult.error) {
    throw new Error("Не удалось пересчитать долги.");
  }

  const totalAssets = (assetsResult.data ?? []).reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0,
  );
  const totalDebts = (debtsResult.data ?? []).reduce(
    (sum, item) => sum + Number(item.remaining_amount ?? 0),
    0,
  );

  const { error } = await supabase.from("finance_net_worth_snapshots").insert({
    net_worth: totalAssets - totalDebts,
    total_assets: totalAssets,
    total_debts: totalDebts,
    user_id: userId,
  });

  if (error) {
    throw new Error("Не удалось сохранить снимок чистого капитала.");
  }
}

export async function getFinancePortfolioData(
  supabase: SupabaseClient,
  userId: string,
): Promise<FinancePortfolioData> {
  const [assetsResult, debtsResult, snapshotsResult] = await Promise.all([
    supabase
      .from("finance_assets")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("finance_debts")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("finance_net_worth_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(12),
  ]);

  if (assetsResult.error || debtsResult.error || snapshotsResult.error) {
    throw new Error("Не удалось загрузить активы и долги.");
  }

  const assets = (assetsResult.data ?? []).map((row) => normalizeAsset(row));
  const debts = (debtsResult.data ?? []).map((row) => normalizeDebt(row));
  const snapshots = (snapshotsResult.data ?? []).map((row) => normalizeNetWorthSnapshot(row));
  const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalDebts = debts.reduce((sum, debt) => sum + debt.remaining_amount, 0);
  const netWorth = totalAssets - totalDebts;
  const debtLoad = totalAssets > 0 ? Math.round((totalDebts / totalAssets) * 100) : 0;
  const historySource =
    snapshots.length > 0
      ? [...snapshots].reverse()
      : [
          {
            id: "current",
            net_worth: netWorth,
            recorded_at: new Date().toISOString(),
            total_assets: totalAssets,
            total_debts: totalDebts,
            user_id: userId,
          },
        ];

  return {
    assets,
    debts,
    history: historySource.map((snapshot) => ({
      label: netWorthLabel(snapshot.recorded_at),
      netWorth: snapshot.net_worth,
      recordedAt: snapshot.recorded_at,
      totalAssets: snapshot.total_assets,
      totalDebts: snapshot.total_debts,
    })),
    latestSnapshot: snapshots[0] ?? null,
    summary: {
      debtLoad,
      netWorth,
      totalAssets,
      totalDebts,
    },
  };
}

export async function createFinanceAsset(
  supabase: SupabaseClient,
  userId: string,
  input: FinanceAssetInput,
) {
  const name = input.name.trim();
  const amount = Number(input.amount ?? 0);

  if (!name) {
    throw new Error("Название актива обязательно.");
  }

  validateAmount(amount, "Сумма актива");

  const { data, error } = await supabase
    .from("finance_assets")
    .insert({
      amount,
      category: normalizeAssetCategory(input.category),
      currency: input.currency?.trim() || "RUB",
      name,
      notes: sanitizeBranchNote(input.notes),
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Не удалось добавить актив.");
  }

  await recordFinanceNetWorthSnapshot(supabase, userId);
  return normalizeAsset(data);
}

export async function updateFinanceAsset(
  supabase: SupabaseClient,
  userId: string,
  assetId: string,
  input: FinanceAssetInput,
) {
  const name = input.name.trim();
  const amount = Number(input.amount ?? 0);

  if (!name) {
    throw new Error("Название актива обязательно.");
  }

  validateAmount(amount, "Сумма актива");

  const { data, error } = await supabase
    .from("finance_assets")
    .update({
      amount,
      category: normalizeAssetCategory(input.category),
      currency: input.currency?.trim() || "RUB",
      name,
      notes: sanitizeBranchNote(input.notes),
    })
    .eq("id", assetId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error("Не удалось обновить актив.");
  }

  await recordFinanceNetWorthSnapshot(supabase, userId);
  return normalizeAsset(data);
}

export async function deleteFinanceAsset(
  supabase: SupabaseClient,
  userId: string,
  assetId: string,
) {
  const { error } = await supabase
    .from("finance_assets")
    .delete()
    .eq("id", assetId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Не удалось удалить актив.");
  }

  await recordFinanceNetWorthSnapshot(supabase, userId);
}

export async function createFinanceDebt(
  supabase: SupabaseClient,
  userId: string,
  input: FinanceDebtInput,
) {
  const name = input.name.trim();
  const totalAmount = Number(input.total_amount ?? 0);
  const remainingAmount = Number(input.remaining_amount ?? 0);

  if (!name) {
    throw new Error("Название долга обязательно.");
  }

  validateDebtAmounts(totalAmount, remainingAmount);
  validateAmount(Number(input.monthly_payment ?? 0), "Ежемесячный платёж");
  validateAmount(Number(input.interest_rate ?? 0), "Процентная ставка");

  const { data, error } = await supabase
    .from("finance_debts")
    .insert({
      deadline: input.deadline || null,
      interest_rate: input.interest_rate || null,
      monthly_payment: input.monthly_payment || null,
      name,
      notes: sanitizeBranchNote(input.notes),
      remaining_amount: remainingAmount,
      total_amount: totalAmount,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error("Не удалось добавить долг.");
  }

  await recordFinanceNetWorthSnapshot(supabase, userId);
  return normalizeDebt(data);
}

export async function updateFinanceDebt(
  supabase: SupabaseClient,
  userId: string,
  debtId: string,
  input: FinanceDebtInput,
) {
  const name = input.name.trim();
  const totalAmount = Number(input.total_amount ?? 0);
  const remainingAmount = Number(input.remaining_amount ?? 0);

  if (!name) {
    throw new Error("Название долга обязательно.");
  }

  validateDebtAmounts(totalAmount, remainingAmount);
  validateAmount(Number(input.monthly_payment ?? 0), "Ежемесячный платёж");
  validateAmount(Number(input.interest_rate ?? 0), "Процентная ставка");

  const { data, error } = await supabase
    .from("finance_debts")
    .update({
      deadline: input.deadline || null,
      interest_rate: input.interest_rate || null,
      monthly_payment: input.monthly_payment || null,
      name,
      notes: sanitizeBranchNote(input.notes),
      remaining_amount: remainingAmount,
      total_amount: totalAmount,
    })
    .eq("id", debtId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error("Не удалось обновить долг.");
  }

  await recordFinanceNetWorthSnapshot(supabase, userId);
  return normalizeDebt(data);
}

export async function deleteFinanceDebt(
  supabase: SupabaseClient,
  userId: string,
  debtId: string,
) {
  const { error } = await supabase
    .from("finance_debts")
    .delete()
    .eq("id", debtId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Не удалось удалить долг.");
  }

  await recordFinanceNetWorthSnapshot(supabase, userId);
}

export async function getFinanceSubscriptions(
  supabase: SupabaseClient,
  userId: string,
): Promise<FinanceSubscription[]> {
  const { data, error } = await supabase
    .from("finance_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("status", { ascending: true }) // active first
    .order("billing_day", { ascending: true });

  if (error) {
    throw new Error("Не удалось загрузить подписки.");
  }

  return data ?? [];
}
