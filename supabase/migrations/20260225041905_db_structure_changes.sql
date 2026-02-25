/*Updating RLS policy on tournaments to be more strict*/
drop policy "Enable read access for all users" on "public"."tournaments";


  create policy "Enable read access of public tournaments for all users"
  on "public"."tournaments"
  as permissive
  for select
  to public
  using (((is_public = true) OR (owner = auth.uid())));

/*Removing offline_events and offline_tournaments tables*/
revoke delete on table "public"."offline_events" from "anon";

revoke insert on table "public"."offline_events" from "anon";

revoke references on table "public"."offline_events" from "anon";

revoke select on table "public"."offline_events" from "anon";

revoke trigger on table "public"."offline_events" from "anon";

revoke truncate on table "public"."offline_events" from "anon";

revoke update on table "public"."offline_events" from "anon";

revoke delete on table "public"."offline_events" from "authenticated";

revoke insert on table "public"."offline_events" from "authenticated";

revoke references on table "public"."offline_events" from "authenticated";

revoke select on table "public"."offline_events" from "authenticated";

revoke trigger on table "public"."offline_events" from "authenticated";

revoke truncate on table "public"."offline_events" from "authenticated";

revoke update on table "public"."offline_events" from "authenticated";

revoke delete on table "public"."offline_events" from "service_role";

revoke insert on table "public"."offline_events" from "service_role";

revoke references on table "public"."offline_events" from "service_role";

revoke select on table "public"."offline_events" from "service_role";

revoke trigger on table "public"."offline_events" from "service_role";

revoke truncate on table "public"."offline_events" from "service_role";

revoke update on table "public"."offline_events" from "service_role";

revoke delete on table "public"."offline_tournaments" from "anon";

revoke insert on table "public"."offline_tournaments" from "anon";

revoke references on table "public"."offline_tournaments" from "anon";

revoke select on table "public"."offline_tournaments" from "anon";

revoke trigger on table "public"."offline_tournaments" from "anon";

revoke truncate on table "public"."offline_tournaments" from "anon";

revoke update on table "public"."offline_tournaments" from "anon";

revoke delete on table "public"."offline_tournaments" from "authenticated";

revoke insert on table "public"."offline_tournaments" from "authenticated";

revoke references on table "public"."offline_tournaments" from "authenticated";

revoke select on table "public"."offline_tournaments" from "authenticated";

revoke trigger on table "public"."offline_tournaments" from "authenticated";

revoke truncate on table "public"."offline_tournaments" from "authenticated";

revoke update on table "public"."offline_tournaments" from "authenticated";

revoke delete on table "public"."offline_tournaments" from "service_role";

revoke insert on table "public"."offline_tournaments" from "service_role";

revoke references on table "public"."offline_tournaments" from "service_role";

revoke select on table "public"."offline_tournaments" from "service_role";

revoke trigger on table "public"."offline_tournaments" from "service_role";

revoke truncate on table "public"."offline_tournaments" from "service_role";

revoke update on table "public"."offline_tournaments" from "service_role";

alter table "public"."offline_events" drop constraint "offline_events_events_fk_01";

alter table "public"."offline_events" drop constraint "offline_events_locations_fk_01";

alter table "public"."offline_tournaments" drop constraint "offline_tournaments_locations_fk_01";

alter table "public"."offline_tournaments" drop constraint "offline_tournaments_tournaments_fk_01";

alter table "public"."offline_events" drop constraint "offline_events_pk";

alter table "public"."offline_tournaments" drop constraint "offline_tournaments_pk";

drop index if exists "public"."offline_events_pk";

drop index if exists "public"."offline_tournaments_pk";

drop table "public"."offline_events";

drop table "public"."offline_tournaments";

/*Adding is_online and location_id columns to tournaments*/
alter table "public"."tournaments" add column "is_online" boolean not null;

alter table "public"."tournaments" add column "location_id" bigint default NULL;

alter table "public"."tournaments" add constraint "tournaments_locations_fk_01" FOREIGN KEY (location_id) REFERENCES public.locations(id) not deferrable initially immediate;

alter table "public"."tournaments" add constraint "tournaments_offline_location_check" CHECK ( (is_online = true) OR (location_id IS NOT NULL) );

/*Events refactor*/
alter table "public"."bracket_phases" drop constraint "bracket_phases_events_fk_01";

alter table "public"."entrants" drop constraint "entrants_events_fk_01";

alter table "public"."entrants" drop constraint "entrants_teams_fk_01";

alter table "public"."matches" drop constraint "matches_match_slots_fk_01";

alter table "public"."matches" drop constraint "matches_phase_groups_fk_01";

alter table "public"."phase_groups" drop constraint "phase_groups_bracket_phases_fk_01";

alter table "public"."seeds" drop constraint "seeds_entrants_fk_01";

alter table "public"."seeds" drop constraint "seeds_events_fk_01";

alter table "public"."seeds" drop constraint "seeds_teams_fk_01";

alter table "public"."teams" drop constraint "teams_events_fk_01";

alter table "public"."match_slots" drop constraint "match_slots_matches_fk_01";

alter table "public"."match_slots" drop constraint "match_slots_seeds_fk_01";

alter table "public"."bracket_phases" drop constraint "bracket_phases_bracket_phases_fk_01";

alter table "public"."bracket_phases" drop constraint "bracket_phases_pk";

alter table "public"."entrants" drop constraint "entrants_pk";

alter table "public"."events" drop constraint "events_pk";

alter table "public"."match_slots" drop constraint "match_slots_pk";

alter table "public"."matches" drop constraint "matches_pk";

alter table "public"."phase_groups" drop constraint "phase_groups_pk";

alter table "public"."seeds" drop constraint "seeds_pk";

alter table "public"."teams" drop constraint "teams_pk";

drop index if exists "public"."bracket_phases_pk";

drop index if exists "public"."entrants_pk";

drop index if exists "public"."events_pk";

drop index if exists "public"."match_slots_pk";

drop index if exists "public"."matches_pk";

drop index if exists "public"."phase_groups_pk";

drop index if exists "public"."seeds_pk";

drop index if exists "public"."teams_pk";

alter table "public"."bracket_phases" drop column "event_name";

alter table "public"."bracket_phases" drop column "next_phase_name";

alter table "public"."bracket_phases" add column "event_id" smallint not null;

alter table "public"."bracket_phases" add column "id" smallint generated by default as identity not null;

alter table "public"."bracket_phases" add column "next_phase_id" smallint;

alter table "public"."entrants" drop column "event_name";

alter table "public"."entrants" add column "event_id" smallint not null;

alter table "public"."events" add column "id" smallint generated by default as identity not null;

alter table "public"."events" alter column "max_team_size" set data type smallint using "max_team_size"::smallint;

alter table "public"."match_slots" drop column "event_name";

alter table "public"."match_slots" add column "event_id" smallint not null;

alter table "public"."match_slots" alter column "seed_num" set data type smallint using "seed_num"::smallint;

alter table "public"."match_slots" alter column "slot_num" set data type smallint using "slot_num"::smallint;

alter table "public"."matches" drop column "event_name";

alter table "public"."matches" add column "event_id" smallint not null;

alter table "public"."matches" alter column "advance_slot_num" set data type smallint using "advance_slot_num"::smallint;

alter table "public"."phase_groups" drop column "bracket_phase_name";

alter table "public"."phase_groups" drop column "event_name";

alter table "public"."phase_groups" add column "bracket_phase_id" smallint not null;

alter table "public"."phase_groups" add column "event_id" smallint not null;

alter table "public"."seeds" drop column "event_name";

alter table "public"."seeds" add column "event_id" smallint not null;

alter table "public"."teams" drop column "event_name";

alter table "public"."teams" add column "event_id" smallint not null;

CREATE UNIQUE INDEX bracket_phases_pk ON public.bracket_phases USING btree (tournament_id, event_id, id);

CREATE UNIQUE INDEX entrants_pk ON public.entrants USING btree (tournament_id, user_id, event_id);

CREATE UNIQUE INDEX events_pk ON public.events USING btree (tournament_id, id);

CREATE UNIQUE INDEX match_slots_pk ON public.match_slots USING btree (match_identifier, tournament_id, event_id, phase_group_identifier, slot_num);

CREATE UNIQUE INDEX matches_pk ON public.matches USING btree (identifier, tournament_id, event_id, phase_group_identifier);

CREATE UNIQUE INDEX phase_groups_pk ON public.phase_groups USING btree (identifier, tournament_id, event_id);

CREATE UNIQUE INDEX seeds_pk ON public.seeds USING btree (seed_num, tournament_id, event_id);

CREATE UNIQUE INDEX teams_pk ON public.teams USING btree (name, tournament_id, event_id);

alter table "public"."bracket_phases" add constraint "bracket_phases_pk" PRIMARY KEY using index "bracket_phases_pk";

alter table "public"."entrants" add constraint "entrants_pk" PRIMARY KEY using index "entrants_pk";

alter table "public"."events" add constraint "events_pk" PRIMARY KEY using index "events_pk";

alter table "public"."match_slots" add constraint "match_slots_pk" PRIMARY KEY using index "match_slots_pk";

alter table "public"."matches" add constraint "matches_pk" PRIMARY KEY using index "matches_pk";

alter table "public"."phase_groups" add constraint "phase_groups_pk" PRIMARY KEY using index "phase_groups_pk";

alter table "public"."seeds" add constraint "seeds_pk" PRIMARY KEY using index "seeds_pk";

alter table "public"."teams" add constraint "teams_pk" PRIMARY KEY using index "teams_pk";

alter table "public"."bracket_phases" add constraint "bracket_phases_events_fk_01" FOREIGN KEY (tournament_id, event_id) REFERENCES public.events(tournament_id, id) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."bracket_phases" add constraint "bracket_phases_bracket_phases_fk_01" FOREIGN KEY (tournament_id, event_id, next_phase_id) REFERENCES public.bracket_phases(tournament_id, event_id, id) ON DELETE SET NULL not deferrable initially immediate;

alter table "public"."entrants" add constraint "entrants_events_fk_01" FOREIGN KEY (tournament_id, event_id) REFERENCES public.events(tournament_id, id) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."entrants" add constraint "entrants_teams_fk_01" FOREIGN KEY (tournament_id, event_id, team_name) REFERENCES public.teams(tournament_id, event_id, name) not deferrable initially immediate;

alter table "public"."match_slots" add constraint "match_slots_matches_fk_01" FOREIGN KEY (tournament_id, event_id, match_identifier, phase_group_identifier) REFERENCES public.matches(tournament_id, event_id, identifier, phase_group_identifier) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."match_slots" add constraint "match_slots_seeds_fk_01" FOREIGN KEY (tournament_id, event_id, seed_num) REFERENCES public.seeds(tournament_id, event_id, seed_num) ON DELETE SET NULL not deferrable initially immediate;

alter table "public"."matches" add constraint "matches_match_slots_fk_01" FOREIGN KEY (tournament_id, event_id, phase_group_identifier, advance_match_identifier, advance_slot_num) REFERENCES public.match_slots(tournament_id, event_id, phase_group_identifier, match_identifier, slot_num) ON DELETE SET NULL not deferrable initially immediate;

alter table "public"."matches" add constraint "matches_phase_groups_fk_01" FOREIGN KEY (tournament_id, event_id, phase_group_identifier) REFERENCES public.phase_groups(tournament_id, event_id, identifier) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."phase_groups" add constraint "phase_groups_bracket_phases_fk_01" FOREIGN KEY (tournament_id, event_id, bracket_phase_id) REFERENCES public.bracket_phases(tournament_id, event_id, id) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."seeds" add constraint "seeds_entrants_fk_01" FOREIGN KEY (tournament_id, event_id, entrant_user_id) REFERENCES public.entrants(tournament_id, event_id, user_id) not deferrable initially immediate;

alter table "public"."seeds" add constraint "seeds_events_fk_01" FOREIGN KEY (tournament_id, event_id) REFERENCES public.events(tournament_id, id) ON DELETE CASCADE not deferrable initially immediate;

alter table "public"."seeds" add constraint "seeds_teams_fk_01" FOREIGN KEY (tournament_id, event_id, team_name) REFERENCES public.teams(tournament_id, event_id, name) not deferrable initially immediate;

alter table "public"."teams" add constraint "teams_events_fk_01" FOREIGN KEY (tournament_id, event_id) REFERENCES public.events(tournament_id, id) not deferrable initially immediate;

alter table "public"."phase_groups" add constraint "identifier_no_spaces_check" CHECK ( identifier NOT LIKE '% %' );

alter table "public"."matches" add constraint "identifier_no_spaces_check" CHECK ( identifier NOT LIKE '% %' );

alter table "public"."waves" add constraint "identifier_no_spaces_check" CHECK ( identifier NOT LIKE '% %' );

/*Add new columns*/
alter table "public"."entrants" add column "placement" integer;

alter table "public"."users" add column "country" character varying;

alter table "public"."users" add column "show_results" boolean not null default true;

alter table "public"."users" add column "state" character varying;

alter table "public"."users" add column "time_joined" timestamp with time zone not null;

/*Update hande_new_user function*/
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
  INSERT INTO public.users (user_id, first_name, last_name, display_name, prefix, time_joined)
  VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'prefix', NOW());
RETURN new;
END;$function$
;

/*Update tournament functions*/
DROP FUNCTION IF EXISTS insert_tournament;

DROP FUNCTION IF EXISTS update_tournament;

DROP FUNCTION IF EXISTS insert_event;

CREATE OR REPLACE FUNCTION public.insert_tournament(t_name character varying, t_start_time timestamp with time zone, t_end_time timestamp with time zone, t_is_online boolean, t_is_public boolean, t_email character varying DEFAULT NULL::character varying, t_discord character varying DEFAULT NULL::character varying, t_slug character varying DEFAULT NULL::character varying, t_place_id text DEFAULT NULL::text, t_address text DEFAULT NULL::text, t_latitude double precision DEFAULT NULL::double precision, t_longitude double precision DEFAULT NULL::double precision)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$DECLARE
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

INSERT INTO public.tournaments (name, start_time, end_time, slug, email_contact, discord_invite, owner, is_public, is_online, location_id)
VALUES (t_name, t_start_time, t_end_time, t_slug, t_email, t_discord, auth.uid(), t_is_public, t_is_online, loc_id)
    RETURNING id
INTO t_id;

INSERT INTO public.admins (tournament_id, user_id, permission_level)
VALUES (t_id, auth.uid(), 0);

RETURN t_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_tournament(t_id bigint, t_name character varying, t_start_time timestamp with time zone, t_end_time timestamp with time zone, t_is_online boolean, t_is_public boolean, t_email character varying DEFAULT NULL::character varying, t_discord character varying DEFAULT NULL::character varying, t_slug character varying DEFAULT NULL::character varying, t_place_id text DEFAULT NULL::text, t_address text DEFAULT NULL::text, t_latitude double precision DEFAULT NULL::double precision, t_longitude double precision DEFAULT NULL::double precision)
 RETURNS bigint
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$DECLARE
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
SET name = t_name, start_time = t_start_time, end_time = t_end_time, slug = t_slug, email_contact = t_email, discord_invite = t_discord, is_public = t_is_public, is_online = t_is_online, location_id = loc_id
WHERE id = t_id;

RETURN t_id;
END;$function$
;