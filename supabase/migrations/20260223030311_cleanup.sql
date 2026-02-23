drop policy "user_select" on "public"."users";

alter table "public"."users" alter column "prefix" drop not null;


create policy "user_select"
  on "public"."users"
  as permissive
  for select
                 to public
                 using (true);