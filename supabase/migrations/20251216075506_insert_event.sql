CREATE FUNCTION insert_event (tournament_id bigint, name varchar(80), start_time timestamptz, end_time timestamptz,
                              price numeric(12, 2), video_game text, platform text, teams_allowed boolean, is_online boolean,
                              max_team_size int default null, place_id text default null, address text default null,
                              latitude double precision default null, longitude double precision default null)
                              RETURNS int
                              SET search_path = ''
                              AS $$
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
$$ language plpgsql;