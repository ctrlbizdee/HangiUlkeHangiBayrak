begin;

alter table public.game_scores
  add column answered_questions integer
  check (answered_questions between correct_answers and 195);

create function public.my_player_progress_v2()
returns table (
  best_streak integer, lifetime_ms bigint, total_score bigint, world_rank bigint,
  player_count bigint, answered_count bigint
)
language sql stable security definer
set search_path = ''
as $$
  select progress.*, (
    select coalesce(sum(coalesce(answered_questions, correct_answers)), 0)
    from public.game_scores where user_id = auth.uid()
  )
  from public.my_player_progress() progress;
$$;

revoke execute on function public.my_player_progress_v2() from public, anon;
grant execute on function public.my_player_progress_v2() to authenticated;

commit;
