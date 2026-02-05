alter table "public"."tournaments" add column "owner" uuid not null;

alter table "public"."tournaments" add constraint "tournaments_owner_fk_01" FOREIGN KEY (owner) REFERENCES public.users(user_id) not valid;

alter table "public"."tournaments" validate constraint "tournaments_owner_fk_01";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_tournament(t_name character varying, t_start_time timestamp with time zone, t_end_time timestamp with time zone, is_online boolean, t_email character varying DEFAULT NULL::character varying, t_discord character varying DEFAULT NULL::character varying, t_slug character varying DEFAULT NULL::character varying, t_place_id text DEFAULT NULL::text, t_address text DEFAULT NULL::text, t_latitude double precision DEFAULT NULL::double precision, t_longitude double precision DEFAULT NULL::double precision)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$DECLARE
    t_id bigint;
    loc_id bigint;
BEGIN
    INSERT INTO public.tournaments (name, start_time, end_time, slug, email_contact, discord_invite, owner)
    VALUES (t_name, t_start_time, t_end_time, t_slug, t_email, t_discord, auth.uid())
    RETURNING id
    INTO t_id;

    IF is_online THEN
        RETURN t_id;
    END IF;

    SELECT id
    INTO loc_id
    FROM public.locations
    WHERE maps_place_id = t_place_id;

    IF loc_id IS NULL THEN
        INSERT INTO public.locations (maps_place_id, address, latitude, longitude)
        VALUES (t_place_id, t_address, t_latitude, t_longitude)
        RETURNING id
        INTO loc_id;
    END IF;

    INSERT INTO public.offline_tournaments (tournament_id, location_id)
    VALUES (t_id, loc_id);

    RETURN t_id;
END;$function$
;


  create policy "Enable delete for authenticated users based on owner"
  on "public"."tournaments"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = owner));



  create policy "Enable insert for authenticated users based on owner"
  on "public"."tournaments"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = owner));



  create policy "Enable read access for all users"
  on "public"."tournaments"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for authenticated users based on owner"
  on "public"."tournaments"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = owner));




