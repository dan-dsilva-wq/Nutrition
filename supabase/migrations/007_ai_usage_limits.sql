-- Server-side free-tier quotas for AI features. The client keeps its own
-- counters for UI, but these rows are what the API routes enforce.

create table if not exists public.ai_usage_counters (
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('ai-photo', 'coach')),
  period_key text not null,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, feature, period_key)
);

alter table public.ai_usage_counters enable row level security;

drop policy if exists "user can read own ai usage"
  on public.ai_usage_counters;
create policy "user can read own ai usage"
  on public.ai_usage_counters for select
  using (auth.uid() = user_id);

-- Atomically claims one unit of quota. Returns the new count, or null when
-- the user has already reached p_limit for this period.
create or replace function public.consume_ai_usage(
  p_user_id uuid,
  p_feature text,
  p_period_key text,
  p_limit integer
) returns integer
language plpgsql
as $$
declare
  new_count integer;
begin
  if p_limit <= 0 then
    return null;
  end if;

  insert into public.ai_usage_counters as c (user_id, feature, period_key, count)
  values (p_user_id, p_feature, p_period_key, 1)
  on conflict (user_id, feature, period_key)
  do update set count = c.count + 1, updated_at = now()
    where c.count < p_limit
  returning c.count into new_count;

  return new_count;
end;
$$;

-- Gives back one unit when the AI call failed after quota was claimed.
create or replace function public.release_ai_usage(
  p_user_id uuid,
  p_feature text,
  p_period_key text
) returns void
language sql
as $$
  update public.ai_usage_counters
  set count = greatest(count - 1, 0), updated_at = now()
  where user_id = p_user_id
    and feature = p_feature
    and period_key = p_period_key;
$$;

revoke all on function public.consume_ai_usage(uuid, text, text, integer)
  from public, anon, authenticated;
revoke all on function public.release_ai_usage(uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.consume_ai_usage(uuid, text, text, integer)
  to service_role;
grant execute on function public.release_ai_usage(uuid, text, text)
  to service_role;
