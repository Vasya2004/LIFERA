export const demoProfile = {
  full_name: "Пользователь Lifera",
  level: 4,
  life_score: 74,
  plan: "free",
  streak_days: 6,
  xp_total: 1820,
  xpToNextLevel: 180,
};

export const demoGoals = [
  {
    id: "demo-goal-1",
    life_area: "projects",
    progress: 62,
    status: "active",
    title: "Запустить рабочую версию Lifera",
  },
  {
    id: "demo-goal-2",
    life_area: "education",
    progress: 38,
    status: "active",
    title: "Подготовить демонстрацию для ВКР",
  },
];

export const demoChallenges = [
  {
    difficulty: "medium",
    id: "demo-challenge-1",
    is_premium: false,
    progress: 40,
    status: "active",
    title: "7 дней системного старта",
  },
  {
    difficulty: "hard",
    id: "demo-challenge-2",
    is_premium: true,
    progress: 0,
    status: "paused",
    title: "Premium Sprint: стратегический рывок",
  },
];

export const demoAchievements = [
  {
    description: "Завершить первый этап челленджа.",
    id: "a1",
    is_premium: false,
    status: "unlocked",
    title: "Первый шаг",
    xp_reward: 50,
  },
  {
    description: "Создать 3 цели.",
    id: "a2",
    is_premium: false,
    status: "locked",
    title: "Стратег",
    xp_reward: 100,
  },
  {
    description: "Достичь 5 уровня.",
    id: "a3",
    is_premium: true,
    status: "locked",
    title: "Уровень 5",
    xp_reward: 200,
  },
];

