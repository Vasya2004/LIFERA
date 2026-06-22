import { existsSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const DEMO_EMAIL = "lifera.diploma.demo@example.com";

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Seed aborted: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local environment.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const today = new Date();

function isoDate(offsetDays = 0) {
  const date = new Date(today);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function isoTimestamp(offsetDays = 0, hour = 9) {
  const date = new Date(today);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function requireData(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  return result.data;
}

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(`auth.listUsers: ${error.message}`);
    }

    const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function deleteForUser(table, userId) {
  const { error } = await supabase.from(table).delete().eq("user_id", userId);

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }
}

async function resetDemoData(userId) {
  requireData(
    await supabase.from("user_profiles").update({ primary_goal_id: null }).eq("user_id", userId),
    "reset primary_goal_id",
  );

  for (const table of [
    "habit_logs",
    "xp_transactions",
    "challenge_stages",
    "habits",
    "ai_recommendations",
    "wishes",
    "finance_metrics",
    "health_metrics",
    "achievements",
    "challenges",
    "goals",
    "skills",
  ]) {
    await deleteForUser(table, userId);
  }
}

async function seedProfile(userId) {
  requireData(
    await supabase.from("user_profiles").upsert(
      {
        full_name: "Алексей",
        intended_plan: "pro",
        level: 3,
        life_score: 68,
        onboarding_completed: true,
        plan: "pro",
        preferred_theme: "system",
        selected_life_areas: ["projects", "health", "finance", "skills"],
        streak_days: 7,
        user_id: userId,
        xp_total: 720,
      },
      { onConflict: "user_id" },
    ),
    "profile upsert",
  );

  requireData(
    await supabase.from("subscriptions").upsert(
      {
        period_end: isoTimestamp(30),
        period_start: isoTimestamp(-1),
        plan: "pro",
        provider: "demo",
        status: "active",
        user_id: userId,
      },
      { onConflict: "user_id" },
    ),
    "subscription upsert",
  );
}

async function seedSkills(userId) {
  const rows = [
    { category: "hard", level: 2, progress: 32, title: "Английский язык", xp_total: 180 },
    { category: "hard", level: 2, progress: 45, title: "Веб-дизайн", xp_total: 240 },
    { category: "hard", level: 2, progress: 38, title: "Работа с AI-инструментами", xp_total: 210 },
    { category: "soft", level: 2, progress: 40, title: "Дисциплина", xp_total: 220 },
    { category: "soft", level: 2, progress: 35, title: "Фокус", xp_total: 170 },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-28 + index * 2),
    status: "active",
    user_id: userId,
  }));

  return requireData(await supabase.from("skills").insert(rows).select("*"), "skills insert");
}

async function seedGoals(userId, skillsByTitle) {
  const rows = [
    {
      description:
        "Навести порядок в целях, привычках, здоровье и финансах, чтобы каждый день видеть понятный следующий шаг.",
      life_area: "projects",
      progress: 42,
      skill_id: skillsByTitle.get("Дисциплина")?.id ?? null,
      target_date: isoDate(76),
      title: "Собрать личную систему прогресса",
    },
    {
      description: "Сделать движение и восстановление регулярной частью недели.",
      life_area: "health",
      progress: 36,
      skill_id: null,
      target_date: isoDate(64),
      title: "Улучшить физическую форму",
    },
    {
      description: "Сформировать запас спокойствия на несколько месяцев базовых расходов.",
      life_area: "finance",
      progress: 26,
      skill_id: null,
      target_date: isoDate(148),
      title: "Создать финансовую подушку",
    },
    {
      description: "Удерживать регулярную практику и свободнее читать рабочие материалы.",
      life_area: "skills",
      progress: 31,
      skill_id: skillsByTitle.get("Английский язык")?.id ?? null,
      target_date: isoDate(112),
      title: "Прокачать английский язык",
    },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-35 + index * 4),
    status: "active",
    updated_at: isoTimestamp(-1),
    user_id: userId,
  }));

  const goals = requireData(await supabase.from("goals").insert(rows).select("*"), "goals insert");
  const mainGoal = goals.find((goal) => goal.title === "Собрать личную систему прогресса");

  requireData(
    await supabase.from("user_profiles").update({ primary_goal_id: mainGoal.id }).eq("user_id", userId),
    "primary goal update",
  );

  return goals;
}

async function seedWishes(userId, goalsByTitle) {
  const rows = [
    {
      category: "Путешествия",
      current_amount: 28000,
      description:
        "Отдохнуть, перезагрузиться и закрепить ощущение, что регулярные действия дают результат.",
      is_primary: true,
      linked_goal_id: goalsByTitle.get("Собрать личную систему прогресса")?.id ?? null,
      status: "wanted",
      target_amount: 120000,
      title: "Поездка на море осенью",
    },
    {
      category: "Дом",
      current_amount: 6000,
      description: "Собрать спокойное рабочее место для фокуса и учёбы.",
      is_primary: false,
      linked_goal_id: null,
      status: "wanted",
      target_amount: 25000,
      title: "Новый рабочий стол",
    },
    {
      category: "Обучение",
      current_amount: 9000,
      description: "Курс с разговорной практикой и понятным расписанием.",
      is_primary: false,
      linked_goal_id: goalsByTitle.get("Прокачать английский язык")?.id ?? null,
      status: "wanted",
      target_amount: 18000,
      title: "Курс английского",
    },
    {
      category: "Гаджеты / Здоровье",
      current_amount: 2500,
      description: "Отслеживать активность и сон без лишней нагрузки.",
      is_primary: false,
      linked_goal_id: goalsByTitle.get("Улучшить физическую форму")?.id ?? null,
      status: "wanted",
      target_amount: 7000,
      title: "Фитнес-браслет",
    },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-22 + index * 3),
    user_id: userId,
  }));

  return requireData(await supabase.from("wishes").insert(rows).select("*"), "wishes insert");
}

async function seedChallenges(userId, goalsByTitle) {
  const rows = [
    {
      current_stage: 2,
      description: "Неделя спокойного старта: цель, план, первый ритм и вечерний обзор.",
      difficulty: "easy",
      duration_days: 7,
      goal_id: goalsByTitle.get("Собрать личную систему прогресса")?.id ?? null,
      progress: 43,
      title: "7 дней системного старта",
      xp_reward_total: 210,
    },
    {
      current_stage: 3,
      description: "Мягко вернуть движение в неделю через прогулки и короткие тренировки.",
      difficulty: "medium",
      duration_days: 28,
      goal_id: goalsByTitle.get("Улучшить физическую форму")?.id ?? null,
      progress: 36,
      title: "Ритм движения",
      xp_reward_total: 320,
    },
    {
      current_stage: 2,
      description: "Каждый день фиксировать расходы и видеть свободный остаток.",
      difficulty: "easy",
      duration_days: 14,
      goal_id: goalsByTitle.get("Создать финансовую подушку")?.id ?? null,
      progress: 28,
      title: "Финансовый порядок",
      xp_reward_total: 180,
    },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-14 + index * 2),
    is_premium: false,
    is_template: false,
    status: "active",
    updated_at: isoTimestamp(-1),
    user_id: userId,
  }));

  const challenges = requireData(
    await supabase.from("challenges").insert(rows).select("*"),
    "challenges insert",
  );

  const stageRows = challenges.flatMap((challenge) =>
    ["Первый шаг", "Закрепить ритм", "Проверить прогресс"].map((title, index) => {
      const completed = index + 1 < Number(challenge.current_stage);
      const active = index + 1 === Number(challenge.current_stage);

      return {
        challenge_id: challenge.id,
        completed_at: completed ? isoTimestamp(-7 + index) : null,
        created_at: isoTimestamp(-14 + index),
        description: `${title} для миссии «${challenge.title}».`,
        order_index: index + 1,
        progress_value: completed ? 100 : active ? 35 : 0,
        status: completed ? "completed" : active ? "active" : "locked",
        title,
        user_id: userId,
        xp_reward: 40 + index * 10,
      };
    }),
  );

  requireData(await supabase.from("challenge_stages").insert(stageRows), "challenge stages insert");

  return challenges;
}

async function seedHabits(userId, goalsByTitle, skillsByTitle, challengesByTitle) {
  const rows = [
    {
      frequency: "daily",
      life_area: "projects",
      linked_challenge_id: challengesByTitle.get("7 дней системного старта")?.id ?? null,
      linked_goal_id: goalsByTitle.get("Собрать личную систему прогресса")?.id ?? null,
      linked_skill_id: skillsByTitle.get("Фокус")?.id ?? null,
      streak_current: 7,
      streak_best: 7,
      title: "20 минут без телефона утром",
      xp_reward: 20,
    },
    {
      frequency: "custom",
      life_area: "health",
      linked_challenge_id: challengesByTitle.get("Ритм движения")?.id ?? null,
      linked_goal_id: goalsByTitle.get("Улучшить физическую форму")?.id ?? null,
      linked_skill_id: null,
      streak_current: 4,
      streak_best: 5,
      title: "Тренировка или прогулка",
      xp_reward: 30,
    },
    {
      frequency: "daily",
      life_area: "skills",
      linked_challenge_id: null,
      linked_goal_id: goalsByTitle.get("Прокачать английский язык")?.id ?? null,
      linked_skill_id: skillsByTitle.get("Английский язык")?.id ?? null,
      streak_current: 6,
      streak_best: 6,
      title: "15 минут английского",
      xp_reward: 20,
    },
    {
      frequency: "daily",
      life_area: "finance",
      linked_challenge_id: challengesByTitle.get("Финансовый порядок")?.id ?? null,
      linked_goal_id: goalsByTitle.get("Создать финансовую подушку")?.id ?? null,
      linked_skill_id: skillsByTitle.get("Дисциплина")?.id ?? null,
      streak_current: 5,
      streak_best: 6,
      title: "Записать расходы за день",
      xp_reward: 15,
    },
    {
      frequency: "daily",
      life_area: "projects",
      linked_challenge_id: challengesByTitle.get("7 дней системного старта")?.id ?? null,
      linked_goal_id: goalsByTitle.get("Собрать личную систему прогресса")?.id ?? null,
      linked_skill_id: skillsByTitle.get("Дисциплина")?.id ?? null,
      streak_current: 7,
      streak_best: 8,
      title: "План на завтра",
      xp_reward: 15,
    },
    {
      frequency: "weekdays",
      life_area: "skills",
      linked_challenge_id: null,
      linked_goal_id: null,
      linked_skill_id: skillsByTitle.get("Фокус")?.id ?? null,
      streak_current: 3,
      streak_best: 5,
      title: "Чтение 10 страниц",
      xp_reward: 15,
    },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-20 + index),
    description: `Регулярное действие для направления «${row.life_area}».`,
    last_completed_at: index < 4 ? isoTimestamp(-1, 21) : null,
    status: "active",
    updated_at: isoTimestamp(-1),
    user_id: userId,
  }));

  const habits = requireData(await supabase.from("habits").insert(rows).select("*"), "habits insert");
  const logRows = [];

  for (const [index, habit] of habits.entries()) {
    const daysBack = index < 2 ? [0, -1, -2, -3, -4, -5] : index < 4 ? [0, -1, -2, -3] : [-1, -3, -5];

    for (const offset of daysBack) {
      logRows.push({
        completed_on: isoDate(offset),
        created_at: isoTimestamp(offset, 20),
        habit_id: habit.id,
        user_id: userId,
        xp_awarded: Number(habit.xp_reward ?? 10),
      });
    }
  }

  requireData(await supabase.from("habit_logs").insert(logRows), "habit logs insert");

  return habits;
}

async function seedHealth(userId) {
  const snapshots = [
    { activity: 52, energy: 6.8, note: "Энергия ровная, помогла вечерняя прогулка.", recovery: 6.4, sleep: 7.2 },
    { activity: 45, energy: 6.1, note: "Немного усталости после рабочего дня.", recovery: 5.8, sleep: 6.5 },
    { activity: 64, energy: 7.4, note: "Хорошее восстановление после спокойного вечера.", recovery: 7.0, sleep: 7.8 },
    { activity: 40, energy: 5.8, note: "Больше сидячей работы, нужна короткая разминка.", recovery: 5.4, sleep: 6.3 },
    { activity: 58, energy: 6.7, note: "Нормальный день без сильных просадок.", recovery: 6.2, sleep: 7.1 },
    { activity: 70, energy: 7.2, note: "Прогулка помогла держать фокус.", recovery: 6.8, sleep: 7.4 },
    { activity: 48, energy: 6.4, note: "Рабочий ритм стабильный.", recovery: 6.0, sleep: 6.9 },
  ];

  const rows = snapshots.flatMap((snapshot, index) => {
    const date = isoDate(-index);
    return [
      { date, metric_type: "energy_level", note: snapshot.note, value: snapshot.energy },
      { date, metric_type: "sleep_hours", note: null, value: snapshot.sleep },
      { date, metric_type: "recovery_score", note: null, value: snapshot.recovery },
      { date, metric_type: "activity_minutes", note: null, value: snapshot.activity },
    ].map((row) => ({ ...row, user_id: userId }));
  });

  requireData(await supabase.from("health_metrics").insert(rows), "health metrics insert");
}

async function seedFinance(userId) {
  const snapshots = [
    { dateOffset: -21, expenses: 54000, income: 70000, note: "Первый финансовый снимок для старта.", savings: 87000, target: 20000 },
    { dateOffset: -14, expenses: 52000, income: 75000, note: "Расходы стали понятнее после ежедневной фиксации.", savings: 94000, target: 20000 },
    { dateOffset: -7, expenses: 50000, income: 78000, note: "Свободный остаток вырос благодаря регулярному учёту.", savings: 103000, target: 20000 },
    { dateOffset: 0, expenses: 51000, income: 78000, note: "План месяца: отложить 20000 ₽ и не терять ежедневный учёт.", savings: 108000, target: 20000 },
  ];

  const rows = snapshots.flatMap((snapshot) => {
    const date = isoDate(snapshot.dateOffset);
    return [
      { date, metric_type: "savings_amount", note: snapshot.note, value: snapshot.savings },
      { date, metric_type: "target_amount", note: null, value: snapshot.target },
      { date, metric_type: "monthly_income", note: null, value: snapshot.income },
      { date, metric_type: "monthly_expenses", note: null, value: snapshot.expenses },
    ].map((row) => ({ ...row, user_id: userId }));
  });

  requireData(await supabase.from("finance_metrics").insert(rows), "finance metrics insert");
}

async function seedAchievements(userId) {
  const rows = [
    {
      condition_type: "demo_first_goal",
      condition_value: 1,
      description: "Создана первая цель.",
      status: "unlocked",
      title: "Первый шаг",
      unlocked_at: isoTimestamp(-10),
      xp_reward: 50,
    },
    {
      condition_type: "demo_streak",
      condition_value: 7,
      description: "Выполняйте привычки 7 дней подряд.",
      status: "unlocked",
      title: "Серия 7 дней",
      unlocked_at: isoTimestamp(-1),
      xp_reward: 100,
    },
    {
      condition_type: "demo_finance_snapshots",
      condition_value: 3,
      description: "Добавьте 3 финансовых снимка.",
      status: "locked",
      title: "Финансовый старт",
      unlocked_at: null,
      xp_reward: 100,
    },
    {
      condition_type: "demo_week_focus",
      condition_value: 10,
      description: "Выполните 10 привычек за неделю.",
      status: "locked",
      title: "Фокус недели",
      unlocked_at: null,
      xp_reward: 150,
    },
    {
      condition_type: "demo_personal_week",
      condition_value: 1,
      description: "Планировал день и отмечал прогресс всю неделю.",
      status: "unlocked",
      title: "Неделя без хаоса",
      unlocked_at: isoTimestamp(-2),
      xp_reward: 120,
    },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-18 + index * 2),
    is_premium: false,
    user_id: userId,
  }));

  requireData(await supabase.from("achievements").insert(rows), "achievements insert");
}

async function seedRecommendations(userId, goalsByTitle, challengesByTitle) {
  const rows = [
    {
      content: "Свяжите главное желание с главной целью, чтобы усилить мотивацию на неделю.",
      source_challenge_id: null,
      source_goal_id: goalsByTitle.get("Собрать личную систему прогресса")?.id ?? null,
      title: "Усилить связку цели и желания",
      type: "focus",
    },
    {
      content: "Сегодня лучше выполнить одну короткую привычку, чем переносить весь план.",
      source_challenge_id: challengesByTitle.get("7 дней системного старта")?.id ?? null,
      source_goal_id: null,
      title: "Выберите короткий следующий шаг",
      type: "habit",
    },
    {
      content: "Финансовая подушка растёт стабильнее, если фиксировать расходы ежедневно.",
      source_challenge_id: challengesByTitle.get("Финансовый порядок")?.id ?? null,
      source_goal_id: goalsByTitle.get("Создать финансовую подушку")?.id ?? null,
      title: "Поддержать финансовый ритм",
      type: "finance",
    },
    {
      content: "Сон и энергия ниже обычного — снизьте нагрузку и выберите лёгкую привычку.",
      source_challenge_id: null,
      source_goal_id: goalsByTitle.get("Улучшить физическую форму")?.id ?? null,
      title: "Сохранить восстановление",
      type: "health",
    },
    {
      content: "Продолжайте серию: до следующего уровня осталось несколько выполненных действий.",
      source_challenge_id: null,
      source_goal_id: null,
      title: "Продолжить серию",
      type: "progress",
    },
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-4 + index),
    is_read: index > 2,
    user_id: userId,
  }));

  requireData(await supabase.from("ai_recommendations").insert(rows), "ai recommendations insert");
}

async function seedXp(userId, habits, challengesByTitle) {
  const rows = [
    { amount: 50, reason: "Достижение: Первый шаг", source_type: "achievement", source_id: randomUUID() },
    { amount: 100, reason: "Достижение: Серия 7 дней", source_type: "achievement", source_id: randomUUID() },
    { amount: 120, reason: "Достижение: Неделя без хаоса", source_type: "achievement", source_id: randomUUID() },
    {
      amount: 40,
      reason: "Этап миссии: 7 дней системного старта",
      source_type: "challenge_stage",
      source_id: challengesByTitle.get("7 дней системного старта")?.id ?? randomUUID(),
    },
    ...habits.slice(0, 6).map((habit) => ({
      amount: Number(habit.xp_reward ?? 10),
      reason: `Миссия: ${habit.title}`,
      source_type: "habit_log",
      source_id: habit.id,
    })),
  ].map((row, index) => ({
    ...row,
    created_at: isoTimestamp(-9 + index, 19),
    user_id: userId,
  }));

  requireData(await supabase.from("xp_transactions").insert(rows), "xp transactions insert");
}

function byTitle(rows) {
  return new Map(rows.map((row) => [row.title, row]));
}

async function main() {
  const user = await findUserByEmail(DEMO_EMAIL);

  if (!user) {
    console.error(`Demo auth user not found: ${DEMO_EMAIL}`);
    console.error("Create this user in Supabase Auth first, then run: npm run seed:demo");
    process.exit(1);
  }

  const userId = user.id;
  console.log(`Seeding Lifera demo data for ${DEMO_EMAIL} (${userId})`);

  await resetDemoData(userId);
  await seedProfile(userId);

  const skills = await seedSkills(userId);
  const skillsByTitle = byTitle(skills);
  const goals = await seedGoals(userId, skillsByTitle);
  const goalsByTitle = byTitle(goals);
  await seedWishes(userId, goalsByTitle);
  const challenges = await seedChallenges(userId, goalsByTitle);
  const challengesByTitle = byTitle(challenges);
  const habits = await seedHabits(userId, goalsByTitle, skillsByTitle, challengesByTitle);

  await seedHealth(userId);
  await seedFinance(userId);
  await seedAchievements(userId);
  await seedRecommendations(userId, goalsByTitle, challengesByTitle);
  await seedXp(userId, habits, challengesByTitle);

  console.log("Demo data seeded.");
  console.log("Created: profile, plan, goals, wishes, challenges, habits, health, finance, skills, achievements, AI recommendations, XP.");
  console.log("Skipped by design: personal monthly subscriptions table and health problem zones; schema has no dedicated model for them.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
