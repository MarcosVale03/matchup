

  create policy "user_delete"
  on "public"."users"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.uid() AS uid))::text = (user_id)::text));



  create policy "user_insert"
  on "public"."users"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "user_select"
  on "public"."users"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid))::text = (user_id)::text));



  create policy "user_update"
  on "public"."users"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.uid() AS uid))::text = (user_id)::text))
with check (((( SELECT auth.uid() AS uid))::text = (user_id)::text));


