create policy "matches_select"
  on "public"."match_slots"
  as permissive
  for select
                 to public
                 using (((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "matches_select"
  on "public"."matches"
  as permissive
  for select
                 to public
                 using (((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



create policy "rounds_select"
  on "public"."rounds"
  as permissive
  for select
                 to public
                 using (((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));


create policy "seeds_select"
  on "public"."seeds"
  as permissive
  for select
                 to public
                 using (((tournament_id = ( SELECT tournaments.id
                 FROM public.tournaments
                 WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));


alter table "public"."seeds" add constraint "seeds_entrant_user_id_fkey" FOREIGN KEY (entrant_user_id) REFERENCES public.users(user_id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;