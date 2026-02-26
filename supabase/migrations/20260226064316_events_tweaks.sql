alter table "public"."events" add constraint "events_team_max_size_check" CHECK ( (teams_allowed = false) OR (max_team_size IS NOT NULL) );

create policy "events_select"
  on "public"."events"
  as permissive
  for select
                 to public
                 using ((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE ((tournaments.is_public = true) OR (tournaments.owner = auth.uid())))));