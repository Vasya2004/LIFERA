import type { PlanTier } from "@/lib/domain/types";

export type PlanFeatureStatus = "included" | "coming_soon" | "demo_only";

export type PlanFeature = {
  label: string;
  status: PlanFeatureStatus;
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export const PLAN_FEATURES: Record<PlanTier, PlanFeature[]> = {
  free: [
    { label: "До 3 активных целей", status: "included" },
    { label: "До 2 активных челленджей", status: "included" },
    { label: "До 5 активных привычек", status: "included" },
    { label: "3 AI-рекомендации в неделю", status: "included" },
    { label: "История прогресса за 7 дней", status: "included" },
    { label: "Базовые достижения и Dashboard", status: "included" },
  ],
  pro: [
    { label: "Неограниченные цели, челленджи и привычки", status: "included" },
    { label: "Premium-шаблоны челленджей", status: "included" },
    { label: "AI-генерация челленджей", status: "included" },
    { label: "История прогресса без ограничений", status: "included" },
    { label: "Расширенная аналитика прогресса", status: "coming_soon" },
    { label: "AI-декомпозиция целей", status: "coming_soon" },
  ],
  ultra: [
    { label: "Всё из Pro", status: "included" },
    { label: "Продвинутый AI Ассистент", status: "coming_soon" },
    { label: "Недельные и месячные AI-отчёты", status: "coming_soon" },
    { label: "Ultra-достижения", status: "coming_soon" },
    { label: "Ранний доступ к новым функциям", status: "coming_soon" },
  ],
};

export function normalizePlanTier(value: string | null | undefined): PlanTier {
  if (value === "pro" || value === "ultra") {
    return value;
  }

  if (value === "premium") {
    return "pro";
  }

  return "free";
}

export function normalizeIntendedPlan(value: string | null | undefined): PlanTier | null {
  if (value === "pro" || value === "ultra") {
    return value;
  }

  return null;
}
