drop policy "Enable insert for authenticated users only" on "public"."admins";


  create policy "Enable insert for tournament owners only"
  on "public"."admins"
  as permissive
  for insert
  to authenticated
with check ((( SELECT tournaments.owner
   FROM public.tournaments
  WHERE (tournaments.id = admins.tournament_id)) = auth.uid()));