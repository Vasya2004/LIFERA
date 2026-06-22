export type LifeArea =
  | "career"
  | "health"
  | "finance"
  | "education"
  | "relationships"
  | "creativity"
  | "projects"
  | "skills";

export type Plan = "free" | "pro" | "ultra";

export type PlanTier = Plan;

export type SubscriptionStatus = "active" | "inactive" | "canceled";

export type GoalStatus = "active" | "backlog" | "completed" | "archived";

export type ChallengeStatus = "active" | "completed" | "paused" | "archived";

export type StageStatus = "locked" | "active" | "completed";

export type HabitStatus = "active" | "archived";

export type HabitFrequency = "daily" | "weekdays" | "weekly" | "custom";

export type UserProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  xp_total: number;
  level: number;
  life_score: number;
  streak_days: number;
  selected_life_areas: LifeArea[];
  plan: Plan;
  intended_plan: Plan | null;
  primary_goal_id: string | null;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  preferred_theme: "system" | "light" | "dark";
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  life_area: LifeArea;
  status: GoalStatus;
  progress: number;
  target_date: string | null;
  skill_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  difficulty: "easy" | "medium" | "hard";
  duration_days: number;
  status: ChallengeStatus;
  progress: number;
  xp_reward_total: number;
  current_stage: number;
  is_template: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type ChallengeStage = {
  id: string;
  challenge_id: string;
  user_id: string;
  title: string;
  description: string | null;
  order_index: number;
  status: StageStatus;
  xp_reward: number;
  progress_value: number;
  completed_at: string | null;
  created_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "locked" | "unlocked";
  condition_type: string;
  condition_value: number;
  xp_reward: number;
  is_premium: boolean;
  unlocked_at: string | null;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  life_area: LifeArea;
  frequency: HabitFrequency;
  status: HabitStatus;
  xp_reward: number;
  streak_current: number;
  streak_best: number;
  linked_goal_id: string | null;
  linked_skill_id: string | null;
  linked_challenge_id: string | null;
  last_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HabitLog = {
  id: string;
  user_id: string;
  habit_id: string;
  completed_on: string;
  xp_awarded: number;
  created_at: string;
};

export type WishStatus = "wanted" | "acquired" | "archived";

export type Wish = {
  id: string;
  user_id: string;
  linked_goal_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  target_amount: number | null;
  current_amount: number | null;
  status: WishStatus;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type SkillStatus = "active" | "archived";

export type Skill = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  level: number;
  progress: number;
  xp_total: number;
  status: SkillStatus;
  created_at: string;
  updated_at?: string;
};

export type HealthMetric = {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  date: string;
  note: string | null;
  created_at: string;
};

export type FinanceMetric = {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  date: string;
  note: string | null;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: Plan;
  status: SubscriptionStatus;
  provider: "demo" | "stripe" | "other";
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiError = {
  error: string;
};
