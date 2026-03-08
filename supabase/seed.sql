SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict FdfoVaG7hstTuiosmHNTW6tuC6C94YMG1bPESQty9zQgS37yfg00oxPxRYFhzaI

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: permission_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendees; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bracket_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bracket_types" ("name") VALUES
    ('Single Elimination'),
    ('Double Elimination'),
    ('Round Robin');

--
-- Data for Name: gaming_platforms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."gaming_platforms" ("name") VALUES
	('PC'),
	('PS5'),
	('Switch');


--
-- Data for Name: video_games; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."video_games" ("name") VALUES
	('Street Fighter 6'),
	('Tekken 8');


--
-- Data for Name: event_video_games; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."event_video_games" ("video_game_name", "gaming_platform_name") VALUES
	('Street Fighter 6', 'PC'),
	('Street Fighter 6', 'PS5'),
	('Street Fighter 6', 'Switch'),
	('Tekken 8', 'PC'),
	('Tekken 8', 'PS5');


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bracket_phases; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: entrants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forum_thread; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: forum_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: seeds; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: match_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: waves; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: phase_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: offline_events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: offline_tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 49, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."locations_id_seq"', 1, false);


--
-- Name: locations_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."locations_id_seq1"', 1, false);


--
-- Name: tournaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tournaments_id_seq"', 1, false);


--
-- Name: tournaments_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tournaments_id_seq1"', 21, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict FdfoVaG7hstTuiosmHNTW6tuC6C94YMG1bPESQty9zQgS37yfg00oxPxRYFhzaI

RESET ALL;
