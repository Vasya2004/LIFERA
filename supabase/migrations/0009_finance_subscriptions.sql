create table if not exists public.finance_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  amount numeric not null check (amount > 0),
  category text not null,
  billing_day integer not null check (billing_day >= 1 and billing_day <= 31),
  period text not null,
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.finance_subscriptions enable row level security;

create policy "Users can manage their own finance subscriptions"
  on public.finance_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger handle_updated_at_finance_subscriptions
  before update on public.finance_subscriptions
  for each row
  execute function public.handle_updated_at();
