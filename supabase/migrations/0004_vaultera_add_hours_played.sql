-- Track hours spent for games in the media archive
alter table public.media_entries
  add column hours_played numeric(6, 1) check (hours_played is null or hours_played >= 0);
