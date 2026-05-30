import type { SupabaseClient } from "@supabase/supabase-js";

import { getBranchActivities, sanitizeBranchNote } from "@/lib/domain/branches";
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

export type HealthBranchData = {
  activities: {
    challenges: Challenge[];
    goals: Goal[];
    habits: Habit[];
  };
  history: HealthSnapshot[];
  insight: HealthInsight;
  latest: HealthSnapshot | null;
  wellnessScore: number;
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

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

export function buildHealthInsight(input: {
  activities: HealthBranchData["activities"];
  latest: HealthSnapshot | null;
}): HealthInsight {
  const { activities, latest } = input;

  if (!latest) {
    return {
      content:
        "Внесите первую wellness-запись: энергия, сон, активность и восстановление. Это поможет видеть динамику без медицинских обещаний.",
      title: "Начните wellness-журнал",
    };
  }

  if (activities.habits.length === 0) {
    return {
      content:
        "Добавьте небольшой wellness-ритуал в сфере «Здоровье» — прогулка, растяжка или режим сна — и свяжите его с целью.",
      title: "Создайте wellness-ритуал",
    };
  }

  if (latest.activity_minutes < 20) {
    return {
      content:
        "Активность ниже вашего обычного порога. Можно добавить короткий wellness-шаг — прогулку или лёгкую разминку — без медицинских обещаний.",
      title: "Мягкий wellness-шаг",
    };
  }

  return {
    content:
      "Wellness-ветка движется: есть метрики и ритуалы. Продолжайте отслеживать энергию и восстановление в связке с целями.",
    title: "Стабильная wellness-траектория",
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

  await supabase.from("health_metrics").delete().eq("user_id", userId).eq("date", date);

  const rows = values.map((item) => ({
    date,
    metric_type: item.metric_type,
    note: item.metric_type === "energy_level" ? note : null,
    user_id: userId,
    value: item.value,
  }));

  const { error } = await supabase.from("health_metrics").insert(rows);

  if (error) {
    throw new Error("Не удалось сохранить wellness-запись.");
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
    throw new Error("Не удалось загрузить wellness-данные.");
  }

  const history = groupHealthSnapshots(metricsResult.data ?? []);
  const latest = history[0] ?? null;
  const wellnessScore = computeWellnessScore(latest);

  return {
    activities,
    history: history.slice(0, 7),
    insight: buildHealthInsight({ activities, latest }),
    latest,
    wellnessScore,
  };
}
