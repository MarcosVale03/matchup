-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2025-12-08 21:50:59.199

-- tables
-- Table: attendees
CREATE TABLE attendees (
    user_email varchar(80)  NOT NULL,
    tournament_id int  NOT NULL,
    CONSTRAINT attendees_pk PRIMARY KEY (user_email,tournament_id)
);

-- Table: bracket_phases
CREATE TABLE bracket_phases (
    name varchar(40)  NOT NULL CHECK (length(name)>=3),
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    next_phase_name varchar(40)  NULL,
    num_progressing_per_group int  NOT NULL CHECK (num_progressing_per_group>=1),
    bracket_type_name varchar(20)  NOT NULL,
    CONSTRAINT bracket_phases_pk PRIMARY KEY (name,tournament_id,event_name)
);

-- Table: bracket_types
CREATE TABLE bracket_types (
    name varchar(20)  NOT NULL CHECK (length(name)>=3),
    CONSTRAINT bracket_types_pk PRIMARY KEY (name)
);

-- Table: contacts
CREATE TABLE contacts (
    id serial  NOT NULL,
    CONSTRAINT contacts_pk PRIMARY KEY (id)
);

-- Table: discord_contact
CREATE TABLE discord_contact (
    contact_id int  NOT NULL,
    invite_link varchar(80)  NOT NULL,
    CONSTRAINT discord_contact_uk_01 UNIQUE (invite_link) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT discord_contact_pk PRIMARY KEY (contact_id)
);

-- Table: email_contacts
CREATE TABLE email_contacts (
    contact_id int  NOT NULL,
    email varchar(80)  NOT NULL,
    CONSTRAINT email_contacts_uk_01 UNIQUE (email) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT email_contacts_pk PRIMARY KEY (contact_id)
);

-- Table: entrants
CREATE TABLE entrants (
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    user_email varchar(80)  NOT NULL,
    team_name varchar(50)  NULL,
    CONSTRAINT entrants_pk PRIMARY KEY (tournament_id,event_name,user_email)
);

-- Table: event_video_games
CREATE TABLE event_video_games (
    video_game_name varchar(40)  NOT NULL,
    gaming_platform_name varchar(20)  NOT NULL,
    CONSTRAINT event_video_games_pk PRIMARY KEY (video_game_name,gaming_platform_name)
);

-- Table: events
CREATE TABLE events (
    tournament_id int  NOT NULL,
    name varchar(80)  NOT NULL CHECK (length(name)>=3),
    description varchar(1024)  NOT NULL,
    start_time timestamp  NOT NULL,
    end_time timestamp  NOT NULL,
    price money  NOT NULL,
    video_game_name varchar(40)  NOT NULL,
    gaming_platform_name varchar(20)  NOT NULL,
    teams_allowed boolean  NOT NULL,
    max_team_size int  NULL,
    CONSTRAINT events_pk PRIMARY KEY (tournament_id,name)
);

-- Table: gaming_platforms
CREATE TABLE gaming_platforms (
    name varchar(20)  NOT NULL CHECK (length(name)>=3),
    CONSTRAINT gaming_platforms_pk PRIMARY KEY (name)
);

-- Table: locations
CREATE TABLE locations (
    id serial  NOT NULL,
    mapsPlaceId text  NOT NULL,
    address varchar(120)  NOT NULL CHECK (length(address)>=3),
    coordinates point  NOT NULL,
    CONSTRAINT locations_uk_01 UNIQUE (mapsPlaceId) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT locations_uk_02 UNIQUE (address) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT locations_pk PRIMARY KEY (id)
);

-- Table: match_slots
CREATE TABLE match_slots (
    match_identifier varchar(8)  NOT NULL,
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    phase_group_identifier varchar(8)  NOT NULL,
    slot_num int  NOT NULL CHECK (slot_num>=1 AND slot_num<=32),
    seed_num int  NULL,
    CONSTRAINT match_slots_pk PRIMARY KEY (slot_num,match_identifier,event_name,phase_group_identifier,tournament_id)
);

-- Table: matches
CREATE TABLE matches (
    identifier varchar(8)  NOT NULL CHECK (length(identifier)>=1),
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    phase_group_identifier varchar(8)  NOT NULL,
    advance_match_identifier varchar(8)  NULL,
    advance_slot_num int  NULL,
    CONSTRAINT matches_pk PRIMARY KEY (identifier,tournament_id,event_name,phase_group_identifier)
);

-- Table: offline_events
CREATE TABLE offline_events (
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    location_id int  NOT NULL,
    CONSTRAINT offline_events_pk PRIMARY KEY (tournament_id,event_name)
);

-- Table: offline_tournaments
CREATE TABLE offline_tournaments (
    tournament_id int  NOT NULL,
    location_id int  NOT NULL,
    CONSTRAINT offline_tournaments_pk PRIMARY KEY (tournament_id)
);

-- Table: online_events
CREATE TABLE online_events (
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    CONSTRAINT online_events_pk PRIMARY KEY (tournament_id,event_name)
);

-- Table: online_tournaments
CREATE TABLE online_tournaments (
    tournament_id int  NOT NULL,
    CONSTRAINT online_tournaments_pk PRIMARY KEY (tournament_id)
);

-- Table: phase_groups
CREATE TABLE phase_groups (
    identifier varchar(8)  NOT NULL CHECK (length(identifier)>=1),
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    bracket_phase_name varchar(40)  NOT NULL,
    wave_identifier varchar(8)  NOT NULL,
    CONSTRAINT phase_groups_pk PRIMARY KEY (identifier,tournament_id,event_name)
);

-- Table: seeds
CREATE TABLE seeds (
    seed_num int  NOT NULL,
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    entrant_user_email varchar(80)  NULL,
    team_name varchar(50)  NULL,
    CONSTRAINT seeds_pk PRIMARY KEY (seed_num,tournament_id,event_name)
);

-- Table: teams
CREATE TABLE teams (
    name varchar(50)  NOT NULL,
    tournament_id int  NOT NULL,
    event_name varchar(80)  NOT NULL,
    CONSTRAINT teams_pk PRIMARY KEY (name,tournament_id,event_name)
);

-- Table: tournament_contacts
CREATE TABLE tournament_contacts (
    tournament_id int  NOT NULL,
    contact_id int  NOT NULL,
    CONSTRAINT tournament_contacts_pk PRIMARY KEY (tournament_id,contact_id)
);

-- Table: tournaments
CREATE TABLE tournaments (
    id serial  NOT NULL,
    name varchar(80)  NOT NULL CHECK (length(name)>=3),
    slug varchar(80)  NOT NULL CHECK (length(slug)>=3),
    description varchar(1024)  NOT NULL,
    start_time timestamp  NOT NULL,
    end_time timestamp  NOT NULL,
    CONSTRAINT tournaments_uk_01 UNIQUE (slug) NOT DEFERRABLE  INITIALLY IMMEDIATE,
    CONSTRAINT tournaments_pk PRIMARY KEY (id)
);

-- Table: users
CREATE TABLE users (
    email varchar(80)  NOT NULL CHECK (length(email)>=6),
    first_name varchar(50)  NOT NULL CHECK (length(first_name)>=1),
    last_name varchar(50)  NOT NULL CHECK (length(last_name)>=1),
    display_name varchar(50)  NOT NULL CHECK (length(display_name)>=3),
    prefix varchar(10)  NOT NULL,
    salt varchar(128)  NOT NULL,
    passhash varchar(256)  NOT NULL,
    CONSTRAINT users_pk PRIMARY KEY (email)
);

-- Table: video_games
CREATE TABLE video_games (
    name varchar(40)  NOT NULL CHECK (length(name)>=3),
    CONSTRAINT video_games_pk PRIMARY KEY (name)
);

-- Table: waves
CREATE TABLE waves (
    identifier varchar(8)  NOT NULL CHECK (length(identifier)>=1),
    tournaments_id int  NOT NULL,
    CONSTRAINT waves_pk PRIMARY KEY (identifier,tournaments_id)
);

-- foreign keys
-- Reference: attendees_tournaments_fk_01 (table: attendees)
ALTER TABLE attendees ADD CONSTRAINT attendees_tournaments_fk_01
    FOREIGN KEY (tournament_id)
    REFERENCES tournaments (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: attendees_users_fk_01 (table: attendees)
ALTER TABLE attendees ADD CONSTRAINT attendees_users_fk_01
    FOREIGN KEY (user_email)
    REFERENCES users (email)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: bracket_phases_bracket_phases_fk_01 (table: bracket_phases)
ALTER TABLE bracket_phases ADD CONSTRAINT bracket_phases_bracket_phases_fk_01
    FOREIGN KEY (next_phase_name, tournament_id, event_name)
    REFERENCES bracket_phases (name, tournament_id, event_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: bracket_phases_bracket_types_fk_01 (table: bracket_phases)
ALTER TABLE bracket_phases ADD CONSTRAINT bracket_phases_bracket_types_fk_01
    FOREIGN KEY (bracket_type_name)
    REFERENCES bracket_types (name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: bracket_phases_events_fk_01 (table: bracket_phases)
ALTER TABLE bracket_phases ADD CONSTRAINT bracket_phases_events_fk_01
    FOREIGN KEY (tournament_id, event_name)
    REFERENCES events (tournament_id, name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: discord_contact_contacts_fk_01 (table: discord_contact)
ALTER TABLE discord_contact ADD CONSTRAINT discord_contact_contacts_fk_01
    FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: email_contacts_contacts_fk_01 (table: email_contacts)
ALTER TABLE email_contacts ADD CONSTRAINT email_contacts_contacts_fk_01
    FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: entrants_attendees_fk_01 (table: entrants)
ALTER TABLE entrants ADD CONSTRAINT entrants_attendees_fk_01
    FOREIGN KEY (user_email, tournament_id)
    REFERENCES attendees (user_email, tournament_id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: entrants_events_fk_01 (table: entrants)
ALTER TABLE entrants ADD CONSTRAINT entrants_events_fk_01
    FOREIGN KEY (tournament_id, event_name)
    REFERENCES events (tournament_id, name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: entrants_teams_fk_01 (table: entrants)
ALTER TABLE entrants ADD CONSTRAINT entrants_teams_fk_01
    FOREIGN KEY (team_name, tournament_id, event_name)
    REFERENCES teams (name, tournament_id, event_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: event_video_games_gaming_platforms_fk_01 (table: event_video_games)
ALTER TABLE event_video_games ADD CONSTRAINT event_video_games_gaming_platforms_fk_01
    FOREIGN KEY (gaming_platform_name)
    REFERENCES gaming_platforms (name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: event_video_games_video_games_fk_01 (table: event_video_games)
ALTER TABLE event_video_games ADD CONSTRAINT event_video_games_video_games_fk_01
    FOREIGN KEY (video_game_name)
    REFERENCES video_games (name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: events_event_video_games_fk_01 (table: events)
ALTER TABLE events ADD CONSTRAINT events_event_video_games_fk_01
    FOREIGN KEY (video_game_name, gaming_platform_name)
    REFERENCES event_video_games (video_game_name, gaming_platform_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: events_tournaments_fk_01 (table: events)
ALTER TABLE events ADD CONSTRAINT events_tournaments_fk_01
    FOREIGN KEY (tournament_id)
    REFERENCES tournaments (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: match_slots_matches_fk_01 (table: match_slots)
ALTER TABLE match_slots ADD CONSTRAINT match_slots_matches_fk_01
    FOREIGN KEY (match_identifier, tournament_id, event_name, phase_group_identifier)
    REFERENCES matches (identifier, tournament_id, event_name, phase_group_identifier)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: match_slots_seeds_fk_01 (table: match_slots)
ALTER TABLE match_slots ADD CONSTRAINT match_slots_seeds_fk_01
    FOREIGN KEY (seed_num, tournament_id, event_name)
    REFERENCES seeds (seed_num, tournament_id, event_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: matches_match_slots (table: matches)
ALTER TABLE matches ADD CONSTRAINT matches_match_slots
    FOREIGN KEY (advance_match_identifier, tournament_id, event_name, phase_group_identifier, advance_slot_num)
    REFERENCES match_slots (match_identifier, tournament_id, event_name, phase_group_identifier, slot_num)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: matches_phase_groups_fk_01 (table: matches)
ALTER TABLE matches ADD CONSTRAINT matches_phase_groups_fk_01
    FOREIGN KEY (phase_group_identifier, tournament_id, event_name)
    REFERENCES phase_groups (identifier, tournament_id, event_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: offline_events_events_fk_01 (table: offline_events)
ALTER TABLE offline_events ADD CONSTRAINT offline_events_events_fk_01
    FOREIGN KEY (tournament_id, event_name)
    REFERENCES events (tournament_id, name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: offline_events_locations_fk_01 (table: offline_events)
ALTER TABLE offline_events ADD CONSTRAINT offline_events_locations_fk_01
    FOREIGN KEY (location_id)
    REFERENCES locations (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: offline_tournaments_locations_fk_01 (table: offline_tournaments)
ALTER TABLE offline_tournaments ADD CONSTRAINT offline_tournaments_locations_fk_01
    FOREIGN KEY (location_id)
    REFERENCES locations (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: offline_tournaments_tournaments_fk_01 (table: offline_tournaments)
ALTER TABLE offline_tournaments ADD CONSTRAINT offline_tournaments_tournaments_fk_01
    FOREIGN KEY (tournament_id)
    REFERENCES tournaments (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: online_events_events_fk_01 (table: online_events)
ALTER TABLE online_events ADD CONSTRAINT online_events_events_fk_01
    FOREIGN KEY (tournament_id, event_name)
    REFERENCES events (tournament_id, name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: online_tournaments_tournaments_fk_01 (table: online_tournaments)
ALTER TABLE online_tournaments ADD CONSTRAINT online_tournaments_tournaments_fk_01
    FOREIGN KEY (tournament_id)
    REFERENCES tournaments (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: phase_groups_bracket_phases_fk_01 (table: phase_groups)
ALTER TABLE phase_groups ADD CONSTRAINT phase_groups_bracket_phases_fk_01
    FOREIGN KEY (bracket_phase_name, tournament_id, event_name)
    REFERENCES bracket_phases (name, tournament_id, event_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: phase_groups_waves_fk_01 (table: phase_groups)
ALTER TABLE phase_groups ADD CONSTRAINT phase_groups_waves_fk_01
    FOREIGN KEY (wave_identifier, tournament_id)
    REFERENCES waves (identifier, tournaments_id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: seeds_entrants_fk_01 (table: seeds)
ALTER TABLE seeds ADD CONSTRAINT seeds_entrants_fk_01
    FOREIGN KEY (tournament_id, event_name, entrant_user_email)
    REFERENCES entrants (tournament_id, event_name, user_email)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: seeds_events_fk_01 (table: seeds)
ALTER TABLE seeds ADD CONSTRAINT seeds_events_fk_01
    FOREIGN KEY (tournament_id, event_name)
    REFERENCES events (tournament_id, name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: seeds_teams_fk_01 (table: seeds)
ALTER TABLE seeds ADD CONSTRAINT seeds_teams_fk_01
    FOREIGN KEY (team_name, tournament_id, event_name)
    REFERENCES teams (name, tournament_id, event_name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: teams_events_fk_01 (table: teams)
ALTER TABLE teams ADD CONSTRAINT teams_events_fk_01
    FOREIGN KEY (tournament_id, event_name)
    REFERENCES events (tournament_id, name)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: tournament_contacts_contacts_fk_01 (table: tournament_contacts)
ALTER TABLE tournament_contacts ADD CONSTRAINT tournament_contacts_contacts_fk_01
    FOREIGN KEY (contact_id)
    REFERENCES contacts (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: tournament_contacts_tournaments_fk_01 (table: tournament_contacts)
ALTER TABLE tournament_contacts ADD CONSTRAINT tournament_contacts_tournaments_fk_01
    FOREIGN KEY (tournament_id)
    REFERENCES tournaments (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: waves_tournaments_fk_01 (table: waves)
ALTER TABLE waves ADD CONSTRAINT waves_tournaments_fk_01
    FOREIGN KEY (tournaments_id)
    REFERENCES tournaments (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- End of file.

