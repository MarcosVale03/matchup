CREATE OR REPLACE FUNCTION public.update_event(e_tournament_id bigint, e_id smallint, e_name character varying,
    e_start_time timestamp with time zone, e_end_time timestamp with time zone, e_price numeric(12, 2),
    e_video_game_name text, e_gaming_platform_name text, e_teams_allowed boolean, e_max_team_size smallint default null)
    RETURNS smallint
    LANGUAGE plpgsql
    SET search_path to ''
AS $$
BEGIN

UPDATE public.events
SET name = e_name, start_time = e_start_time, end_time = e_end_time, price = e_price, video_game_name = e_video_game_name,
    gaming_platform_name = e_gaming_platform_name, teams_allowed = e_teams_allowed, max_team_size = e_max_team_size
WHERE tournament_id = e_tournament_id AND id = e_id;

RETURN e_id;
END;$$;

 create policy "events_delete"
  on "public"."events"
  as permissive
  for delete
to authenticated
using (public.has_permission_level(tournament_id, auth.uid(), 1));



  create policy "events_update"
  on "public"."events"
  as permissive
  for update
                   to authenticated
                   using (public.has_permission_level(tournament_id, auth.uid(), 1));


CREATE OR REPLACE FUNCTION public.has_permission_level(tid bigint, uid uuid, plevel integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path to ''
AS $function$
DECLARE
  level integer;
BEGIN
SELECT permission_level
FROM public.admins
WHERE (tournament_id = tid AND user_id = uid)
    INTO level;

IF level IS NULL THEN
    RETURN false;
END IF;

  IF level <= plevel THEN
    RETURN true;
END IF;

RETURN false;
END;$function$
;