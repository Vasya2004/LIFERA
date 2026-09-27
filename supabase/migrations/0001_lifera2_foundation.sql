-- LIFERA 2.0 foundation schema
-- Flexible, ClickUp-style core: user-defined life areas, lists, items, custom fields.

create table if not exists public.life_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text,
  color text,
  kind text, -- reserved for future module integrations (e.g. 'books', 'podcasts')
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  life_area_id uuid not null references public.life_areas(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  life_area_id uuid not null references public.life_areas(id) on delete cascade,
  list_id uuid references public.lists(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'open',
  due_date date,
  priority text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_fields (
  id uuid primary key default gen_random_uuid(),
  life_area_id uuid not null references public.life_areas(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text', 'number', 'date', 'select', 'checkbox')),
  options jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.item_field_values (
  item_id uuid not null references public.items(id) on delete cascade,
  field_id uuid not null references public.custom_fields(id) on delete cascade,
  value jsonb,
  primary key (item_id, field_id)
);

create index if not exists lists_life_area_id_idx on public.lists(life_area_id);
create index if not exists items_life_area_id_idx on public.items(life_area_id);
create index if not exists items_list_id_idx on public.items(list_id);
create index if not exists custom_fields_life_area_id_idx on public.custom_fields(life_area_id);

-- Row Level Security

alter table public.life_areas enable row level security;
alter table public.lists enable row level security;
alter table public.items enable row level security;
alter table public.custom_fields enable row level security;
alter table public.item_field_values enable row level security;

create policy "life_areas_owner" on public.life_areas
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "lists_owner" on public.lists
  for all using (
    exists (select 1 from public.life_areas a where a.id = lists.life_area_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.life_areas a where a.id = lists.life_area_id and a.user_id = auth.uid())
  );

create policy "items_owner" on public.items
  for all using (
    exists (select 1 from public.life_areas a where a.id = items.life_area_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.life_areas a where a.id = items.life_area_id and a.user_id = auth.uid())
  );

create policy "custom_fields_owner" on public.custom_fields
  for all using (
    exists (select 1 from public.life_areas a where a.id = custom_fields.life_area_id and a.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.life_areas a where a.id = custom_fields.life_area_id and a.user_id = auth.uid())
  );

create policy "item_field_values_owner" on public.item_field_values
  for all using (
    exists (
      select 1 from public.items i
      join public.life_areas a on a.id = i.life_area_id
      where i.id = item_field_values.item_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.items i
      join public.life_areas a on a.id = i.life_area_id
      where i.id = item_field_values.item_id and a.user_id = auth.uid()
    )
  );
