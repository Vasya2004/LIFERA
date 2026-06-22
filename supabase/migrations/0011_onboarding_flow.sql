alter table public.user_profiles
  add column if not exists onboarding_completed_at timestamptz;

alter table public.achievements
  add column if not exists category text,
  add column if not exists importance text;

create table if not exists public.health_problem_zones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  body_zone text not null,
  discomfort_level text not null check (discomfort_level in ('light', 'medium', 'strong')),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists health_problem_zones_user_created_idx
  on public.health_problem_zones (user_id, created_at desc);

alter table public.health_problem_zones enable row level security;

drop policy if exists "Users can manage their own health problem zones"
  on public.health_problem_zones;

create policy "Users can manage their own health problem zones"
  on public.health_problem_zones
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists handle_updated_at_health_problem_zones
  on public.health_problem_zones;

create trigger handle_updated_at_health_problem_zones
  before update on public.health_problem_zones
  for each row
  execute function public.touch_updated_at();
