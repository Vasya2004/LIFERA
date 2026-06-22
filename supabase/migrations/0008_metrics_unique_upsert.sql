create unique index if not exists health_metrics_user_date_type_unique
  on public.health_metrics (user_id, date, metric_type);

create unique index if not exists finance_metrics_user_date_type_unique
  on public.finance_metrics (user_id, date, metric_type);
