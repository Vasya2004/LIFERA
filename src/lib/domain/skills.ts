import type { SupabaseClient } from "@supabase/supabase-js";

import type { BranchRecommendation } from "@/lib/domain/branches";
import type { Challenge, Goal, Habit, Skill, SkillStatus } from "@/lib/domain/types";

export const SKILL_CATEGORIES: Record<string, string> = {
  communication: "Коммуникации",
  finance_literacy: "Финансовая грамотность",
  fitness: "Физическая выносливость",
  general: "Общее",
  language: "Языки",
  product: "Product Thinking",
  tech: "Технологии",
};

const DEVELOPMENT_LIFE_AREAS = new Set(["career", "education", "creativity"]);

export type SkillInsight = {
  content: string;
  title: string;
};

export type SkillWithActivities = Skill & {
  computedLevel: number;
  computedProgress: number;
  computedXp: number;
  linkedChallenges: Challenge[];
  linkedGoals: Goal[];
  linkedHabits: Habit[];
};

export type SkillsHeroSummary = {
  activeCount: number;
  averageProgress: number;
  topSkill: { progress: number; title: string } | null;
  totalCount: number;
  totalXp: number;
};

export type SkillsBranchData = {
  developmentActivities: {
    challenges: Challenge[];
    goals: Goal[];
    habits: Habit[];
  };
  focusSkills: SkillWithActivities[];
  hero: SkillsHeroSummary;
  insight: SkillInsight;
  recommendation: BranchRecommendation;
  skills: SkillWithActivities[];
};

const SKILL_XP_PER_LEVEL = 100;

function skillLevelFromXp(xpTotal: number) {
  return Math.floor(xpTotal / SKILL_XP_PER_LEVEL) + 1;
}

function enrichSkill(
  skill: Skill,
  goals: Goal[],
  habits: Habit[],
  challenges: Challenge[],
  habitXpByHabitId: Map<string, number>,
): SkillWithActivities {
  const linkedGoals = goals.filter((goal) => goal.skill_id === skill.id && goal.status !== "archived");
  const linkedHabits = habits.filter((habit) => habit.linked_skill_id === skill.id);
  const linkedGoalIds = new Set(linkedGoals.map((goal) => goal.id));
  const linkedChallenges = challenges.filter(
    (challenge) => challenge.goal_id && linkedGoalIds.has(challenge.goal_id),
  );

  const habitXp = linkedHabits.reduce(
    (sum, habit) => sum + (habitXpByHabitId.get(habit.id) ?? 0),
    0,
  );
  const computedXp = Math.max(Number(skill.xp_total ?? 0), habitXp);
  const computedProgress =
    linkedGoals.length > 0
      ? Math.round(
          linkedGoals.reduce((sum, goal) => sum + Number(goal.progress ?? 0), 0) /
            linkedGoals.length,
        )
      : Number(skill.progress ?? 0);
  const computedLevel = Math.max(Number(skill.level ?? 1), skillLevelFromXp(computedXp));

  return {
    ...skill,
    computedLevel,
    computedProgress,
    computedXp,
    linkedChallenges,
    linkedGoals,
    linkedHabits,
  };
}

export function buildSkillInsight(input: {
  developmentActivities: SkillsBranchData["developmentActivities"];
  skills: SkillWithActivities[];
}): SkillInsight {
  const recommendation = buildSkillsRecommendation(input);
  return {
    content: recommendation.content,
    title: recommendation.title,
  };
}

export function buildSkillsRecommendation(input: {
  developmentActivities: SkillsBranchData["developmentActivities"];
  skills: SkillWithActivities[];
}): BranchRecommendation {
  const { developmentActivities, skills } = input;
  const activeSkills = skills.filter((skill) => skill.status === "active");

  if (activeSkills.length === 0) {
    return {
      content:
        "Добавьте первый навык — язык, технологию или soft skill — и развивайте его через цель или привычку.",
      ctaHref: "#create-skill",
      ctaLabel: "Добавить навык",
      title: "Добавьте первый навык",
    };
  }

  const unlinked = activeSkills.find(
    (skill) => skill.linkedGoals.length === 0 && skill.linkedHabits.length === 0,
  );

  if (unlinked) {
    return {
      content: `«${unlinked.title}» пока не связан с целями или привычками. Создайте привычку или цель, чтобы навык рос через действия.`,
      ctaHref: "/habits",
      ctaLabel: "Связать с привычкой",
      title: "Свяжите навык с привычкой",
    };
  }

  const withoutHabit = activeSkills.find((skill) => skill.linkedHabits.length === 0);

  if (withoutHabit) {
    return {
      content: `«${withoutHabit.title}» связан с целями, но без регулярной привычки прогресс будет медленным. Добавьте короткую практику.`,
      ctaHref: "/habits",
      ctaLabel: "Создать привычку",
      title: "Свяжите навык с привычкой",
    };
  }

  const focusSkill = [...activeSkills].sort(
    (left, right) => right.computedProgress - left.computedProgress,
  )[0];

  if (focusSkill) {
    return {
      content: `Выберите «${focusSkill.title}» как фокус недели — удерживайте связанные привычки.`,
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      title: "Выберите один навык для фокуса недели",
    };
  }

  if (developmentActivities.goals.length > 0) {
    return {
      content:
        "Есть активность в сферах карьеры и обучения. Привяжите цели к навыкам, чтобы видеть вклад компетенций.",
      ctaHref: "/goals",
      ctaLabel: "Открыть цели",
      title: "Развитие через цели",
    };
  }

  return {
    content: "Навыки зафиксированы. Следующий шаг — связать их с регулярными привычками.",
    ctaHref: "/habits",
    ctaLabel: "Открыть привычки",
    title: "Компетенции в фокусе",
  };
}

function buildSkillsHero(skills: SkillWithActivities[]): SkillsHeroSummary {
  const activeSkills = skills.filter((skill) => skill.status === "active");
  const averageProgress =
    activeSkills.length > 0
      ? Math.round(
          activeSkills.reduce((sum, skill) => sum + skill.computedProgress, 0) /
            activeSkills.length,
        )
      : 0;
  const topSkill =
    activeSkills.length > 0
      ? [...activeSkills].sort((left, right) => right.computedProgress - left.computedProgress)[0]
      : null;

  return {
    activeCount: activeSkills.length,
    averageProgress,
    topSkill: topSkill
      ? { progress: topSkill.computedProgress, title: topSkill.title }
      : null,
    totalCount: skills.length,
    totalXp: activeSkills.reduce((sum, skill) => sum + skill.computedXp, 0),
  };
}

function buildSkillsFocus(skills: SkillWithActivities[]): SkillWithActivities[] {
  const activeSkills = skills.filter((skill) => skill.status === "active");

  return [...activeSkills]
    .sort((left, right) => {
      const leftUnlinked =
        left.linkedGoals.length === 0 && left.linkedHabits.length === 0 ? 0 : 1;
      const rightUnlinked =
        right.linkedGoals.length === 0 && right.linkedHabits.length === 0 ? 0 : 1;

      if (leftUnlinked !== rightUnlinked) {
        return leftUnlinked - rightUnlinked;
      }

      return left.computedProgress - right.computedProgress;
    })
    .slice(0, 3);
}

export async function getSkillsBranchData(
  supabase: SupabaseClient,
  userId: string,
): Promise<SkillsBranchData> {
  const [
    skillsResult,
    goalsResult,
    habitsResult,
    challengesResult,
    habitLogsResult,
  ] = await Promise.all([
    supabase
      .from("skills")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("goals").select("*").eq("user_id", userId),
    supabase.from("habits").select("*").eq("user_id", userId),
    supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .eq("is_template", false),
    supabase.from("habit_logs").select("habit_id,xp_awarded").eq("user_id", userId),
  ]);

  const firstError =
    skillsResult.error?.message ??
    goalsResult.error?.message ??
    habitsResult.error?.message ??
    challengesResult.error?.message ??
    habitLogsResult.error?.message ??
    null;

  if (firstError) {
    throw new Error(firstError);
  }

  const goals = (goalsResult.data ?? []) as Goal[];
  const habits = (habitsResult.data ?? []) as Habit[];
  const challenges = (challengesResult.data ?? []) as Challenge[];
  const habitXpByHabitId = new Map<string, number>();

  for (const log of habitLogsResult.data ?? []) {
    const current = habitXpByHabitId.get(log.habit_id) ?? 0;
    habitXpByHabitId.set(log.habit_id, current + Number(log.xp_awarded ?? 0));
  }

  const skills = ((skillsResult.data ?? []) as Skill[]).map((skill) =>
    enrichSkill(
      { ...skill, status: skill.status ?? "active" },
      goals,
      habits,
      challenges,
      habitXpByHabitId,
    ),
  );

  const developmentGoals = goals.filter(
    (goal) =>
      DEVELOPMENT_LIFE_AREAS.has(goal.life_area) &&
      goal.status !== "archived" &&
      goal.status !== "completed",
  );
  const developmentGoalIds = new Set(developmentGoals.map((goal) => goal.id));

  const developmentActivities = {
    goals: developmentGoals,
    habits: habits.filter(
      (habit) =>
        habit.status === "active" && DEVELOPMENT_LIFE_AREAS.has(habit.life_area),
    ),
    challenges: challenges.filter(
      (challenge) => challenge.goal_id && developmentGoalIds.has(challenge.goal_id),
    ),
  };

  const insightInput = { developmentActivities, skills };

  return {
    developmentActivities,
    focusSkills: buildSkillsFocus(skills),
    hero: buildSkillsHero(skills),
    insight: buildSkillInsight(insightInput),
    recommendation: buildSkillsRecommendation(insightInput),
    skills,
  };
}

export async function createSkill(
  supabase: SupabaseClient,
  userId: string,
  input: { category?: string; title: string },
) {
  const title = input.title.trim();

  if (!title) {
    throw new Error("Название навыка обязательно.");
  }

  const category = input.category?.trim() || "general";

  const { data, error } = await supabase
    .from("skills")
    .insert({
      category,
      title,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Skill;
}

export async function updateSkill(
  supabase: SupabaseClient,
  userId: string,
  skillId: string,
  input: {
    category?: string;
    level?: number;
    progress?: number;
    status?: SkillStatus;
    title?: string;
  },
) {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) {
      throw new Error("Название навыка обязательно.");
    }
    payload.title = title;
  }

  if (input.category !== undefined) {
    payload.category = input.category.trim() || "general";
  }

  if (input.level !== undefined) {
    payload.level = Math.max(1, Number(input.level));
  }

  if (input.progress !== undefined) {
    payload.progress = Math.min(100, Math.max(0, Number(input.progress)));
  }

  if (input.status !== undefined) {
    payload.status = input.status;
  }

  const { data, error } = await supabase
    .from("skills")
    .update(payload)
    .eq("id", skillId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Skill;
}
