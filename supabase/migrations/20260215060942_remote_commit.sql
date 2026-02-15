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

CREATE OR REPLACE FUNCTION public.insert_post(p_thread_id uuid, p_content text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO public.forum_posts(thread_id, author_id, content)
    VALUES (p_thread_id, auth.uid(), p_content);
END;$function$
;

CREATE OR REPLACE FUNCTION public.insert_thread(t_title character varying, t_content text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE 
    gen_thread_id uuid;
BEGIN
    INSERT INTO public.forum_thread(author_id, title, content)
    VALUES (auth.uid(), t_title, t_content)
    RETURNING id into gen_thread_id;

    INSERT INTO public.forum_posts(thread_id, author_id, content)
    VALUES (gen_thread_id, auth.uid(), t_content);
END;$function$
;

CREATE OR REPLACE FUNCTION public.insert_wave(w_tournament_id bigint, w_identifier character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
    INSERT INTO public.waves (tournament_id, identifier)
    VALUES (w_tournament_id, w_identifier);
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_post(p_post_id uuid, p_new_content text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
    UPDATE public.forum_posts
    SET content = p_new_content
    WHERE id = p_post_id AND author_id = auth.uid();
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_wave(w_tournament_id bigint, w_old_identifier character varying, w_new_identifier character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
    UPDATE public.waves
    SET identifier = w_new_identifier
    WHERE tournament_id = w_tournament_id AND identifier = w_old_identifier;
END;$function$
;


