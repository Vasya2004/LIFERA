export const LIFE_AREA_LABELS: Record<string, string> = {
  career: "Карьера",
  creativity: "Творчество",
  education: "Обучение",
  finance: "Финансы",
  health: "Здоровье",
  personal_projects: "Личные проекты",
  projects: "Личные проекты",
  relationships: "Отношения",
  skills: "Навыки",
};

export const ENTITY_STATUS_LABELS: Record<string, string> = {
  active: "Активно",
  archived: "Архив",
  backlog: "В планах",
  completed: "Завершено",
  paused: "На паузе",
};

export const GOAL_STATUS_LABELS: Record<string, string> = {
  active: "Активная",
  archived: "В архиве",
  backlog: "В планах",
  completed: "Завершена",
};

export const CHALLENGE_STATUS_LABELS: Record<string, string> = {
  active: "Активная привычка",
  archived: "В архиве",
  completed: "Завершена",
  paused: "На паузе",
};

export const STEP_STATUS_LABELS: Record<string, string> = {
  active: "Текущий шаг",
  completed: "Завершён",
  locked: "Ожидает",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Лёгкая",
  hard: "Сложная",
  medium: "Средняя",
};

export const XP_SOURCE_LABELS: Record<string, string> = {
  achievement: "Достижения",
  challenge_stage: "Этапы привычек",
  habit_log: "Привычки",
  other: "Другое",
};

export const PLAN_PRESENTATION_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  ultra: "Ultra",
};

export function formatLifeArea(value: string) {
  return LIFE_AREA_LABELS[value] ?? value;
}

export function formatEntityStatus(value: string) {
  return ENTITY_STATUS_LABELS[value] ?? GOAL_STATUS_LABELS[value] ?? CHALLENGE_STATUS_LABELS[value] ?? value;
}

export function formatGoalStatus(value: string) {
  return GOAL_STATUS_LABELS[value] ?? formatEntityStatus(value);
}

export function formatChallengeStatus(value: string) {
  return CHALLENGE_STATUS_LABELS[value] ?? formatEntityStatus(value);
}

export function formatXpSource(value: string) {
  return XP_SOURCE_LABELS[value] ?? value;
}

export function formatPlanTier(value: string) {
  return PLAN_PRESENTATION_LABELS[value] ?? value;
}

export function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: "RUB" | "USD" | "EUR" = "RUB",
) {
  if (amount == null || Number.isNaN(Number(amount))) {
    return "—";
  }

  return new Intl.NumberFormat("ru-RU", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(Number(amount));
}
