drop policy "matches_select" on "public"."match_slots";

create policy "attendees_insert"
  on "public"."attendees"
  as permissive
  for insert
  to authenticated
with check ((((tournament_id = ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 2)) AND ((( SELECT auth.uid() AS uid))::text = (user_id)::text)));



  create policy "attendees_select"
  on "public"."attendees"
  as permissive
  for select
                          to public
                          using (((tournament_id = ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "entrants_insert"
  on "public"."entrants"
  as permissive
  for insert
  to authenticated
with check ((((tournament_id = ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 2)) AND ((( SELECT auth.uid() AS uid))::text = (user_id)::text)));



  create policy "entrants_select"
  on "public"."entrants"
  as permissive
  for select
                          to public
                          using (((tournament_id = ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "match_slots_insert"
  on "public"."match_slots"
  as permissive
  for insert
  to authenticated
with check (((tournament_id = ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



  create policy "match_slots_select"
  on "public"."match_slots"
  as permissive
  for select
                          to public
                          using (((tournament_id = ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "matches_insert"
  on "public"."matches"
  as permissive
  for insert
  to authenticated
with check (((tournament_id = ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



  create policy "rounds_insert"
  on "public"."rounds"
  as permissive
  for insert
  to authenticated
with check (((tournament_id = ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));