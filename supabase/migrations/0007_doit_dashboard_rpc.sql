-- Собираем данные doit-страниц одним запросом вместо нескольких —
-- каждый round-trip к Supabase в этом окружении стоит ~1с, а на дашборде их было 4.

create or replace function public.doit_daily_page_data(p_log_date date)
returns json
language sql
security invoker
stable
as $$
  select json_build_object(
    'habits', coalesce((
      select json_agg(h order by h.sort_order, h.created_at)
      from public.daily_habits h
      where h.is_archived = false
    ), '[]'::json),
    'logs', coalesce((
      select json_agg(l)
      from public.daily_habit_logs l
      where l.log_date = p_log_date
    ), '[]'::json)
  );
$$;

create or replace function public.doit_creator_page_data(p_week_start date)
returns json
language sql
security invoker
stable
as $$
  select json_build_object(
    'habits', coalesce((
      select json_agg(h order by h.sort_order, h.created_at)
      from public.creator_habits h
      where h.is_archived = false
    ), '[]'::json),
    'logs', coalesce((
      select json_agg(l)
      from public.creator_habit_logs l
      where l.week_start = p_week_start
    ), '[]'::json)
  );
$$;

create or replace function public.doit_dashboard_data(
  p_today date,
  p_seven_days_ago date,
  p_week_start date,
  p_eight_weeks_ago date
)
returns json
language sql
security invoker
stable
as $$
  select json_build_object(
    'daily_habits', coalesce((
      select json_agg(h order by h.sort_order, h.created_at)
      from public.daily_habits h
      where h.is_archived = false
    ), '[]'::json),
    'daily_logs', coalesce((
      select json_agg(l)
      from public.daily_habit_logs l
      where l.log_date >= p_seven_days_ago and l.log_date <= p_today
    ), '[]'::json),
    'creator_habits', coalesce((
      select json_agg(h order by h.sort_order, h.created_at)
      from public.creator_habits h
      where h.is_archived = false
    ), '[]'::json),
    'creator_logs', coalesce((
      select json_agg(l)
      from public.creator_habit_logs l
      where l.week_start >= p_eight_weeks_ago
    ), '[]'::json)
  );
$$;

revoke all on function public.doit_daily_page_data(date) from public;
revoke all on function public.doit_creator_page_data(date) from public;
revoke all on function public.doit_dashboard_data(date, date, date, date) from public;

grant execute on function public.doit_daily_page_data(date) to authenticated;
grant execute on function public.doit_creator_page_data(date) to authenticated;
grant execute on function public.doit_dashboard_data(date, date, date, date) to authenticated;
