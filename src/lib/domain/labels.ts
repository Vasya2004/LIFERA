export const LIFE_AREA_LABELS: Record<string, string> = {
  career: "Карьера",
  creativity: "Творчество",
  education: "Образование",
  finance: "Финансы",
  health: "Здоровье",
  projects: "Личные проекты",
  relationships: "Отношения",
};

export const GOAL_STATUS_LABELS: Record<string, string> = {
  active: "Активная",
  archived: "В архиве",
  backlog: "Бэклог",
  completed: "Завершена",
};

export const CHALLENGE_STATUS_LABELS: Record<string, string> = {
  active: "Активная миссия",
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

export function formatLifeArea(value: string) {
  return LIFE_AREA_LABELS[value] ?? value;
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
