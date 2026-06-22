alter table public.user_profiles
  add column if not exists primary_goal_id uuid references public.goals(id) on delete set null;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  linked_goal_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  image_url text,
  category text,
  target_amount numeric,
  current_amount numeric,
  status text not null default 'wanted' check (status in ('wanted', 'acquired', 'archived')),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wishes_user_id_idx on public.wishes(user_id);
create index if not exists wishes_linked_goal_id_idx on public.wishes(linked_goal_id);
create index if not exists wishes_status_idx on public.wishes(status);
create unique index if not exists wishes_one_primary_per_user_idx
  on public.wishes(user_id)
  where is_primary = true and status <> 'archived';

drop trigger if exists wishes_touch_updated_at on public.wishes;
create trigger wishes_touch_updated_at before update on public.wishes
for each row execute function public.touch_updated_at();

alter table public.wishes enable row level security;

drop policy if exists "wishes owner access" on public.wishes;
create policy "wishes owner access" on public.wishes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
