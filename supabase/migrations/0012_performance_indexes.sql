-- Performance indexes for foreign keys
-- In Postgres, foreign keys do not automatically create indexes, 
-- leading to sequential scans on tables when filtering by user_id.

create index if not exists goals_user_id_idx on public.goals(user_id);
create index if not exists challenges_user_id_idx on public.challenges(user_id);
create index if not exists challenges_goal_id_idx on public.challenges(goal_id);
create index if not exists challenge_stages_user_id_idx on public.challenge_stages(user_id);
create index if not exists challenge_stages_challenge_id_idx on public.challenge_stages(challenge_id);
create index if not exists xp_transactions_user_id_idx on public.xp_transactions(user_id);
create index if not exists achievements_user_id_idx on public.achievements(user_id);
create index if not exists health_metrics_user_id_idx on public.health_metrics(user_id);
create index if not exists finance_metrics_user_id_idx on public.finance_metrics(user_id);
create index if not exists ai_recommendations_user_id_idx on public.ai_recommendations(user_id);
create index if not exists skills_user_id_idx on public.skills(user_id);
