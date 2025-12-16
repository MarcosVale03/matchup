CREATE FUNCTION insert_tournament (t_name varchar(80), t_start_time timestamptz, t_end_time timestamptz, is_online boolean,
                                   t_email varchar(254) default null, t_discord varchar(8) default null,
                                   t_slug varchar(80) default null, t_place_id text default null, t_address text default null,
                                   t_latitude double precision default null, t_longitude double precision default null)
                                   returns bigint AS $$
DECLARE
    t_id bigint;
    email_id bigint;
    discord_id bigint;
    loc_id bigint;
BEGIN
    INSERT INTO tournaments (name, start_time, end_time, slug)
    VALUES (t_name, t_start_time, t_end_time, t_slug)
    RETURNING id
    INTO t_id;

    IF t_email IS NOT NULL THEN
        SELECT contact_id
        INTO email_id
        FROM email_contacts
        WHERE email = t_email;

        IF email_id IS NULL THEN
            INSERT INTO contacts DEFAULT VALUES
            RETURNING id
            INTO email_id;

            INSERT INTO email_contacts (contact_id, email)
            VALUES (email_id, t_email);
        END IF;

        INSERT INTO tournament_contacts (tournament_id, contact_id)
        VALUES (t_id, email_id);
    END IF;

    IF t_discord IS NOT NULL THEN
        SELECT contact_id
        INTO discord_id
        FROM discord_contacts
        WHERE invite_code = t_discord;

            IF discord_id IS NULL THEN
                INSERT INTO contacts DEFAULT VALUES
                RETURNING id
                INTO discord_id;

                INSERT INTO discord_contacts (contact_id, invite_code)
                VALUES (discord_id, t_discord);
            END IF;

        INSERT INTO tournament_contacts (tournament_id, contact_id)
        VALUES (t_id, discord_id);
    END IF;

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