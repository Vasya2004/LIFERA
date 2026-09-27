-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are viewable by owner" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles are editable by owner" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles are insertable by owner" on public.profiles
  for insert with check (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Section 1: daily habits
create table public.daily_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  icon text,
  color text,
  weekdays smallint[] not null default '{0,1,2,3,4,5,6}', -- 0=Sunday..6=Saturday
  reminder_time time,
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.daily_habits enable row level security;

create policy "daily_habits owner all" on public.daily_habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.daily_habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.daily_habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  completed_at timestamptz not null default now(),
  note text,
  unique (habit_id, log_date)
);

alter table public.daily_habit_logs enable row level security;

create policy "daily_habit_logs owner all" on public.daily_habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index daily_habit_logs_habit_date_idx on public.daily_habit_logs (habit_id, log_date);
create index daily_habits_user_idx on public.daily_habits (user_id);

-- Section 2: creator habits (weekly, for blog growth)
create table public.creator_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text, -- e.g. 'ideas','writing','publishing','promotion','analytics'
  icon text,
  color text,
  weekly_target integer not null default 1, -- how many times per week
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.creator_habits enable row level security;

create policy "creator_habits owner all" on public.creator_habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.creator_habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.creator_habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null, -- Monday of the ISO week
  completed_count integer not null default 1,
  note text,
  created_at timestamptz not null default now(),
  unique (habit_id, week_start, created_at)
);

alter table public.creator_habit_logs enable row level security;

create policy "creator_habit_logs owner all" on public.creator_habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index creator_habit_logs_habit_week_idx on public.creator_habit_logs (habit_id, week_start);
create index creator_habits_user_idx on public.creator_habits (user_id);

-- public.set_updated_at() уже создана миграцией 0002_vaultera_init.sql, переиспользуем её.

create trigger daily_habits_set_updated_at before update on public.daily_habits
  for each row execute procedure public.set_updated_at();
create trigger creator_habits_set_updated_at before update on public.creator_habits
  for each row execute procedure public.set_updated_at();
