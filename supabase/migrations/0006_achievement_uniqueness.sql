-- Pre-deploy: prevent duplicate achievements per user + condition

with ranked as (
  select
    id,
    row_number() over (
      partition by user_id, condition_type, condition_value
      order by created_at asc nulls last, id asc
    ) as rn
  from public.achievements
  where user_id is not null
)
delete from public.achievements target
using ranked
where target.id = ranked.id
  and ranked.rn > 1;

create unique index if not exists achievements_user_condition_unique
  on public.achievements (user_id, condition_type, condition_value)
  where user_id is not null;
