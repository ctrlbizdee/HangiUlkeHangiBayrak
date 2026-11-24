begin;

create function public.player_top_ten()
returns table (world_rank bigint, username text, total_score bigint, best_streak integer)
language sql stable security definer
set search_path = ''
as $$
  with leaders as (
    select wl.user_id, wl.username, wl.best_score,
           rank() over (order by wl.best_score desc) as world_rank
    from public.world_leaderboard wl
    where public.player_nickname_allowed(wl.username)
    order by wl.best_score desc, wl.user_id
    limit 10
  )
  select l.world_rank, l.username, l.best_score, coalesce(s.best_streak, 0)
  from leaders l
  cross join lateral (
    select max(gs.correct_answers) as best_streak
    from public.game_scores gs where gs.user_id = l.user_id
  ) s
  order by l.world_rank, l.user_id;
$$;

revoke execute on function public.player_top_ten() from public, anon;
grant execute on function public.player_top_ten() to authenticated;

commit;
