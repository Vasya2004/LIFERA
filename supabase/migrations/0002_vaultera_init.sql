-- VAULTERA schema: personal archive on Supabase

create extension if not exists "pgcrypto";

-- Media: movies, documentaries, series, games
create table public.media_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  type text not null check (type in ('movie', 'documentary', 'series', 'game')),
  cover_url text,
  rating numeric(3, 1) check (rating is null or (rating >= 1 and rating <= 10)),
  note text,
  watched_date date,
  genre text,
  platform text,
  season_count integer check (season_count is null or season_count >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_entries_user_type_date_idx
  on public.media_entries (user_id, type, watched_date desc nulls last);

-- Travel
create table public.travel_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  country text,
  city text,
  photos text[] not null default '{}',
  rating numeric(3, 1) check (rating is null or (rating >= 1 and rating <= 10)),
  note text,
  travel_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index travel_entries_user_date_idx
  on public.travel_entries (user_id, travel_date desc nulls last);

-- Activities
create table public.activity_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  category text check (
    category is null
    or category in ('extreme', 'sport', 'creative', 'water', 'air', 'winter', 'other')
  ),
  cover_url text,
  rating numeric(3, 1) check (rating is null or (rating >= 1 and rating <= 10)),
  note text,
  activity_date date,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index activity_entries_user_date_idx
  on public.activity_entries (user_id, activity_date desc nulls last);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger media_entries_set_updated_at
  before update on public.media_entries
  for each row execute function public.set_updated_at();

create trigger travel_entries_set_updated_at
  before update on public.travel_entries
  for each row execute function public.set_updated_at();

create trigger activity_entries_set_updated_at
  before update on public.activity_entries
  for each row execute function public.set_updated_at();

-- RLS
alter table public.media_entries enable row level security;
alter table public.travel_entries enable row level security;
alter table public.activity_entries enable row level security;

create policy "media_select_own" on public.media_entries
  for select using (auth.uid() = user_id);
create policy "media_insert_own" on public.media_entries
  for insert with check (auth.uid() = user_id);
create policy "media_update_own" on public.media_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "media_delete_own" on public.media_entries
  for delete using (auth.uid() = user_id);

create policy "travel_select_own" on public.travel_entries
  for select using (auth.uid() = user_id);
create policy "travel_insert_own" on public.travel_entries
  for insert with check (auth.uid() = user_id);
create policy "travel_update_own" on public.travel_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "travel_delete_own" on public.travel_entries
  for delete using (auth.uid() = user_id);

create policy "activity_select_own" on public.activity_entries
  for select using (auth.uid() = user_id);
create policy "activity_insert_own" on public.activity_entries
  for insert with check (auth.uid() = user_id);
create policy "activity_update_own" on public.activity_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activity_delete_own" on public.activity_entries
  for delete using (auth.uid() = user_id);

-- Storage bucket for covers and travel photos
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_storage_select"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "media_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "media_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
