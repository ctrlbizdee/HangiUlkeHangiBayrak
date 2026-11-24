begin;

alter table public.game_scores
  add column duration_ms integer check (duration_ms between 0 and 1800000),
  add column round_id uuid unique;

create index if not exists game_scores_user_id_idx on public.game_scores (user_id);

create function public.player_nickname_allowed(nickname text)
returns boolean
language sql immutable strict
set search_path = ''
as $$
  with cleaned as (
    select lower(normalize(btrim(nickname), NFKC)) as spelling
  ), folded as (
    select spelling, translate(
      regexp_replace(normalize(spelling, NFKD), '[̀-ًͯ-ٰٟ]', '', 'g'),
      '013457ı', 'oieasti'
    ) as value
    from cleaned
  )
  select spellings_match and not (
    spelling ~ '^mal[0-9]*$' or value = 'mal' or value ~
    '(salak|aptal|gerizekali|idiot|stupid|asshole|bitch|shit|merde|putain|scheisse|arschloch|pendejo|mierda|debil|kokot|pica|хуй|мудак|дурак|كس|زب|قحبه|قحبة|حمار|hitler|nazi|nazist|terrorist|terorist|irkci|racist|pedofil|pedophile|fuck|siktir|orospu|pic|amk|nigger|kike|faggot|puta|kurva|сука|бляд|нацист)'
  )
  from folded
  cross join lateral (select spelling ~ '^[[:alnum:]]{3,20}$' as spellings_match) valid;
$$;

create function public.guard_player_nickname()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  nickname text;
begin
  if tg_table_schema = 'auth' then
    if new.email is null or new.email !~* '@players[.]example[.]com$' then
      return new;
    end if;
    nickname := new.raw_user_meta_data ->> 'username';
  else
    if tg_op = 'UPDATE' and new.username is not distinct from old.username then
      return new;
    end if;
    nickname := new.username;
  end if;
  if not coalesce(public.player_nickname_allowed(nickname), false) then
    raise exception 'Invalid player nickname' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger guard_new_player_nickname
before insert on auth.users for each row execute function public.guard_player_nickname();

create trigger guard_profile_nickname
before insert or update of username on public.profiles
for each row execute function public.guard_player_nickname();

create function public.player_leaderboard()
returns table (world_rank bigint, username text, total_score bigint)
language sql stable security definer
set search_path = ''
as $$
  select rank() over (order by best_score desc), wl.username, best_score
  from public.world_leaderboard wl
  where public.player_nickname_allowed(wl.username)
  order by best_score desc, user_id
  limit 35;
$$;

-- Players without a ranked score have a null rank.
create function public.my_player_progress()
returns table (best_streak integer, lifetime_ms bigint, total_score bigint, world_rank bigint, player_count bigint)
language sql stable security definer
set search_path = ''
as $$
  with totals as (
    select coalesce(max(correct_answers), 0) as streak,
           coalesce(sum(duration_ms), 0) as lifetime,
           coalesce(sum(score), 0) as points
    from public.game_scores where user_id = auth.uid()
  )
  select streak, lifetime, points,
    case when self.user_id is not null then
      (select 1 + count(*) from public.world_leaderboard other
        where other.best_score > self.best_score and public.player_nickname_allowed(other.username))
    end,
    (select count(*) from auth.users where not is_anonymous and email ~* '@players[.]example[.]com$')
  from totals
  left join public.world_leaderboard self
    on self.user_id = auth.uid() and public.player_nickname_allowed(self.username)
  where auth.uid() is not null;
$$;

revoke execute on function public.guard_player_nickname() from public, anon, authenticated;
revoke execute on function public.player_leaderboard(), public.my_player_progress() from public, anon;
grant execute on function public.player_leaderboard(), public.my_player_progress() to authenticated;

commit;
