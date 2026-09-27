-- WEALTHERA schema: счета и движения капитала + инвестиционный портфель

create table public.wealthera_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('cash', 'bank', 'broker', 'crypto', 'other')),
  currency text not null default 'RUB',
  balance numeric(18, 2) not null default 0,
  note text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index wealthera_accounts_user_idx
  on public.wealthera_accounts (user_id, sort_order);

create table public.wealthera_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid not null references public.wealthera_accounts (id) on delete cascade,
  type text not null check (type in ('deposit', 'withdrawal')),
  amount numeric(18, 2) not null check (amount > 0),
  note text,
  occurred_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index wealthera_movements_user_account_date_idx
  on public.wealthera_movements (user_id, account_id, occurred_at desc);

create table public.wealthera_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid references public.wealthera_accounts (id) on delete set null,
  asset_type text not null check (asset_type in ('stock', 'crypto', 'other')),
  ticker text not null,
  name text,
  quantity numeric(18, 8) not null check (quantity > 0),
  purchase_price numeric(18, 2) not null check (purchase_price >= 0),
  current_price numeric(18, 2) not null check (current_price >= 0),
  currency text not null default 'RUB',
  purchase_date date,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index wealthera_holdings_user_idx
  on public.wealthera_holdings (user_id, created_at desc);

-- updated_at triggers (использует public.set_updated_at() из миграции VAULTERA)
create trigger wealthera_accounts_set_updated_at
  before update on public.wealthera_accounts
  for each row execute function public.set_updated_at();

create trigger wealthera_holdings_set_updated_at
  before update on public.wealthera_holdings
  for each row execute function public.set_updated_at();

-- Баланс счёта пересчитывается автоматически из движений
create or replace function public.wealthera_apply_movement()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    update public.wealthera_accounts
      set balance = balance - (case when old.type = 'deposit' then old.amount else -old.amount end)
      where id = old.account_id;
    return old;
  elsif tg_op = 'UPDATE' then
    update public.wealthera_accounts
      set balance = balance - (case when old.type = 'deposit' then old.amount else -old.amount end)
      where id = old.account_id;
    update public.wealthera_accounts
      set balance = balance + (case when new.type = 'deposit' then new.amount else -new.amount end)
      where id = new.account_id;
    return new;
  else
    update public.wealthera_accounts
      set balance = balance + (case when new.type = 'deposit' then new.amount else -new.amount end)
      where id = new.account_id;
    return new;
  end if;
end;
$$;

create trigger wealthera_movements_apply
  after insert or update or delete on public.wealthera_movements
  for each row execute function public.wealthera_apply_movement();

-- RLS
alter table public.wealthera_accounts enable row level security;
alter table public.wealthera_movements enable row level security;
alter table public.wealthera_holdings enable row level security;

create policy "wealthera_accounts_select_own" on public.wealthera_accounts
  for select using (auth.uid() = user_id);
create policy "wealthera_accounts_insert_own" on public.wealthera_accounts
  for insert with check (auth.uid() = user_id);
create policy "wealthera_accounts_update_own" on public.wealthera_accounts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wealthera_accounts_delete_own" on public.wealthera_accounts
  for delete using (auth.uid() = user_id);

create policy "wealthera_movements_select_own" on public.wealthera_movements
  for select using (auth.uid() = user_id);
create policy "wealthera_movements_insert_own" on public.wealthera_movements
  for insert with check (auth.uid() = user_id);
create policy "wealthera_movements_update_own" on public.wealthera_movements
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wealthera_movements_delete_own" on public.wealthera_movements
  for delete using (auth.uid() = user_id);

create policy "wealthera_holdings_select_own" on public.wealthera_holdings
  for select using (auth.uid() = user_id);
create policy "wealthera_holdings_insert_own" on public.wealthera_holdings
  for insert with check (auth.uid() = user_id);
create policy "wealthera_holdings_update_own" on public.wealthera_holdings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wealthera_holdings_delete_own" on public.wealthera_holdings
  for delete using (auth.uid() = user_id);
