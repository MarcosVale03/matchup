create policy "Users can listen on their own channel"
  on "realtime"."messages"
  as permissive
  for select
                 to authenticated
                 using ((realtime.topic() = ('user:'::text || (( SELECT auth.uid() AS uid))::text)));