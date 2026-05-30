create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  xp_total integer not null default 0 check (xp_total >= 0),
  level integer not null default 1 check (level >= 1),
  life_score integer not null default 50 check (life_score >= 0 and life_score <= 100),
  streak_days integer not null default 0 check (streak_days >= 0),
  selected_life_areas text[] not null default '{}',
  plan text not null default 'free' check (plan in ('free', 'premium')),
  onboarding_completed boolean not null default false,
  preferred_theme text not null default 'system' check (preferred_theme in ('system', 'light', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'general',
  level integer not null default 1,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  xp_total integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  life_area text not null default 'projects',
  status text not null default 'active' check (status in ('active', 'backlog', 'completed', 'archived')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  target_date date,
  skill_id uuid references public.skills(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  duration_days integer not null default 7 check (duration_days > 0),
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'archived')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  xp_reward_total integer not null default 0 check (xp_reward_total >= 0),
  current_stage integer not null default 1 check (current_stage >= 1),
  is_template boolean not null default false,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_stages (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  order_index integer not null,
  status text not null default 'locked' check (status in ('locked', 'active', 'completed')),
  xp_reward integer not null default 50 check (xp_reward >= 0),
  progress_value integer not null default 0 check (progress_value >= 0 and progress_value <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(challenge_id, order_index)
);

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null check (amount > 0),
  reason text not null,
  source_type text not null,
  source_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, source_type, source_id)
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  status text not null default 'locked' check (status in ('locked', 'unlocked')),
  condition_type text not null,
  condition_value integer not null,
  xp_reward integer not null default 0,
  is_premium boolean not null default false,
  unlocked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null,
  value numeric not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null,
  value numeric not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  content text not null,
  source_goal_id uuid references public.goals(id) on delete set null,
  source_challenge_id uuid references public.challenges(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  status text not null default 'inactive' check (status in ('active', 'inactive', 'canceled')),
  provider text not null default 'demo' check (provider in ('demo', 'stripe', 'other')),
  provider_customer_id text,
  provider_subscription_id text,
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.create_lifera_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;

  insert into public.subscriptions (user_id, plan, status, provider)
  values (new.id, 'free', 'active', 'demo')
  on conflict (user_id) do nothing;

  insert into public.achievements (user_id, title, description, condition_type, condition_value, xp_reward)
  values
    (new.id, 'Первый шаг', 'Завершить первый этап челленджа.', 'completed_stages', 1, 50),
    (new.id, 'Стратег', 'Создать 3 цели.', 'goals_created', 3, 100),
    (new.id, 'Исполнитель', 'Завершить 5 этапов.', 'completed_stages', 5, 150),
    (new.id, 'Чемпион челленджей', 'Завершить первый челлендж.', 'completed_challenges', 1, 150),
    (new.id, 'Уровень 5', 'Достичь 5 уровня.', 'level_reached', 5, 200),
    (new.id, 'Баланс', 'Создать цели в 3 сферах жизни.', 'life_areas_with_goals', 3, 150)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_lifera on auth.users;
create trigger on_auth_user_created_lifera
after insert on auth.users
for each row execute function public.create_lifera_profile();

create trigger user_profiles_touch_updated_at before update on public.user_profiles
for each row execute function public.touch_updated_at();
create trigger goals_touch_updated_at before update on public.goals
for each row execute function public.touch_updated_at();
create trigger challenges_touch_updated_at before update on public.challenges
for each row execute function public.touch_updated_at();
create trigger subscriptions_touch_updated_at before update on public.subscriptions
for each row execute function public.touch_updated_at();

alter table public.user_profiles enable row level security;
alter table public.skills enable row level security;
alter table public.goals enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_stages enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.achievements enable row level security;
alter table public.health_metrics enable row level security;
alter table public.finance_metrics enable row level security;
alter table public.ai_recommendations enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles owner access" on public.user_profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "skills owner access" on public.skills
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals owner access" on public.goals
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "challenges owner access" on public.challenges
for all using (auth.uid() = user_id or user_id is null) with check (auth.uid() = user_id);
create policy "stages owner access" on public.challenge_stages
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "xp owner read" on public.xp_transactions
for select using (auth.uid() = user_id);
create policy "achievements owner read" on public.achievements
for select using (auth.uid() = user_id);
create policy "health owner access" on public.health_metrics
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "finance owner access" on public.finance_metrics
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai owner access" on public.ai_recommendations
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subscriptions owner read" on public.subscriptions
for select using (auth.uid() = user_id);

insert into public.challenges (
  user_id, title, description, difficulty, duration_days, status, progress,
  xp_reward_total, current_stage, is_template, is_premium
)
values
  (null, '7 дней системного старта', 'Соберите первую цель, разложите ее на этапы и получите первые XP.', 'easy', 7, 'active', 0, 350, 1, true, false),
  (null, '30 дней профессионального роста', 'Планомерный челлендж для прокачки одного ключевого навыка.', 'medium', 30, 'active', 0, 1200, 1, true, false),
  (null, 'Premium Sprint: стратегический рывок', 'Расширенный челлендж с глубоким анализом прогресса.', 'hard', 21, 'active', 0, 1500, 1, true, true);

