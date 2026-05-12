drop policy "match_slots_update" on "public"."match_slots";

drop policy "matches_update" on "public"."matches";


create policy "match_slots_update"
  on "public"."match_slots"
  as permissive
  for update
                 to authenticated
                 using (((tournament_id IN ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "matches_update"
  on "public"."matches"
  as permissive
  for update
                 to authenticated
                 using (((tournament_id IN ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));