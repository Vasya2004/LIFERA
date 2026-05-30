-- Stage 6: Skills / Health / Finance progression branches

alter table public.skills
  add column if not exists status text not null default 'active'
  check (status in ('active', 'archived'));

alter table public.skills
  add column if not exists updated_at timestamptz not null default now();

alter table public.health_metrics
  add column if not exists note text;

alter table public.finance_metrics
  add column if not exists note text;

drop trigger if exists skills_touch_updated_at on public.skills;
create trigger skills_touch_updated_at before update on public.skills
for each row execute function public.touch_updated_at();
