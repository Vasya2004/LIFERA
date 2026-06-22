export type FocusAreaOption = {
  description: string;
  icon: string;
  label: string;
  value: string;
};

export const ONBOARDING_STEPS = [
  "Приветствие",
  "Цель",
  "Привычка",
  "Здоровье",
  "Достижение",
] as const;

export const STARTER_MISSION = {
  durationDays: 7,
  stageCount: 5,
  title: "7 дней системного старта",
  totalXp: 400,
  xpPerStage: 80,
} as const;

export const FOCUS_AREAS: FocusAreaOption[] = [
  {
    description: "Энергия, сон и физическое состояние",
    icon: "health",
    label: "Здоровье",
    value: "health",
  },
  {
    description: "Доход, бюджет и финансовая устойчивость",
    icon: "wallet",
    label: "Финансы",
    value: "finance",
  },
  {
    description: "Практика навыков и осознанный рост",
    icon: "spark",
    label: "Навыки",
    value: "skills",
  },
  {
    description: "Работа, доход и профессиональный траектория",
    icon: "target",
    label: "Карьера",
    value: "career",
  },
  {
    description: "Близость, общение и поддержка",
    icon: "heart",
    label: "Отношения",
    value: "relationships",
  },
  {
    description: "Самовыражение и творческие проекты",
    icon: "spark",
    label: "Творчество",
    value: "creativity",
  },
  {
    description: "Личные инициативы и side-проекты",
    icon: "folder",
    label: "Личные проекты",
    value: "projects",
  },
  {
    description: "Курсы, знания и системное обучение",
    icon: "progress",
    label: "Обучение",
    value: "education",
  },
];

export const GOAL_EXAMPLES: Record<string, string[]> = {
  career: [
    "Например: выйти на стабильный доход от фриланса",
    "Например: получить повышение до middle-уровня",
  ],
  creativity: [
    "Например: выпустить мини-альбом или серию работ",
    "Например: завершить творческий pet-проект",
  ],
  education: [
    "Например: прокачать английский до B1",
    "Например: пройти профильный курс за 8 недель",
  ],
  finance: [
    "Например: выйти на стабильные 150 000 ₽ в месяц",
    "Например: создать подушку безопасности на 3 месяца",
  ],
  health: [
    "Например: восстановить режим сна и энергии",
    "Например: вернуться к регулярным тренировкам",
  ],
  projects: [
    "Например: запустить рабочую версию pet-проекта",
    "Например: довести личный проект до первых пользователей",
  ],
  relationships: [
    "Например: выделить время на качественное общение",
    "Например: восстановить регулярный контакт с близкими",
  ],
  skills: [
    "Например: прокачать английский до B1",
    "Например: освоить новый инструмент для работы",
  ],
};

export const RITUAL_SUGGESTIONS: Record<string, string[]> = {
  career: ["1 действие для дохода", "Контакт с клиентом", "Портфолио 20 минут"],
  creativity: ["30 минут творческой практики", "1 эскиз или черновик", "Обновить проект"],
  education: ["20 минут практики", "1 урок", "1 заметка по обучению"],
  finance: ["Записать траты", "Проверить бюджет", "Отложить 100 ₽"],
  health: ["10 минут прогулки", "Сон до 23:30", "Утренняя зарядка"],
  projects: ["30 минут deep work", "Обновить проект", "Сделать один шаг"],
  relationships: ["Сообщение близкому", "10 минут без телефона", "Запланировать встречу"],
  skills: ["20 минут практики", "1 урок", "1 заметка по обучению"],
};

export function ritualsForFocus(focus: string) {
  return RITUAL_SUGGESTIONS[focus] ?? RITUAL_SUGGESTIONS.projects;
}

export function goalExamplesForFocus(focus: string) {
  return GOAL_EXAMPLES[focus] ?? GOAL_EXAMPLES.projects;
}
