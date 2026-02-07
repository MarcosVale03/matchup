alter table "public"."events" drop constraint "events_check";

alter table "public"."events" drop constraint "events_name_check";

alter table "public"."gaming_platforms" drop constraint "gaming_platforms_name_check";

alter table "public"."video_games" drop constraint "video_games_name_check";

alter table "public"."events" add constraint "events_name_min_len_check" CHECK ((length((name)::text) >= 3)) not valid;

alter table "public"."events" validate constraint "events_name_min_len_check";

alter table "public"."events" add constraint "events_start_end_time_check" CHECK ((start_time < end_time)) not valid;

alter table "public"."events" validate constraint "events_start_end_time_check";

alter table "public"."gaming_platforms" add constraint "gaming_platforms_name_min_len_check" CHECK ((length(name) >= 2)) not valid;

alter table "public"."gaming_platforms" validate constraint "gaming_platforms_name_min_len_check";

alter table "public"."video_games" add constraint "video_games_name_min_len_check" CHECK ((length(name) >= 3)) not valid;

alter table "public"."video_games" validate constraint "video_games_name_min_len_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_event(tournament_id bigint, name character varying, start_time timestamp with time zone, end_time timestamp with time zone, price numeric, video_game text, platform text, teams_allowed boolean, is_online boolean, max_team_size integer DEFAULT NULL::integer, place_id text DEFAULT NULL::text, address text DEFAULT NULL::text, latitude double precision DEFAULT NULL::double precision, longitude double precision DEFAULT NULL::double precision)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    loc_id bigint;
BEGIN
    INSERT INTO public.events (tournament_id, name, start_time, end_time, price, video_game_name, gaming_platform_name, teams_allowed, max_team_size)
    VALUES (tournament_id, name, start_time, end_time, price, video_game, platform, teams_allowed, max_team_size);

    IF is_online THEN
        RETURN 0;
    END IF;

    SELECT id
    INTO loc_id
    FROM public.locations
    WHERE maps_place_id = t_place_id;

    IF loc_id IS NULL THEN
        INSERT INTO public.locations (maps_place_id, address, latitude, longitude)
        VALUES (place_id, address, latitude, longitude)
        RETURNING id
        INTO loc_id;
    END IF;

    INSERT INTO public.offline_events (tournament_id, event_name, location_id)
    VALUES (tournament_id, name, loc_id);

    RETURN 0;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_wave(w_tournament_id bigint, w_indentifier bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$DECLARE
    w_id bigint;
  
BEGIN
    INSERT INTO public.waves (tournament_id, identifier)
    VALUES (w_tournament_id, w_identifier)
    RETURNING id
    INTO w_id;

    RETURN w_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.users (user_id, first_name, last_name, display_name, prefix)
  VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'prefix');
RETURN new;
END;$function$
;

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

CREATE OR REPLACE FUNCTION public.update_tournament(t_id bigint, t_name character varying, t_start_time timestamp with time zone, t_end_time timestamp with time zone, is_online boolean, t_email character varying DEFAULT NULL::character varying, t_discord character varying DEFAULT NULL::character varying, t_slug character varying DEFAULT NULL::character varying, t_place_id text DEFAULT NULL::text, t_address text DEFAULT NULL::text, t_latitude double precision DEFAULT NULL::double precision, t_longitude double precision DEFAULT NULL::double precision)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
DECLARE
    email_id bigint;
    discord_id bigint;
    loc_id bigint;
BEGIN
    UPDATE public.tournaments
    SET name = t_name, start_time = t_start_time, end_time = t_end_time, slug = t_slug, email_contact = t_email, discord_invite = t_discord
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
$function$
;

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


