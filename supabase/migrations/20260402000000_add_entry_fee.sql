-- Add entry fee columns to tournaments
ALTER TABLE public.tournaments
    ADD COLUMN entry_fee_cents integer NOT NULL DEFAULT 0 CHECK (entry_fee_cents >= 0),
    ADD COLUMN currency varchar(3) NOT NULL DEFAULT 'USD';

-- Create payments table to track entry fee payments
CREATE TABLE public.payments (
    id serial NOT NULL,
    tournament_id integer NOT NULL,
    user_id uuid NOT NULL,
    stripe_payment_intent_id text NOT NULL,
    amount_cents integer NOT NULL CHECK (amount_cents > 0),
    currency varchar(3) NOT NULL DEFAULT 'USD',
    status varchar(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'refunded', 'failed')),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    CONSTRAINT payments_pk PRIMARY KEY (id),
    CONSTRAINT payments_tournament_user_uk UNIQUE (tournament_id, user_id),
    CONSTRAINT payments_stripe_pi_uk UNIQUE (stripe_payment_intent_id)
);

-- Foreign keys for payments
ALTER TABLE public.payments ADD CONSTRAINT payments_tournaments_fk_01
    FOREIGN KEY (tournament_id)
    REFERENCES public.tournaments (id)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE public.payments ADD CONSTRAINT payments_users_fk_01
    FOREIGN KEY (user_id)
    REFERENCES public.users (user_id)
    ON DELETE CASCADE
    NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments
CREATE POLICY payments_select_own ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- Users can read payments for tournaments they admin
CREATE POLICY payments_select_admin ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE admins.tournament_id = payments.tournament_id
            AND admins.user_id = auth.uid()
        )
    );

-- Only service role / webhooks should insert payments (no user insert policy)
-- Payments are created server-side via service role after Stripe webhook confirmation

-- Update insert_tournament to accept entry fee
DROP FUNCTION IF EXISTS public.insert_tournament;

CREATE OR REPLACE FUNCTION public.insert_tournament(
    t_name character varying,
    t_start_time timestamp with time zone,
    t_end_time timestamp with time zone,
    t_is_online boolean,
    t_is_public boolean,
    t_entry_fee_cents integer DEFAULT 0,
    t_currency character varying DEFAULT 'USD'::character varying,
    t_email character varying DEFAULT NULL::character varying,
    t_discord character varying DEFAULT NULL::character varying,
    t_slug character varying DEFAULT NULL::character varying,
    t_place_id text DEFAULT NULL::text,
    t_address text DEFAULT NULL::text,
    t_latitude double precision DEFAULT NULL::double precision,
    t_longitude double precision DEFAULT NULL::double precision
)
RETURNS bigint
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
    t_id bigint;
    loc_id bigint;
BEGIN

IF t_is_online = false THEN
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
END IF;

INSERT INTO public.tournaments (name, start_time, end_time, slug, email_contact, discord_invite, owner, is_public, is_online, location_id, entry_fee_cents, currency)
VALUES (t_name, t_start_time, t_end_time, t_slug, t_email, t_discord, auth.uid(), t_is_public, t_is_online, loc_id, t_entry_fee_cents, t_currency)
    RETURNING id
INTO t_id;

INSERT INTO public.admins (tournament_id, user_id, permission_level)
VALUES (t_id, auth.uid(), 0);

RETURN t_id;
END;
$function$;

-- Update update_tournament to accept entry fee
DROP FUNCTION IF EXISTS public.update_tournament;

CREATE OR REPLACE FUNCTION public.update_tournament(
    t_id bigint,
    t_name character varying,
    t_start_time timestamp with time zone,
    t_end_time timestamp with time zone,
    t_is_online boolean,
    t_is_public boolean,
    t_entry_fee_cents integer DEFAULT 0,
    t_currency character varying DEFAULT 'USD'::character varying,
    t_email character varying DEFAULT NULL::character varying,
    t_discord character varying DEFAULT NULL::character varying,
    t_slug character varying DEFAULT NULL::character varying,
    t_place_id text DEFAULT NULL::text,
    t_address text DEFAULT NULL::text,
    t_latitude double precision DEFAULT NULL::double precision,
    t_longitude double precision DEFAULT NULL::double precision
)
RETURNS bigint
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
    loc_id bigint;
BEGIN

IF t_is_online = false THEN
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
END IF;

UPDATE public.tournaments
SET name = t_name, start_time = t_start_time, end_time = t_end_time, slug = t_slug,
    email_contact = t_email, discord_invite = t_discord, is_public = t_is_public,
    is_online = t_is_online, location_id = loc_id,
    entry_fee_cents = t_entry_fee_cents, currency = t_currency
WHERE id = t_id;

RETURN t_id;
END;
$function$;

-- RLS policies for attendees (allow users to register themselves and view their own registrations)
CREATE POLICY attendees_select_own ON public.attendees
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY attendees_select_admin ON public.attendees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE admins.tournament_id = attendees.tournament_id
            AND admins.user_id = auth.uid()
        )
    );

CREATE POLICY attendees_insert_own ON public.attendees
    FOR INSERT WITH CHECK (auth.uid() = user_id);
