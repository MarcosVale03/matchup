DROP FUNCTION insert_tournament;

CREATE FUNCTION insert_tournament (t_name varchar(80), t_start_time timestamptz, t_end_time timestamptz, is_online boolean,
                                   t_email varchar(254) default null, t_discord varchar(8) default null,
                                   t_slug varchar(80) default null, t_place_id text default null, t_address text default null,
                                   t_latitude double precision default null, t_longitude double precision default null)
                                   returns bigint AS $$
DECLARE
    t_id bigint;
    loc_id bigint;
BEGIN
    INSERT INTO tournaments (name, start_time, end_time, slug, email_contact, discord_invite)
    VALUES (t_name, t_start_time, t_end_time, t_slug, t_email, t_discord)
    RETURNING id
    INTO t_id;

    IF is_online THEN
        RETURN t_id;
    END IF;

    SELECT id
    INTO loc_id
    FROM locations
    WHERE maps_place_id = t_place_id;

    IF loc_id IS NULL THEN
        INSERT INTO locations (maps_place_id, address, latitude, longitude)
        VALUES (t_place_id, t_address, t_latitude, t_longitude)
        RETURNING id
        INTO loc_id;
    END IF;

    INSERT INTO offline_tournaments (tournament_id, location_id)
    VALUES (t_id, loc_id);

    RETURN t_id;
END;
$$ language plpgsql;



CREATE FUNCTION update_tournament (t_id bigint, t_name varchar(80), t_start_time timestamptz, t_end_time timestamptz, is_online boolean,
                                   t_email varchar(254) default null, t_discord varchar(8) default null,
                                   t_slug varchar(80) default null, t_place_id text default null, t_address text default null,
                                   t_latitude double precision default null, t_longitude double precision default null)
                                   returns bigint AS $$
DECLARE
    email_id bigint;
    discord_id bigint;
    loc_id bigint;
BEGIN
    UPDATE tournaments
    SET name = t_name, start_time = t_start_time, end_time = t_end_time, slug = t_slug, email_contact = t_email, discord_invite = t_discord
    WHERE id = t_id;

    IF is_online THEN
        RETURN t_id;
    END IF;

    SELECT id
    INTO loc_id
    FROM locations
    WHERE maps_place_id = t_place_id;

    IF loc_id IS NULL THEN
        INSERT INTO locations (maps_place_id, address, latitude, longitude)
        VALUES (t_place_id, t_address, t_latitude, t_longitude)
        RETURNING id
        INTO loc_id;
    END IF;

    UPDATE offline_tournaments
    SET location_id = loc_id
    WHERE tournament_id = t_id;

    RETURN t_id;
END;
$$ language plpgsql;