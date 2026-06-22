create table if not exists public.finance_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null default 'other',
  amount numeric not null check (amount >= 0),
  currency text not null default 'RUB',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.finance_debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  total_amount numeric not null check (total_amount >= 0),
  remaining_amount numeric not null check (remaining_amount >= 0),
  monthly_payment numeric check (monthly_payment is null or monthly_payment >= 0),
  interest_rate numeric check (interest_rate is null or interest_rate >= 0),
  deadline date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint finance_debts_remaining_lte_total check (remaining_amount <= total_amount)
);

create table if not exists public.finance_net_worth_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  total_assets numeric not null default 0,
  total_debts numeric not null default 0,
  net_worth numeric not null default 0,
  recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists finance_assets_user_updated_idx
  on public.finance_assets (user_id, updated_at desc);

create index if not exists finance_debts_user_updated_idx
  on public.finance_debts (user_id, updated_at desc);

create index if not exists finance_net_worth_snapshots_user_recorded_idx
  on public.finance_net_worth_snapshots (user_id, recorded_at desc);

alter table public.finance_assets enable row level security;
alter table public.finance_debts enable row level security;
alter table public.finance_net_worth_snapshots enable row level security;

create policy "Users can manage their own finance assets"
  on public.finance_assets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own finance debts"
  on public.finance_debts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own net worth snapshots"
  on public.finance_net_worth_snapshots
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists handle_updated_at_finance_assets on public.finance_assets;
create trigger handle_updated_at_finance_assets
  before update on public.finance_assets
  for each row
  execute function public.handle_updated_at();

drop trigger if exists handle_updated_at_finance_debts on public.finance_debts;
create trigger handle_updated_at_finance_debts
  before update on public.finance_debts
  for each row
  execute function public.handle_updated_at();
