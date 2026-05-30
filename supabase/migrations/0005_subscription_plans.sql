-- Stage 7: align subscriptions with Free / Pro / Ultra model
-- Order matters: drop legacy check constraints BEFORE migrating plan values.

alter table public.user_profiles
  drop constraint if exists user_profiles_plan_check;

alter table public.subscriptions
  drop constraint if exists subscriptions_plan_check;

update public.user_profiles
set plan = 'pro'
where plan = 'premium';

update public.subscriptions
set plan = 'pro'
where plan = 'premium';

alter table public.user_profiles
  add constraint user_profiles_plan_check
  check (plan in ('free', 'pro', 'ultra'));

alter table public.subscriptions
  add constraint subscriptions_plan_check
  check (plan in ('free', 'pro', 'ultra'));

alter table public.user_profiles
  add column if not exists intended_plan text;

alter table public.user_profiles
  drop constraint if exists user_profiles_intended_plan_check;

alter table public.user_profiles
  add constraint user_profiles_intended_plan_check
  check (intended_plan is null or intended_plan in ('free', 'pro', 'ultra'));
