create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  life_area text not null,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekdays', 'weekly', 'custom')),
  status text not null default 'active' check (status in ('active', 'archived')),
  xp_reward integer not null default 10 check (xp_reward >= 0),
  streak_current integer not null default 0 check (streak_current >= 0),
  streak_best integer not null default 0 check (streak_best >= 0),
  linked_goal_id uuid references public.goals(id) on delete set null,
  linked_skill_id uuid references public.skills(id) on delete set null,
  linked_challenge_id uuid references public.challenges(id) on delete set null,
  last_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null default current_date,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  created_at timestamptz not null default now(),
  unique(habit_id, completed_on)
);

create index if not exists habits_user_id_idx on public.habits(user_id);
create index if not exists habits_status_idx on public.habits(status);
create index if not exists habits_life_area_idx on public.habits(life_area);
create index if not exists habit_logs_user_id_idx on public.habit_logs(user_id);
create index if not exists habit_logs_habit_id_idx on public.habit_logs(habit_id);
create index if not exists habit_logs_completed_on_idx on public.habit_logs(completed_on);

drop trigger if exists habits_touch_updated_at on public.habits;
create trigger habits_touch_updated_at before update on public.habits
for each row execute function public.touch_updated_at();

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "habits owner select" on public.habits
for select using (auth.uid() = user_id);

create policy "habits owner insert" on public.habits
for insert with check (auth.uid() = user_id);

create policy "habits owner update" on public.habits
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "habits owner delete" on public.habits
for delete using (auth.uid() = user_id);

create policy "habit logs owner select" on public.habit_logs
for select using (auth.uid() = user_id);

create policy "habit logs owner insert" on public.habit_logs
for insert with check (auth.uid() = user_id);
