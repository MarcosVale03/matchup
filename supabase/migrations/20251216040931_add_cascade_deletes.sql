alter table "public"."attendees" drop constraint "attendees_tournaments_fk_01";

alter table "public"."events" drop constraint "events_tournaments_fk_01";

alter table "public"."offline_tournaments" drop constraint "offline_tournaments_tournaments_fk_01";

alter table "public"."waves" drop constraint "waves_tournaments_fk_01";

alter table "public"."attendees" add constraint "attendees_tournaments_fk_01" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."events" add constraint "events_tournaments_fk_01" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."offline_tournaments" add constraint "offline_tournaments_tournaments_fk_01" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE  NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."phase_groups" drop constraint "phase_groups_waves_fk_01";

alter table "public"."waves" drop constraint "waves_pk";

alter table "public"."waves" drop column "tournaments_id";

alter table "public"."waves" add column "tournament_id" bigint not null;

alter table "public"."waves" add constraint "waves_pk" PRIMARY KEY (identifier, tournament_id);

alter table "public"."phase_groups" add constraint "phase_groups_waves_fk_01" FOREIGN KEY (wave_identifier, tournament_id) REFERENCES public.waves(identifier, tournament_id) NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."waves" add constraint "waves_tournaments_fk_01" FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE  NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."bracket_phases" drop constraint "bracket_phases_events_fk_01";

alter table "public"."entrants" drop constraint "entrants_attendees_fk_01";

alter table "public"."entrants" drop constraint "entrants_events_fk_01";

alter table "public"."entrants" drop constraint "entrants_teams_fk_01";

alter table "public"."matches" drop constraint "matches_match_slots";

alter table "public"."matches" drop constraint "matches_phase_groups_fk_01";

alter table "public"."offline_events" drop constraint "offline_events_events_fk_01";

alter table "public"."phase_groups" drop constraint "phase_groups_bracket_phases_fk_01";

alter table "public"."phase_groups" drop constraint "phase_groups_waves_fk_01";

alter table "public"."seeds" drop constraint "seeds_entrants_fk_01";

alter table "public"."seeds" drop constraint "seeds_events_fk_01";

alter table "public"."seeds" drop constraint "seeds_teams_fk_01";

alter table "public"."teams" drop constraint "teams_events_fk_01";

alter table "public"."match_slots" drop constraint "match_slots_matches_fk_01";

alter table "public"."match_slots" drop constraint "match_slots_seeds_fk_01";

alter table "public"."phase_groups" alter column "wave_identifier" drop not null;

alter table "public"."bracket_phases" add constraint "bracket_phases_events_fk_01" FOREIGN KEY (tournament_id, event_name) REFERENCES public.events(tournament_id, name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."entrants" add constraint "entrants_teams_fk_01" FOREIGN KEY (team_name, tournament_id, event_name) REFERENCES public.teams(name, tournament_id, event_name) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."entrants" add constraint "entrants_events_fk_01" FOREIGN KEY (tournament_id, event_name) REFERENCES public.events(tournament_id, name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."entrants" add constraint "entrants_attendees_fk_01" FOREIGN KEY (tournament_id, user_id) REFERENCES public.attendees(tournament_id, user_id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."matches" add constraint "matches_match_slots_fk_01" FOREIGN KEY (advance_match_identifier, tournament_id, event_name, phase_group_identifier, advance_slot_num) REFERENCES public.match_slots(match_identifier, tournament_id, event_name, phase_group_identifier, slot_num) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."matches" add constraint "matches_phase_groups_fk_01" FOREIGN KEY (phase_group_identifier, tournament_id, event_name) REFERENCES public.phase_groups(identifier, tournament_id, event_name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."offline_events" add constraint "offline_events_events_fk_01" FOREIGN KEY (tournament_id, event_name) REFERENCES public.events(tournament_id, name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."phase_groups" add constraint "phase_groups_bracket_phases_fk_01" FOREIGN KEY (bracket_phase_name, tournament_id, event_name) REFERENCES public.bracket_phases(name, tournament_id, event_name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."phase_groups" add constraint "phase_groups_waves_fk_01" FOREIGN KEY (wave_identifier, tournament_id) REFERENCES public.waves(identifier, tournament_id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."seeds" add constraint "seeds_teams_fk_01" FOREIGN KEY (team_name, tournament_id, event_name) REFERENCES public.teams(name, tournament_id, event_name) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."seeds" add constraint "seeds_entrants_fk_01" FOREIGN KEY (tournament_id, event_name, entrant_user_id) REFERENCES public.entrants(tournament_id, event_name, user_id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."seeds" add constraint "seeds_events_fk_01" FOREIGN KEY (tournament_id, event_name) REFERENCES public.events(tournament_id, name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."teams" add constraint "teams_events_fk_01" FOREIGN KEY (tournament_id, event_name) REFERENCES public.events(tournament_id, name) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."match_slots" add constraint "match_slots_matches_fk_01" FOREIGN KEY (match_identifier, tournament_id, event_name, phase_group_identifier) REFERENCES public.matches(identifier, tournament_id, event_name, phase_group_identifier) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."match_slots" add constraint "match_slots_seeds_fk_01" FOREIGN KEY (seed_num, tournament_id, event_name) REFERENCES public.seeds(seed_num, tournament_id, event_name) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE;