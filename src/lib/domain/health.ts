import type { SupabaseClient } from "@supabase/supabase-js";

import { todayIsoDate } from "@/lib/utils/date";
import { getBranchActivities, sanitizeBranchNote, type BranchRecommendation } from "@/lib/domain/branches";
import type { Challenge, Goal, Habit } from "@/lib/domain/types";

export const HEALTH_METRIC_TYPES = [
  "energy_level",
  "sleep_hours",
  "activity_minutes",
  "recovery_score",
] as const;

export type HealthMetricType = (typeof HEALTH_METRIC_TYPES)[number];

export type HealthEntryInput = {
  activity_minutes: number;
  date?: string;
  energy_level: number;
  note?: string | null;
  recovery_score: number;
  sleep_hours: number;
};

export type HealthSnapshot = {
  activity_minutes: number;
  date: string;
  energy_level: number;
  note: string | null;
  recovery_score: number;
  sleep_hours: number;
};

export type HealthInsight = {
  content: string;
  title: string;
};

export type HealthStatusLabel = "declining" | "rising" | "stable";

export const HEALTH_STATUS_LABELS: Record<HealthStatusLabel, string> = {
  declining: "Есть просадка",
  rising: "Хорошая динамика",
  stable: "Стабильно",
};

export type HealthTrendDay = {
  activity: number;
  date: string;
  energy: number;
  isToday: boolean;
  label: string;
  sleep: number;
};

export type HealthBranchData = {
  activities: {
    challenges: Challenge[];
    goals: Goal[];
    habits: Habit[];
  };
  allHistory: HealthSnapshot[];
  hasEnoughDataForDynamics: boolean;
  history: HealthSnapshot[];
  insight: HealthInsight;
  latest: HealthSnapshot | null;
  recommendation: BranchRecommendation;
  status: HealthStatusLabel;
  todayRecord: HealthSnapshot | null;
  trend: HealthTrendDay[];
  wellnessScore: number;
};

function clampMetric(type: HealthMetricType, value: number) {
  if (type === "energy_level" || type === "recovery_score") {
    return Math.min(10, Math.max(1, value));
  }

  if (type === "sleep_hours") {
    return Math.min(14, Math.max(0, value));
  }

  return Math.min(600, Math.max(0, value));
}

function groupHealthSnapshots(
  rows: Array<{ date: string; metric_type: string; note?: string | null; value: number }>,
): HealthSnapshot[] {
  const byDate = new Map<string, HealthSnapshot>();

  for (const row of rows) {
    const current =
      byDate.get(row.date) ??
      ({
        activity_minutes: 0,
        date: row.date,
        energy_level: 0,
        note: null,
        recovery_score: 0,
        sleep_hours: 0,
      } satisfies HealthSnapshot);

    if (row.metric_type === "energy_level") current.energy_level = Number(row.value);
    if (row.metric_type === "sleep_hours") current.sleep_hours = Number(row.value);
    if (row.metric_type === "activity_minutes") current.activity_minutes = Number(row.value);
    if (row.metric_type === "recovery_score") current.recovery_score = Number(row.value);
    if (row.note) {
      current.note = row.note;
    }

    byDate.set(row.date, current);
  }

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function computeWellnessScore(snapshot: HealthSnapshot | null) {
  if (!snapshot) {
    return 0;
  }

  const energyPart = (snapshot.energy_level / 10) * 25;
  const recoveryPart = (snapshot.recovery_score / 10) * 25;
  const sleepPart = Math.min(snapshot.sleep_hours / 8, 1) * 25;
  const activityPart = Math.min(snapshot.activity_minutes / 45, 1) * 25;

  return Math.round(energyPart + recoveryPart + sleepPart + activityPart);
}

function dayLabel(date: string) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(new Date(`${date}T12:00:00`));
}

export function computeHealthStatus(input: {
  history: HealthSnapshot[];
  latest: HealthSnapshot | null;
  wellnessScore: number;
}): HealthStatusLabel {
  const { history, latest, wellnessScore } = input;

  if (!latest) {
    return "stable";
  }

  if (latest.energy_level <= 4 || wellnessScore < 45) {
    return "declining";
  }

  if (history.length >= 2) {
    const previous = history[1];
    if (wellnessScore >= 65 && wellnessScore > computeWellnessScore(previous)) {
      return "rising";
    }
  } else if (wellnessScore >= 70) {
    return "rising";
  }

  return "stable";
}

function buildHealthTrend(history: HealthSnapshot[]): HealthTrendDay[] {
  const today = todayIsoDate();
  const chronological = [...history].reverse().slice(-7);

  return chronological.map((entry) => ({
    activity: entry.activity_minutes,
    date: entry.date,
    energy: entry.energy_level,
    isToday: entry.date === today,
    label: dayLabel(entry.date),
    sleep: entry.sleep_hours,
  }));
}

export function buildHealthRecommendation(input: {
  activities: HealthBranchData["activities"];
  latest: HealthSnapshot | null;
}): BranchRecommendation {
  const { activities, latest } = input;

  if (!latest) {
    return {
      content:
        "Добавьте первую запись состояния: энергия, сон и активность помогут видеть динамику без медицинских обещаний.",
      ctaHref: "#health-entry",
      ctaLabel: "Добавить запись",
      title: "Добавьте первую запись состояния",
    };
  }

  if (latest.energy_level <= 4) {
    return {
      content:
        "Энергия ниже обычного. Добавьте простую привычку восстановления — прогулку, сон или короткую разминку.",
      ctaHref: "/habits",
      ctaLabel: "Создать привычку",
      title: "Добавьте простую привычку восстановления",
    };
  }

  if (activities.habits.length === 0) {
    return {
      content:
        "Создайте привычку для здоровья — короткая регулярная практика поможет удерживать ритм восстановления.",
      ctaHref: "/habits",
      ctaLabel: "Создать привычку",
      title: "Создайте привычку для здоровья",
    };
  }

  return {
    content: "Состояние отслеживается. Продолжайте текущий ритм и связывайте его с целями.",
    ctaHref: "/dashboard",
    ctaLabel: "Продолжить фокус",
    title: "Продолжайте текущий ритм",
  };
}

export function buildHealthInsight(input: {
  activities: HealthBranchData["activities"];
  latest: HealthSnapshot | null;
}): HealthInsight {
  const recommendation = buildHealthRecommendation(input);
  return {
    content: recommendation.content,
    title: recommendation.title,
  };
}

export async function createHealthEntry(
  supabase: SupabaseClient,
  userId: string,
  input: HealthEntryInput,
) {
  const date = input.date ?? todayIsoDate();
  const note = sanitizeBranchNote(input.note);

  const values: Array<{ metric_type: HealthMetricType; value: number }> = [
    { metric_type: "energy_level", value: clampMetric("energy_level", input.energy_level) },
    { metric_type: "sleep_hours", value: clampMetric("sleep_hours", input.sleep_hours) },
    {
      metric_type: "activity_minutes",
      value: clampMetric("activity_minutes", input.activity_minutes),
    },
    { metric_type: "recovery_score", value: clampMetric("recovery_score", input.recovery_score) },
  ];

  const rows = values.map((item) => ({
    date,
    metric_type: item.metric_type,
    note: item.metric_type === "energy_level" ? note : null,
    user_id: userId,
    value: item.value,
  }));

  const { error: deleteError } = await supabase
    .from("health_metrics")
    .delete()
    .eq("user_id", userId)
    .eq("date", date)
    .in("metric_type", HEALTH_METRIC_TYPES);

  if (deleteError) {
    throw new Error("Не удалось сохранить запись состояния.");
  }

  const { error: insertError } = await supabase.from("health_metrics").insert(rows);

  if (insertError) {
    throw new Error("Не удалось сохранить запись состояния.");
  }

  return { date };
}

export async function getHealthBranchData(
  supabase: SupabaseClient,
  userId: string,
): Promise<HealthBranchData> {
  const [metricsResult, activities] = await Promise.all([
    supabase
      .from("health_metrics")
      .select("date,metric_type,value,note")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(28),
    getBranchActivities(supabase, userId, ["health"]),
  ]);

  if (metricsResult.error) {
    throw new Error("Не удалось загрузить данные здоровья.");
  }

  const history = groupHealthSnapshots(metricsResult.data ?? []);
  const latest = history[0] ?? null;
  const wellnessScore = computeWellnessScore(latest);
  const insightInput = { activities, latest };
  const today = todayIsoDate();
  const todayRecord = history.find((h) => h.date === today) ?? null;

  return {
    activities,
    allHistory: history,
    hasEnoughDataForDynamics: history.length >= 2,
    history: history.slice(0, 7),
    insight: buildHealthInsight(insightInput),
    latest,
    recommendation: buildHealthRecommendation(insightInput),
    status: computeHealthStatus({ history, latest, wellnessScore }),
    todayRecord,
    trend: buildHealthTrend(history.slice(0, 7)),
    wellnessScore,
  };
}
