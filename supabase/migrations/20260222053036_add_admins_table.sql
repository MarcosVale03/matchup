create table "public"."admins" (
                                   "tournament_id" bigint not null,
                                   "user_id" uuid not null,
                                   "permission_level" smallint not null
);


alter table "public"."admins" enable row level security;


create table "public"."permission_levels" (
                                        "id" smallint not null,
                                        "name" text not null,
                                        "description" text not null
);


alter table "public"."permission_levels" enable row level security;

CREATE UNIQUE INDEX admins_pk ON public.admins USING btree (tournament_id, user_id);

CREATE UNIQUE INDEX permission_levels_pk ON public.permission_levels USING btree (id);

alter table "public"."admins" add constraint "admins_pk" PRIMARY KEY using index "admins_pk";

alter table "public"."permission_levels" add constraint "permission_levels_pk" PRIMARY KEY using index "permission_levels_pk";

alter table "public"."admins" add constraint "admins_permission_levels_fk_01" FOREIGN KEY (permission_level) REFERENCES public.permission_levels(id) not deferrable initially immediate;

alter table "public"."admins" add constraint "admins_tournaments_fk_01" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."admins" add constraint "admins_users_fk_01" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE not deferrable initially immediate;

create policy "Enable read access for all users"
  on "public"."admins"
  as permissive
  for select
                 to public
                 using (true);

create policy "Enable read access for all users"
  on "public"."permission_levels"
  as permissive
  for select
                 to public
                 using (true);

create policy "Enable insert for authenticated users only"
  on "public"."admins"
  as permissive
  for insert
  to authenticated
with check (true);




CREATE OR REPLACE FUNCTION public.insert_tournament(t_name character varying, t_start_time timestamp with time zone, t_end_time timestamp with time zone, is_online boolean, t_is_public boolean, t_email character varying DEFAULT NULL::character varying, t_discord character varying DEFAULT NULL::character varying, t_slug character varying DEFAULT NULL::character varying, t_place_id text DEFAULT NULL::text, t_address text DEFAULT NULL::text, t_latitude double precision DEFAULT NULL::double precision, t_longitude double precision DEFAULT NULL::double precision)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$DECLARE
t_id bigint;
    loc_id bigint;
BEGIN
INSERT INTO public.tournaments (name, start_time, end_time, slug, email_contact, discord_invite, owner, is_public)
VALUES (t_name, t_start_time, t_end_time, t_slug, t_email, t_discord, auth.uid(), t_is_public)
    RETURNING id
INTO t_id;

INSERT INTO public.admins (tournament_id, user_id, permission_level)
VALUES (t_id, auth.uid(), 0);

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