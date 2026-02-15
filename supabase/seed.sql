SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict bLcBjolVZQrtNP1B0wTcFMJQlOGC8wvrcwYNUrmSORn75FV1pYat7d9e5AfXvD0

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

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('e09a1184-4bc7-4322-a735-a0658b6b2a08', '320933e4-64a0-4d9c-a853-77f9be197314', 'e52512d2-c53a-4b36-9fe6-697e05b8ebd4', 's256', 'zZh5X7XZ2O-kZUYe-Nxc8JQM18s-9F34Dgqq34C_2wU', 'email', '', '', '2025-12-13 23:36:16.38441+00', '2025-12-13 23:37:15.580451+00', 'email/signup', '2025-12-13 23:37:15.580407+00'),
	('e586931e-ef1d-4f30-bef0-8fd2f8bde21b', 'b8d33478-4e3c-4f89-a507-95eebf856dbc', 'd2a42be2-cdb3-4a3e-bb46-09aecc217df1', 's256', 'iiI4vRWRZtkpil9vaHBvKdXBZRG3achahLSKm2D6MdA', 'email', '', '', '2025-12-14 00:47:00.955718+00', '2025-12-14 00:47:11.434316+00', 'email/signup', '2025-12-14 00:47:11.434276+00'),
	('181426c7-9978-492d-a7c5-ccec2050c291', '840ff93a-6571-4e8d-aa6c-b4361b9518c2', '8fc7effe-c012-41b8-bd30-d9c9e4766a61', 's256', 'uqVzt4HAdL8PK3uspbV4nAUjdYXIt9dShSTR_eJiERM', 'email', '', '', '2025-12-14 21:27:23.134734+00', '2025-12-14 21:27:41.08522+00', 'email/signup', '2025-12-14 21:27:41.085168+00'),
	('75082155-fb4c-4e59-8600-794622d67a59', '9cbb596a-a948-41b2-8ee9-be11a1d2e577', '99f0c122-cbae-49ae-b791-050ef9f0e401', 's256', 'QT53aqd5id5foTxS-p8WBEVhA-PqgvkBmefXWd8S4IQ', 'email', '', '', '2025-12-14 21:30:11.578697+00', '2025-12-14 21:30:30.815914+00', 'email/signup', '2025-12-14 21:30:30.815868+00'),
	('b32fa9cf-4a97-48ae-9824-056a481ab742', '55e8f8c9-39d8-4919-aa46-ce3f7545278c', '0d765a06-c8f3-42d1-aa54-aa80f315e9ff', 's256', 'uclvIfD-jiKw-3JCvJ__ohqcETTPkosJy0uhpdFpYYo', 'email', '', '', '2025-12-14 21:45:19.983993+00', '2025-12-14 21:45:34.088448+00', 'email/signup', '2025-12-14 21:45:34.088397+00'),
	('cd3e3c72-88d6-4e54-b72a-4abe4268dcf8', '523746a9-46fe-4c14-9e0e-f15371dc50ee', '1ebb7780-ef95-4fe6-976c-a26eaa8c1dd6', 's256', 'JCpbiuRYUFvMX2Z-UeqEVFJ_k_rvoNlZgp1aWLOzaIs', 'email', '', '', '2025-12-15 03:39:04.278815+00', '2025-12-15 03:39:10.961704+00', 'email/signup', '2025-12-15 03:39:10.961657+00'),
	('9d27efb1-8174-45da-a279-d9bd9aa0e75f', '41e7d4f0-b0fb-4f2d-9a49-e18026f4ed7b', 'a48ffbf8-1460-4165-8468-f19268ac8be1', 's256', 'si9jA8lbtlcYc4lFdCa0kCAyW9iQwg_yjT8iGGACHqc', 'email', '', '', '2025-12-15 03:59:41.945035+00', '2025-12-15 04:00:36.672896+00', 'email/signup', '2025-12-15 04:00:36.67223+00'),
	('7b523083-5391-41ba-8171-9e397d8b3535', '08ee6125-8422-4654-aec9-56be8edf08a8', '2d260106-501c-455a-8e46-521c6caadc78', 's256', 'KHAh6SeKHW0qJicWt-Qh-0hSvhwcRz5zTmOu2EQF5H8', 'email', '', '', '2025-12-15 23:07:47.77435+00', '2025-12-15 23:08:07.370063+00', 'email/signup', '2025-12-15 23:08:07.370026+00'),
	('2a9d58e2-883b-4e81-b753-0f190a813861', '6b296a96-8867-4aa0-a674-8a7c2be28eaa', '9833a512-e35a-45ca-9c23-eb0b275585ca', 's256', 'beSxvJiCwrXJVGZVQGU4ui9Lj9xjUkjY4LnzKk5BDp8', 'email', '', '', '2025-12-16 06:39:14.522535+00', '2025-12-16 06:39:21.15362+00', 'email/signup', '2025-12-16 06:39:21.15358+00');


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
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendees; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: bracket_types; Type: TABLE DATA; Schema: public; Owner: postgres
--



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
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 11, true);


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

SELECT pg_catalog.setval('"public"."tournaments_id_seq1"', 3, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict bLcBjolVZQrtNP1B0wTcFMJQlOGC8wvrcwYNUrmSORn75FV1pYat7d9e5AfXvD0

RESET ALL;
