drop policy "admins_select" on "public"."admins";

drop policy "attendees_insert" on "public"."attendees";

drop policy "attendees_select" on "public"."attendees";

drop policy "bracket_phases_select" on "public"."bracket_phases";

drop policy "entrants_insert" on "public"."entrants";

drop policy "entrants_select" on "public"."entrants";

drop policy "events_select" on "public"."events";

drop policy "match_slots_insert" on "public"."match_slots";

drop policy "match_slots_select" on "public"."match_slots";

drop policy "matches_insert" on "public"."matches";

drop policy "matches_select" on "public"."matches";

drop policy "phase_groups_select" on "public"."phase_groups";

drop policy "rounds_insert" on "public"."rounds";

drop policy "rounds_select" on "public"."rounds";

drop policy "seeds_select" on "public"."seeds";


  create policy "admins_select"
  on "public"."admins"
  as permissive
  for select
                                                                                              to public
                                                                                              using (((user_id = auth.uid()) OR (tournament_id IN ( SELECT tournaments.id
                                                                                              FROM public.tournaments
                                                                                              WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "attendees_insert"
  on "public"."attendees"
  as permissive
  for insert
  to authenticated
with check ((((tournament_id IN ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 2)) AND ((( SELECT auth.uid() AS uid))::text = (user_id)::text)));



  create policy "attendees_select"
  on "public"."attendees"
  as permissive
  for select
                          to public
                          using (((tournament_id IN ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "bracket_phases_select"
  on "public"."bracket_phases"
  as permissive
  for select
                 to public
                 using (((tournament_id IN ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "entrants_insert"
  on "public"."entrants"
  as permissive
  for insert
  to authenticated
with check ((((tournament_id IN ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 2)) AND ((( SELECT auth.uid() AS uid))::text = (user_id)::text)));



  create policy "entrants_select"
  on "public"."entrants"
  as permissive
  for select
                          to public
                          using (((tournament_id IN ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "events_select"
  on "public"."events"
  as permissive
  for select
                 to public
                 using (((tournament_id IN ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "match_slots_insert"
  on "public"."match_slots"
  as permissive
  for insert
  to authenticated
with check (((tournament_id IN ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



  create policy "match_slots_select"
  on "public"."match_slots"
  as permissive
  for select
                          to public
                          using (((tournament_id IN ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "matches_insert"
  on "public"."matches"
  as permissive
  for insert
  to authenticated
with check (((tournament_id IN ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



  create policy "matches_select"
  on "public"."matches"
  as permissive
  for select
                          to public
                          using (((tournament_id IN ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "phase_groups_select"
  on "public"."phase_groups"
  as permissive
  for select
                 to public
                 using (((tournament_id IN ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "rounds_insert"
  on "public"."rounds"
  as permissive
  for insert
  to authenticated
with check (((tournament_id IN ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



  create policy "rounds_select"
  on "public"."rounds"
  as permissive
  for select
                          to public
                          using (((tournament_id IN ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "seeds_select"
  on "public"."seeds"
  as permissive
  for select
                 to public
                 using (((tournament_id IN ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));
