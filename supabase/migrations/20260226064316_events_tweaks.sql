alter table "public"."events" add constraint "events_team_max_size_check" CHECK ( (teams_allowed = false) OR (max_team_size IS NOT NULL) );

create policy "events_select"
  on "public"."events"
  as permissive
  for select
                 to public
                 using ((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE ((tournaments.is_public = true) OR (tournaments.owner = auth.uid())))));
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
                                                          WHERE ((tournaments.is_public = true) OR (tournaments.owner = auth.uid()))))));



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
