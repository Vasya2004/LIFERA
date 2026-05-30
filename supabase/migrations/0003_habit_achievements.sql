-- Stage 4: habit achievements for new and existing users

create or replace function public.create_lifera_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;

  insert into public.subscriptions (user_id, plan, status, provider)
  values (new.id, 'free', 'active', 'demo')
  on conflict (user_id) do nothing;

  insert into public.achievements (user_id, title, description, condition_type, condition_value, xp_reward)
  values
    (new.id, 'Первый шаг', 'Завершить первый этап челленджа.', 'completed_stages', 1, 50),
    (new.id, 'Стратег', 'Создать 3 цели.', 'goals_created', 3, 100),
    (new.id, 'Исполнитель', 'Завершить 5 этапов.', 'completed_stages', 5, 150),
    (new.id, 'Чемпион челленджей', 'Завершить первый челлендж.', 'completed_challenges', 1, 150),
    (new.id, 'Уровень 5', 'Достичь 5 уровня.', 'level_reached', 5, 200),
    (new.id, 'Баланс', 'Создать цели в 3 сферах жизни.', 'life_areas_with_goals', 3, 150),
    (new.id, 'Первый ритуал', 'Выполнить первую привычку.', 'habit_completions', 1, 30),
    (new.id, 'Серия 3 дня', 'Удержать streak привычки 3 дня.', 'habit_streak', 3, 50),
    (new.id, 'Серия 7 дней', 'Удержать streak привычки 7 дней.', 'habit_streak', 7, 100),
    (new.id, 'Стабильная прокачка', 'Выполнить 10 ритуалов прокачки.', 'habit_completions', 10, 120)
  on conflict do nothing;

  return new;
end;
$$;

insert into public.achievements (user_id, title, description, condition_type, condition_value, xp_reward)
select u.id, seed.title, seed.description, seed.condition_type, seed.condition_value, seed.xp_reward
from auth.users u
cross join (
  values
    ('Первый ритуал', 'Выполнить первую привычку.', 'habit_completions', 1, 30),
    ('Серия 3 дня', 'Удержать streak привычки 3 дня.', 'habit_streak', 3, 50),
    ('Серия 7 дней', 'Удержать streak привычки 7 дней.', 'habit_streak', 7, 100),
    ('Стабильная прокачка', 'Выполнить 10 ритуалов прокачки.', 'habit_completions', 10, 120)
) as seed(title, description, condition_type, condition_value, xp_reward)
where not exists (
  select 1
  from public.achievements existing
  where existing.user_id = u.id
    and existing.condition_type = seed.condition_type
    and existing.condition_value = seed.condition_value
);
