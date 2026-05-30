# Stage 3 — Duplicate onboarding cleanup (manual)

Do **not** run destructive SQL without reviewing rows for your user first.

## Detect duplicate starter goals

```sql
-- Replace with your auth user id
select id, title, status, created_at
from public.goals
where user_id = 'YOUR_USER_ID'
order by created_at asc;
```

Keep the oldest active goal from onboarding. Archive or delete extras:

```sql
update public.goals
set status = 'archived'
where id in ('DUPLICATE_GOAL_ID_1', 'DUPLICATE_GOAL_ID_2')
  and user_id = 'YOUR_USER_ID';
```

## Detect duplicate starter challenges

```sql
select id, title, goal_id, status, created_at
from public.challenges
where user_id = 'YOUR_USER_ID'
  and is_template = false
order by created_at asc;
```

Keep one active challenge linked to the kept goal. Archive extras:

```sql
update public.challenges
set status = 'archived'
where id in ('DUPLICATE_CHALLENGE_ID')
  and user_id = 'YOUR_USER_ID';
```

## Orphan stages after cleanup

```sql
select cs.id, cs.challenge_id, cs.title, cs.status
from public.challenge_stages cs
left join public.challenges c on c.id = cs.challenge_id
where cs.user_id = 'YOUR_USER_ID'
  and (c.id is null or c.status = 'archived');
```

Delete only after confirming they belong to removed challenges:

```sql
delete from public.challenge_stages
where id in ('STAGE_ID')
  and user_id = 'YOUR_USER_ID';
```

## Verify idempotency (current code)

Re-submitting `/api/onboarding/complete` with `onboarding_completed = true` returns `alreadyCompleted` and does not insert new goals/challenges.
