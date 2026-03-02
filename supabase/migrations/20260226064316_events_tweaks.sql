alter table "public"."events" add constraint "events_team_max_size_check" CHECK ( (teams_allowed = false) OR (max_team_size IS NOT NULL) );

create policy "events_select"
  on "public"."events"
  as permissive
  for select
                 to public
                 using ((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE ((tournaments.is_public = true) OR (tournaments.owner = auth.uid())))));


CREATE OR REPLACE FUNCTION public.insert_event(e_tournament_id bigint, e_name character varying,
    e_start_time timestamp with time zone, e_end_time timestamp with time zone, e_price numeric(12, 2),
    e_video_game_name text, e_gaming_platform_name text, e_teams_allowed boolean, e_max_team_size smallint default null)
    RETURNS smallint
    LANGUAGE plpgsql
    SET search_path to ''
AS $$
DECLARE
    e_id smallint;
    bp_id smallint;
BEGIN
    INSERT INTO public.events (tournament_id, name, start_time, end_time, price, video_game_name, gaming_platform_name, teams_allowed, max_team_size)
    VALUES (e_tournament_id, e_name, e_start_time, e_end_time, e_price, e_video_game_name, e_gaming_platform_name, e_teams_allowed, e_max_team_size)
        RETURNING id
    INTO e_id;

    INSERT INTO public.bracket_phases (tournament_id, event_id, name, num_progressing_per_group, bracket_type_name, next_phase_id)
    VALUES (e_tournament_id, e_id, 'Bracket', 1, 'Single Elimination', NULL)
        RETURNING id
    INTO bp_id;

    INSERT INTO public.phase_groups (identifier, tournament_id, event_id, bracket_phase_id, wave_identifier)
    VALUES ('Bracket', e_tournament_id, e_id, bp_id, NULL);

    RETURN e_id;
END;$$;

alter table "public"."phase_groups" add constraint "phase_groups_bracket_phase_id_unique" UNIQUE (identifier, tournament_id, event_id, bracket_phase_id);

CREATE OR REPLACE FUNCTION public.has_permission_level(tid bigint, uid uuid, plevel integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$DECLARE
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


drop policy "Enable insert for tournament owners only" on "public"."admins";

drop policy "Enable read access for all users" on "public"."admins";

drop policy "Enable delete for authenticated users based on owner" on "public"."tournaments";

drop policy "Enable insert for authenticated users based on owner" on "public"."tournaments";

drop policy "Enable read access of public tournaments for all users" on "public"."tournaments";

drop policy "Enable update for authenticated users based on owner" on "public"."tournaments";


  create policy "admins_insert"
  on "public"."admins"
  as permissive
  for insert
  to authenticated
with check ((( SELECT tournaments.owner
   FROM public.tournaments
  WHERE (tournaments.id = admins.tournament_id)) = auth.uid()));



  create policy "admins_select"
  on "public"."admins"
  as permissive
  for select
                                                          to public
                                                          using (((user_id = auth.uid()) OR (tournament_id = ( SELECT tournaments.id
                                                          FROM public.tournaments
                                                          WHERE ((tournaments.is_public = true)))) OR has_permission_level(tournament_id, auth.uid(), 4)));



create policy "tournaments_delete"
  on "public"."tournaments"
  as permissive
  for delete
to authenticated
using ((auth.uid() = owner));



  create policy "tournaments_insert"
  on "public"."tournaments"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = owner));



  create policy "tournaments_select"
  on "public"."tournaments"
  as permissive
  for select
                            to public
                            using (((is_public = true) OR (owner = auth.uid()) OR public.has_permission_level(id, auth.uid(), 4)));



create policy "tournaments_update"
  on "public"."tournaments"
  as permissive
  for update
                 to authenticated
                 using (public.has_permission_level(id, auth.uid(), 1));

drop policy "events_select" on "public"."events";


  create policy "bracket_phases_insert"
  on "public"."bracket_phases"
  as permissive
  for insert
  to authenticated
with check (public.has_permission_level(tournament_id, auth.uid(), 1));



  create policy "bracket_phases_select"
  on "public"."bracket_phases"
  as permissive
  for select
                                 to public
                                 using (((tournament_id = ( SELECT tournaments.id
                                 FROM public.tournaments
                                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "bracket_types_select"
  on "public"."bracket_types"
  as permissive
  for select
                 to public
                 using (true);



create policy "event_video_games_select"
  on "public"."event_video_games"
  as permissive
  for select
                 to public
                 using (true);



create policy "events_insert"
  on "public"."events"
  as permissive
  for insert
  to authenticated
with check (public.has_permission_level(tournament_id, auth.uid(), 1));



  create policy "gaming_platforms_select"
  on "public"."gaming_platforms"
  as permissive
  for select
                          to public
                          using (true);



create policy "phase_groups_insert"
  on "public"."phase_groups"
  as permissive
  for insert
  to authenticated
with check (public.has_permission_level(tournament_id, auth.uid(), 1));



  create policy "phase_groups_select"
  on "public"."phase_groups"
  as permissive
  for select
                          to public
                          using (((tournament_id = ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "video_games_select"
  on "public"."video_games"
  as permissive
  for select
                 to public
                 using (true);



create policy "events_select"
  on "public"."events"
  as permissive
  for select
                 to public
                 using (((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));