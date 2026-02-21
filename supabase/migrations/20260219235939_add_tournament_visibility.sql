alter table "public"."gaming_platforms" drop constraint "gaming_platforms_name_check";

alter table "public"."gaming_platforms" add constraint "gaming_platforms_name_check" check ( length(name)>1 );


alter table "public"."tournaments" add column "is_public" boolean not null default true;

DROP FUNCTION IF EXISTS insert_tournament;

DROP FUNCTION IF EXISTS update_tournament;


CREATE FUNCTION insert_tournament (t_name varchar(80), t_start_time timestamptz, t_end_time timestamptz, is_online boolean, t_is_public boolean,
                                   t_email varchar(254) default null, t_discord varchar(8) default null,
                                   t_slug varchar(80) default null, t_place_id text default null, t_address text default null,
                                   t_latitude double precision default null, t_longitude double precision default null)
    returns bigint
    set search_path = ''
                                   AS $$
DECLARE
t_id bigint;
    loc_id bigint;
BEGIN
INSERT INTO public.tournaments (name, start_time, end_time, slug, email_contact, discord_invite, owner, is_public)
VALUES (t_name, t_start_time, t_end_time, t_slug, t_email, t_discord, auth.uid(), t_is_public)
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
END;
$$ language plpgsql;

CREATE FUNCTION update_tournament (t_id bigint, t_name varchar(80), t_start_time timestamptz, t_end_time timestamptz, is_online boolean, t_is_public boolean,
                                   t_email varchar(254) default null, t_discord varchar(8) default null,
                                   t_slug varchar(80) default null, t_place_id text default null, t_address text default null,
                                   t_latitude double precision default null, t_longitude double precision default null)
    returns bigint
    set search_path = ''
                                   AS $$
DECLARE
email_id bigint;
    discord_id bigint;
    loc_id bigint;
BEGIN
UPDATE public.tournaments
SET name = t_name, start_time = t_start_time, end_time = t_end_time, slug = t_slug, email_contact = t_email, discord_invite = t_discord, is_public = t_is_public
WHERE id = t_id;

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

UPDATE public.offline_tournaments
SET location_id = loc_id
WHERE tournament_id = t_id;

RETURN t_id;
END;
$$ language plpgsql;