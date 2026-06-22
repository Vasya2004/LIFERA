import type { PlanTier } from "@/lib/domain/types";

/** Keep in sync with FREE_LIMITS in subscription.ts */
const FREE_GOALS = 3;
const FREE_MISSIONS = 2;
const FREE_RITUALS = 5;
const FREE_WEEKLY_RECOMMENDATIONS = 3;
const FREE_HISTORY_DAYS = 7;

export type PlanFeatureStatus = "included" | "coming_soon" | "demo_only";

export type PlanFeature = {
  label: string;
  status: PlanFeatureStatus;
};

export type FeatureMatrixValue = "available" | "limited" | "soon" | "not_included";

export type FeatureMatrixRow = {
  free: FeatureMatrixValue;
  label: string;
  pro: FeatureMatrixValue;
  ultra: FeatureMatrixValue;
};

export type FeatureMatrixGroup = {
  rows: FeatureMatrixRow[];
  title: string;
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export const PLAN_ROLES: Record<PlanTier, string> = {
  free: "Стартовая система",
  pro: "Полная Life OS",
  ultra: "AI-стратег",
};

export const PLAN_VALUE_PROMISES: Record<PlanTier, string> = {
  free: "Начните с целей, привычек и базового прогресса.",
  pro: "Управляйте всеми сферами жизни без ограничений и смотрите полную динамику.",
  ultra: "Получайте стратегические отчёты, разбор паттернов и персональные рекомендации.",
};

export const PLAN_AUDIENCE: Record<PlanTier, string> = {
  free: "Для первого запуска системы прогресса и знакомства с Lifera.",
  pro: "Для тех, кто строит полноценную Life OS без лимитов на ядро.",
  ultra: "Для тех, кому нужен глубокий рекомендательный слой поверх системы.",
};

export const PLAN_PRICES: Record<PlanTier, { amount: string; note: string }> = {
  free: { amount: "0 ₽", note: "навсегда" },
  pro: { amount: "499 ₽", note: "в месяц" },
  ultra: { amount: "999 ₽", note: "в месяц" },
};

export const PLAN_CTAS: Record<PlanTier, { href: string; label: string }> = {
  free: { href: "/register", label: "Начать бесплатно" },
  pro: { href: "/register?plan=pro", label: "Выбрать Pro" },
  ultra: { href: "/register?plan=ultra", label: "Выбрать Ultra" },
};

export const PLAN_RECOMMENDED: PlanTier = "pro";

export const FEATURE_MATRIX_LABELS: Record<FeatureMatrixValue, string> = {
  available: "Доступно",
  limited: "Ограничено",
  not_included: "Не входит",
  soon: "Скоро",
};

export const PLAN_INCLUDED_NOW: Record<PlanTier, PlanFeature[]> = {
  free: [
    { label: `До ${FREE_GOALS} активных целей`, status: "included" },
    { label: `До ${FREE_MISSIONS} активных планов цели`, status: "included" },
    { label: `До ${FREE_RITUALS} регулярных привычек`, status: "included" },
    { label: "Базовый прогресс и достижения", status: "included" },
    {
      label: `Базовые рекомендации Lifera (до ${FREE_WEEKLY_RECOMMENDATIONS} в неделю)`,
      status: "included",
    },
    { label: `История прогресса за ${FREE_HISTORY_DAYS} дней`, status: "included" },
    { label: "Ветки навыков, здоровья и финансов", status: "included" },
  ],
  pro: [
    { label: "Безлимит активных целей, планов цели и привычек", status: "included" },
    { label: "Полная история прогресса", status: "included" },
    { label: "Расширенная аналитика прогресса", status: "included" },
    { label: "Pro-шаблоны привычек", status: "included" },
    { label: "Генерация привычек (rule-based)", status: "included" },
    { label: "Расширенные рекомендации Lifera", status: "included" },
  ],
  ultra: [
    { label: "Всё из Pro", status: "included" },
    { label: "Расширенные рекомендации и приоритетные подсказки", status: "included" },
    { label: "Premium-шаблоны и достижения", status: "coming_soon" },
  ],
};

export const PLAN_COMING_SOON: Record<PlanTier, string[]> = {
  free: [],
  pro: ["Декомпозиция целей с AI", "Расширенные weekly-отчёты"],
  ultra: [
    "Еженедельные и месячные стратегические отчёты",
    "Анализ паттернов и risk alerts",
    "Продвинутый AI-режим ассистента",
  ],
};

export const PLAN_FEATURE_MATRIX: FeatureMatrixGroup[] = [
  {
    title: "Ядро системы",
    rows: [
      {
        label: "Активные цели",
        free: "limited",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Планы цели",
        free: "limited",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Регулярные привычки",
        free: "limited",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Ветки навыков, здоровья и финансов",
        free: "available",
        pro: "available",
        ultra: "available",
      },
    ],
  },
  {
    title: "Прогресс",
    rows: [
      {
        label: "История прогресса",
        free: "limited",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Источники опыта",
        free: "available",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Сферы жизни",
        free: "available",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Достижения",
        free: "available",
        pro: "available",
        ultra: "available",
      },
    ],
  },
  {
    title: "Ассистент",
    rows: [
      {
        label: "Базовые рекомендации Lifera",
        free: "limited",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Расширенные рекомендации",
        free: "not_included",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Еженедельный отчёт",
        free: "not_included",
        pro: "soon",
        ultra: "soon",
      },
      {
        label: "AI-стратегия",
        free: "not_included",
        pro: "soon",
        ultra: "soon",
      },
    ],
  },
  {
    title: "Шаблоны и достижения",
    rows: [
      {
        label: "Базовые привычки",
        free: "available",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Premium-шаблоны",
        free: "not_included",
        pro: "available",
        ultra: "available",
      },
      {
        label: "Premium-достижения",
        free: "not_included",
        pro: "not_included",
        ultra: "soon",
      },
    ],
  },
];

export const FREE_LIMITS_COPY = {
  goals: `До ${FREE_GOALS} активных целей`,
  missions: `До ${FREE_MISSIONS} активных планов цели`,
  rituals: `До ${FREE_RITUALS} регулярных привычек`,
  recommendations: `Базовые рекомендации Lifera (до ${FREE_WEEKLY_RECOMMENDATIONS} в неделю)`,
  history: `История прогресса за ${FREE_HISTORY_DAYS} дней`,
} as const;

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

export function recommendedUpgradePlan(currentPlan: PlanTier): PlanTier | null {
  if (currentPlan === "free") {
    return "pro";
  }

  if (currentPlan === "pro") {
    return "ultra";
  }

  return null;
}

export function planAccessLabel(plan: PlanTier) {
  return PLAN_ROLES[plan];
}
