-- Things: gadgets, gear, and cool objects in the vault

create table public.thing_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  category text check (
    category is null
    or category in ('gadget', 'tech', 'wear', 'home', 'collectible', 'other')
  ),
  brand text,
  cover_url text,
  rating numeric(3, 1) check (rating is null or (rating >= 1 and rating <= 10)),
  note text,
  item_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index thing_entries_user_date_idx
  on public.thing_entries (user_id, item_date desc nulls last);

create trigger thing_entries_set_updated_at
  before update on public.thing_entries
  for each row execute function public.set_updated_at();

alter table public.thing_entries enable row level security;

create policy "thing_select_own" on public.thing_entries
  for select using (auth.uid() = user_id);
create policy "thing_insert_own" on public.thing_entries
  for insert with check (auth.uid() = user_id);
create policy "thing_update_own" on public.thing_entries
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "thing_delete_own" on public.thing_entries
  for delete using (auth.uid() = user_id);
