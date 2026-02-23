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

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") VALUES
	('e09a1184-4bc7-4322-a735-a0658b6b2a08', '320933e4-64a0-4d9c-a853-77f9be197314', 'e52512d2-c53a-4b36-9fe6-697e05b8ebd4', 's256', 'zZh5X7XZ2O-kZUYe-Nxc8JQM18s-9F34Dgqq34C_2wU', 'email', '', '', '2025-12-13 23:36:16.38441+00', '2025-12-13 23:37:15.580451+00', 'email/signup', '2025-12-13 23:37:15.580407+00', NULL, NULL, NULL, NULL, false),
	('e586931e-ef1d-4f30-bef0-8fd2f8bde21b', 'b8d33478-4e3c-4f89-a507-95eebf856dbc', 'd2a42be2-cdb3-4a3e-bb46-09aecc217df1', 's256', 'iiI4vRWRZtkpil9vaHBvKdXBZRG3achahLSKm2D6MdA', 'email', '', '', '2025-12-14 00:47:00.955718+00', '2025-12-14 00:47:11.434316+00', 'email/signup', '2025-12-14 00:47:11.434276+00', NULL, NULL, NULL, NULL, false),
	('181426c7-9978-492d-a7c5-ccec2050c291', '840ff93a-6571-4e8d-aa6c-b4361b9518c2', '8fc7effe-c012-41b8-bd30-d9c9e4766a61', 's256', 'uqVzt4HAdL8PK3uspbV4nAUjdYXIt9dShSTR_eJiERM', 'email', '', '', '2025-12-14 21:27:23.134734+00', '2025-12-14 21:27:41.08522+00', 'email/signup', '2025-12-14 21:27:41.085168+00', NULL, NULL, NULL, NULL, false),
	('75082155-fb4c-4e59-8600-794622d67a59', '9cbb596a-a948-41b2-8ee9-be11a1d2e577', '99f0c122-cbae-49ae-b791-050ef9f0e401', 's256', 'QT53aqd5id5foTxS-p8WBEVhA-PqgvkBmefXWd8S4IQ', 'email', '', '', '2025-12-14 21:30:11.578697+00', '2025-12-14 21:30:30.815914+00', 'email/signup', '2025-12-14 21:30:30.815868+00', NULL, NULL, NULL, NULL, false),
	('b32fa9cf-4a97-48ae-9824-056a481ab742', '55e8f8c9-39d8-4919-aa46-ce3f7545278c', '0d765a06-c8f3-42d1-aa54-aa80f315e9ff', 's256', 'uclvIfD-jiKw-3JCvJ__ohqcETTPkosJy0uhpdFpYYo', 'email', '', '', '2025-12-14 21:45:19.983993+00', '2025-12-14 21:45:34.088448+00', 'email/signup', '2025-12-14 21:45:34.088397+00', NULL, NULL, NULL, NULL, false),
	('cd3e3c72-88d6-4e54-b72a-4abe4268dcf8', '523746a9-46fe-4c14-9e0e-f15371dc50ee', '1ebb7780-ef95-4fe6-976c-a26eaa8c1dd6', 's256', 'JCpbiuRYUFvMX2Z-UeqEVFJ_k_rvoNlZgp1aWLOzaIs', 'email', '', '', '2025-12-15 03:39:04.278815+00', '2025-12-15 03:39:10.961704+00', 'email/signup', '2025-12-15 03:39:10.961657+00', NULL, NULL, NULL, NULL, false),
	('9d27efb1-8174-45da-a279-d9bd9aa0e75f', '41e7d4f0-b0fb-4f2d-9a49-e18026f4ed7b', 'a48ffbf8-1460-4165-8468-f19268ac8be1', 's256', 'si9jA8lbtlcYc4lFdCa0kCAyW9iQwg_yjT8iGGACHqc', 'email', '', '', '2025-12-15 03:59:41.945035+00', '2025-12-15 04:00:36.672896+00', 'email/signup', '2025-12-15 04:00:36.67223+00', NULL, NULL, NULL, NULL, false),
	('7b523083-5391-41ba-8171-9e397d8b3535', '08ee6125-8422-4654-aec9-56be8edf08a8', '2d260106-501c-455a-8e46-521c6caadc78', 's256', 'KHAh6SeKHW0qJicWt-Qh-0hSvhwcRz5zTmOu2EQF5H8', 'email', '', '', '2025-12-15 23:07:47.77435+00', '2025-12-15 23:08:07.370063+00', 'email/signup', '2025-12-15 23:08:07.370026+00', NULL, NULL, NULL, NULL, false),
	('2a9d58e2-883b-4e81-b753-0f190a813861', '6b296a96-8867-4aa0-a674-8a7c2be28eaa', '9833a512-e35a-45ca-9c23-eb0b275585ca', 's256', 'beSxvJiCwrXJVGZVQGU4ui9Lj9xjUkjY4LnzKk5BDp8', 'email', '', '', '2025-12-16 06:39:14.522535+00', '2025-12-16 06:39:21.15362+00', 'email/signup', '2025-12-16 06:39:21.15358+00', NULL, NULL, NULL, NULL, false),
	('d42851df-bea8-4377-b4e7-67d6728c60d4', '47a72726-98c3-4d2e-a420-a0f744a68096', '142a4648-c6dc-4ad2-8b57-4bcc6fff5f67', 's256', 'GjWFrQyua6OiFuqkqUqVsbXDf01u05K9x4zMye427qM', 'email', '', '', '2025-12-16 23:01:23.679615+00', '2025-12-16 23:01:43.091998+00', 'email/signup', '2025-12-16 23:01:43.091949+00', NULL, NULL, NULL, NULL, false),
	('6ccad178-0935-4a40-9d63-438a93e950b6', 'ecbf824d-15c3-46f5-ac3a-6c48a0f34a97', '8fa0f454-736e-4890-b4de-5de211216583', 's256', '40j4F7h_YxzBPIvHI7iFUHXeAkngoJso0L1hRQNLr7o', 'email', '', '', '2025-12-16 23:36:51.73168+00', '2025-12-16 23:38:49.154741+00', 'email/signup', '2025-12-16 23:38:49.154698+00', NULL, NULL, NULL, NULL, false),
	('176f833f-cdc9-416f-8f6d-d3eddd59553f', '5961e692-0d58-4385-b3b7-0a1b1504b985', 'f2b647d8-4d84-41a6-892f-7a906c1b76a0', 's256', 'tM4j-Rgvmz5qI7d4gxds005bXtcHSkGlosaNayhDggw', 'email', '', '', '2026-01-31 23:28:30.112946+00', '2026-01-31 23:28:44.510367+00', 'email/signup', '2026-01-31 23:28:44.510318+00', NULL, NULL, NULL, NULL, false),
	('73cbeffe-2f19-4e56-92d7-ccd68a245be0', '3a014ee2-90b8-4575-9c0b-2560b6e01015', '84710623-88e3-41c0-b7af-50f089c4e1a8', 's256', '572Fnwp6DYQQwRYH83edUMl1mg4fmbMX0KDeyeW1omM', 'email', '', '', '2026-02-01 00:47:05.629313+00', '2026-02-01 00:47:05.629313+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('0565ebbb-726f-40c8-8734-81761583c942', '928ee506-3145-4cb2-b0bc-7053f5bd05aa', '48565fb0-9d32-498d-91e2-439ff7e18e46', 's256', 'nJadrZ-zYpKcUT3rd_GMimEvTOChS-Y04_5jVezGedk', 'email', '', '', '2026-02-01 00:48:02.486181+00', '2026-02-01 00:48:09.784543+00', 'email/signup', '2026-02-01 00:48:09.784501+00', NULL, NULL, NULL, NULL, false),
	('85ce1ceb-d326-4eba-b840-87dd410ba0ba', 'eb066e7b-023e-41cf-b2f2-7210035a315b', 'ff4da107-e5d0-4d49-b5f5-a696b3c478d0', 's256', 'yNjK_uPrH1ovhTuNs__-sla6qa8-9oNVYTpom6WTHok', 'email', '', '', '2026-02-01 03:17:59.793889+00', '2026-02-01 03:17:59.793889+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('2d9eb87e-25f3-45b8-8721-aece7f8acce2', 'ffa1a025-0bcc-44e1-aee4-da93f3280f26', 'dae801b1-e545-49a6-8e07-9a52b18832d4', 's256', 's7Gb-yizsIbzeiWtTmH_JX2n0vDByNsfgltTKkvBnXE', 'email', '', '', '2026-02-01 03:20:51.467348+00', '2026-02-01 03:20:51.467348+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('9e262761-40a4-44f4-8f07-50b76d0576b4', '9145642b-8881-447b-8148-6c1c20649ad1', '40ae056f-3483-4d4d-b728-0abc9ccb4098', 's256', 'O4yhUXbjXWl8ifbZjHRfpiETUacGC601NXhq1CVPWzA', 'email', '', '', '2026-02-01 03:23:27.204251+00', '2026-02-01 03:23:33.125731+00', 'email/signup', '2026-02-01 03:23:33.12569+00', NULL, NULL, NULL, NULL, false),
	('6b5b7717-0dc2-487e-8486-1916651c9558', 'dccee586-6eb3-45f0-b63c-94a5f359c25e', '4523d16e-d8f8-4755-bef2-caa507f25d7b', 's256', 'iHAggnZaTE0ml4lbtI-OhgvC6KHab_Qqbzv-kQrxbEE', 'email', '', '', '2026-02-01 03:32:35.453725+00', '2026-02-01 03:32:48.223707+00', 'email/signup', '2026-02-01 03:32:48.223665+00', NULL, NULL, NULL, NULL, false),
	('b66a60dd-6001-4420-aa67-ff1d8bb5c894', '68aa7e3d-f80f-40ee-aff1-6b1e5a26e4c8', 'a6785e19-019c-4bb2-9522-cfd229740acc', 's256', 'ZgSy4chwoegcC2XREHFiTnRh7PtSv0XOgqJXjGTTm24', 'email', '', '', '2026-02-01 03:36:14.288965+00', '2026-02-01 03:36:20.25796+00', 'email/signup', '2026-02-01 03:36:20.25792+00', NULL, NULL, NULL, NULL, false),
	('2b44d696-3bed-44e8-ac54-3ded5fe3a377', '1f7aeb55-3fd5-476a-b3ca-a3f1f5325032', '5aa64403-9c25-4ef3-8350-c4abf97f8646', 's256', 'Jn1hvd8nqV3CnLWJ3Co9AKEVTwjVbEyinrcBfTLljfY', 'email', '', '', '2026-02-01 03:41:56.127766+00', '2026-02-01 03:42:01.508941+00', 'email/signup', '2026-02-01 03:42:01.508904+00', NULL, NULL, NULL, NULL, false),
	('ea944553-88aa-45a3-a6ca-c1f67d5b4190', '4f099e44-ce67-414d-8bf0-9bb4f01d6d3b', 'c0f5b641-224f-48b2-9eb0-6299b4d24153', 's256', 'PjOnpIa0A_4dy8eXllcY5TIbxwVH3ngetf-9HxtKC2A', 'email', '', '', '2026-02-01 03:52:05.826263+00', '2026-02-01 03:52:05.826263+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('39590077-df03-4071-93b9-3773f9527afe', '78348d65-de78-4020-81df-de1404b01f1c', '342116f9-2c0a-441f-b3d8-11af89c8f0cb', 's256', 'FJMA3yuH7kkeFyZCxEXGoZHu6YZDSjMgMf0f4oJS5Dk', 'email', '', '', '2026-02-01 03:53:36.325798+00', '2026-02-01 03:53:44.340876+00', 'email/signup', '2026-02-01 03:53:44.340835+00', NULL, NULL, NULL, NULL, false),
	('98684d6e-b2ce-4a44-9a63-1bd75e06f7f3', '272399c3-131b-40ac-a2f8-b0642b4c72c9', '96ad42f5-2504-49d2-bee4-82e5eb7bc792', 's256', 'kdm2Mn8glxe8pbMP9okb001EwhxQi7C7TmzrzXGiD-Y', 'email', '', '', '2026-02-03 04:22:03.376095+00', '2026-02-03 04:22:10.659515+00', 'email/signup', '2026-02-03 04:22:10.659472+00', NULL, NULL, NULL, NULL, false),
	('8eb021ea-26cb-4b98-858f-25d35a30025d', '9ad729b8-ce8f-419d-85ff-c36b30c1b412', 'd4a56d9c-7aec-449b-b882-4b83b5fa6201', 's256', 'xUu_VXovGjLTNzrjLnxObxGu-Rc2mffV-WL3C3dKYHM', 'email', '', '', '2026-02-03 04:24:34.669627+00', '2026-02-03 04:24:34.669627+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('578b285f-ff94-4ae0-b6bb-e9dd127f0fe0', 'c2b4701b-b5ec-4dae-84f4-2a875e02cf88', '6286699e-f6ac-4b5f-ba0a-ede48b2f8b81', 's256', '-VLmkznBS4zlUBPRzbixFzsiMxuxTVDHGdlYQMUUx2k', 'email', '', '', '2026-02-03 04:27:25.85219+00', '2026-02-03 04:27:25.85219+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('b7a471f7-a3bb-46e4-a3be-39b51f23e7ba', 'af8e3b10-e952-4e6d-ac9e-915be6c9faec', '43e2b4d7-d6bc-4149-bb34-18724285253a', 's256', 'mXa0C21ueGEB2JCyH4yR37-OO805369VJ0KK1dOhcLg', 'email', '', '', '2026-02-03 16:08:45.755839+00', '2026-02-03 16:08:45.755839+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('739814ba-2e15-4c04-bad6-c8dac098f69d', 'af8e3b10-e952-4e6d-ac9e-915be6c9faec', '96989ef8-b66d-4ae9-ac04-6a7a244d5807', 's256', 'UDO5ydDpVaPdK2LMykbxXswK33o8-SKKDI2QVpd7opI', 'email', '', '', '2026-02-03 16:10:20.246932+00', '2026-02-03 16:10:20.246932+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('870a4780-5770-4b9c-8986-95f82bcc93da', 'd84c2e05-83d0-4a70-9f31-4e9a2b3e35d3', '0ba5dd1c-9a1a-4284-bf4c-78689f2e349e', 's256', 'nfFJoV0RQ3teTbiPkLZ_g2sByo7tyUJpCZgcp2_KrJU', 'email', '', '', '2026-02-04 20:01:31.065017+00', '2026-02-04 20:01:31.065017+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('e0637fed-0075-40a3-918a-e1337e1ed3b6', '3c9c20e1-94b9-4ba1-90b1-572778166d60', 'e34920d0-ea19-4b1c-afe1-c263af5c3601', 's256', 'XFa884AktnIWzwI5BJzMJOiYCm3h625nEYGAh3GKohQ', 'email', '', '', '2026-02-05 05:01:21.289264+00', '2026-02-05 05:01:21.289264+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('3c6e3fa5-f34e-4627-b2d7-1f287413eb3c', '0459a27c-0db9-4d1d-ad94-79821548ab69', '32090d17-052e-4be0-9dfa-49ff8cd06aa5', 's256', 'PLRzZ2b5G9J4d4yqPK_-h5dS2LfBXu63Sxd4738rRqY', 'email', '', '', '2026-02-05 05:06:55.487077+00', '2026-02-05 05:06:55.487077+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('2f98a28b-1981-4752-bb15-e2e86b10c4fd', '2559603c-7e27-4837-94c3-c418b31fcdce', '5e3c2335-47f8-4ad4-9ef7-184cd8983ccd', 's256', 'tURqH-X9Q6Dd9vgyHaZP5AXaq4UVIKo1K0A33ktBn14', 'email', '', '', '2026-02-05 05:08:28.213953+00', '2026-02-05 05:08:28.213953+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('b16ed520-234f-44a4-9235-06fac8b2cd43', '8f52beb6-b6c2-40cb-adc7-7797aa2c7832', 'eb9012b0-b71b-457d-b011-f8da0c9bb3d4', 's256', 'IUJNmVq79XFQoHsy0xiDKs3LOjenYXWrOGsdRjHi24I', 'email', '', '', '2026-02-05 05:14:08.189435+00', '2026-02-05 05:14:08.189435+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('88f3815b-5541-4d3b-b263-edd1627ad3d1', 'd1f5caa8-81a9-4327-85fc-6eee91914845', '07157ad1-ce8e-4226-872d-6faba985668c', 's256', 'qBHLoZD-Hd1ppqHSv0NkjX3PRWdNEQ1gwvtNglshOx0', 'email', '', '', '2026-02-05 05:17:08.066305+00', '2026-02-05 05:17:08.066305+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('4a154c53-0536-44f4-aa30-302367900ebf', 'cd61eba7-76c1-44ae-84ea-210d8505aac0', '5f282ca2-aa03-4f74-8b6b-303fd76615fc', 's256', 'RgfXGeJ8Ia7E_izmXtM-zA-YZeg4cnPU09oKYokCpb4', 'email', '', '', '2026-02-11 20:24:05.48214+00', '2026-02-11 20:24:05.48214+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('b428da9e-d2ff-4826-82a1-808fa13ba760', 'f58865ff-64cc-41d3-9d04-f9481af7fadf', '9e00c83d-23fa-43c9-bb98-a2de960a4f9c', 's256', 'Iz1hH7RvyFxfXsoLrQNoVX7PwMXYJbmSIPDn6VLk8mY', 'email', '', '', '2026-02-11 20:28:45.448521+00', '2026-02-11 20:28:45.448521+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('bbcce795-f0ff-4953-8bce-38c27b3f18a5', '713febcd-79fb-4188-97ef-dc77a8bd5305', 'bd6b18ea-5ebf-42e4-8cf0-0740608e9d4e', 's256', 'skyEgKaZoz56aDEg435tlRwFbGiFJGs5TgAVlEvL7pM', 'email', '', '', '2026-02-11 20:36:54.438892+00', '2026-02-11 20:37:19.830702+00', 'email/signup', '2026-02-11 20:37:19.830654+00', NULL, NULL, NULL, NULL, false),
	('ebd6dbb6-1398-47f3-bec7-f613a30bfcff', 'cdb3c6db-4b23-4ea2-b341-3858e7c1c7aa', 'adcc28d0-a227-48d4-ac56-846039023981', 's256', 'TxFTpTQlE1AV3v4u0BaoS4r_otuz7vG7WOKYwra1Dqw', 'email', '', '', '2026-02-11 21:49:09.832403+00', '2026-02-11 21:49:16.811758+00', 'email/signup', '2026-02-11 21:49:16.811688+00', NULL, NULL, NULL, NULL, false),
	('4f296ee6-ff88-4519-891f-ba9f237083b8', 'be790582-8ce3-4782-a077-ade2b540858f', 'b0573d52-7545-4067-9b5f-1a0902c57142', 's256', 'ZH2zkymSpOxFZhmPcXZ1ASwZc8iAbZDJ9xvO2h1yodQ', 'email', '', '', '2026-02-11 22:39:42.25898+00', '2026-02-11 22:39:42.25898+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('c46cdad0-06c2-4dee-8d20-6c7e0fdaa54f', 'be790582-8ce3-4782-a077-ade2b540858f', 'a1f27627-305a-4be4-b614-4e2ef4e4c592', 's256', 'hGNFOSpFdhpb9X1RqS345IjV2EJzMikR4ywy5d4cTyk', 'email', '', '', '2026-02-11 22:57:03.973287+00', '2026-02-11 22:57:03.973287+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('93f0ecd1-c870-475a-8be1-99a2baddee6c', 'be790582-8ce3-4782-a077-ade2b540858f', '66308486-faa0-4515-a987-b236234f9607', 's256', 'h9YNYZf_yz42rds3zgpVLJxRcy8Twt8YLDkXtWrvrs4', 'email', '', '', '2026-02-12 01:21:59.789192+00', '2026-02-12 01:21:59.789192+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('418bcfb6-40d5-4f59-b149-83976999d940', '4b3b86cb-5dd2-4102-a440-0f923e0e11a5', '769d63aa-d620-4b52-820f-8ba4610f9d8b', 's256', 'yx4LuV4sUhN99P85knbblggQgODDiS2TIKsmrTRLQmg', 'email', '', '', '2026-02-12 01:25:08.25257+00', '2026-02-12 01:25:08.25257+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('6561b12e-e374-44d5-a4f8-91b9d92304ef', '2d8ecf02-8bf0-4b77-b962-367b6c54fb57', '4cd98152-0757-4e7f-82c7-2a9e46419dde', 's256', '8frOt-Isekwis1qTGFySub-QGnibTOJKA3nK5hGYTuA', 'email', '', '', '2026-02-12 01:29:44.199786+00', '2026-02-12 01:29:44.199786+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('f479888e-fa1c-47c5-ae6d-947b47981fc8', '41fe3b2d-b4dc-4232-baf8-691239bd37e9', '41d4de0d-2c6b-485f-848d-332e25e51353', 's256', 'cBPUqxUmcdijKeZXw8TslWLefF3rQxGRUhgK6-EZQTE', 'email', '', '', '2026-02-12 01:31:46.165053+00', '2026-02-12 01:31:46.165053+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('364a8bc6-19ad-4deb-a3b9-4f607a2b2fe5', '26129602-2643-454e-8cba-2d76943e54fa', '85d15644-a562-4ea4-aa1d-04fecb3944f1', 's256', 'tL07tyAaASf9gUgc92IaesRGSTRvjieKRqTnwzjIcYM', 'email', '', '', '2026-02-12 02:45:24.933943+00', '2026-02-12 02:45:35.591125+00', 'email/signup', '2026-02-12 02:45:35.591077+00', NULL, NULL, NULL, NULL, false),
	('ba9980af-4f3e-4a6d-843a-434069305730', '699fa38d-d187-4647-a82b-bd562c1fa982', '612cc1f7-48b8-4746-b947-c7484248dbb6', 's256', 'bZN6dmckROAn7jgiJiLzkCl8PYaNu3JC5P5eL2a-uNA', 'email', '', '', '2026-02-12 02:50:42.575896+00', '2026-02-12 02:50:57.761236+00', 'email/signup', '2026-02-12 02:50:57.761186+00', NULL, NULL, NULL, NULL, false),
	('e011ba63-231c-4a33-ac03-bdedf9f16e59', '58bed8aa-f2c9-45e0-a1c3-d232812f0169', '92b4289c-f953-42ce-bdd3-e1e2ef6aef98', 's256', 'ynAX83_OJMaWvlEr7BXejCJKxvHMqR7cXCKuGEvHBqg', 'email', '', '', '2026-02-15 05:07:40.596797+00', '2026-02-15 05:07:52.844448+00', 'email/signup', '2026-02-15 05:07:52.844398+00', NULL, NULL, NULL, NULL, false),
	('3bc03a2c-1c60-41b2-8bfb-ffc0c91c4ceb', '12e943ff-eb52-4da4-9b01-8ed0c1dc0397', '4f414905-6ea6-4c61-86f8-a115f2e59fea', 's256', 'giSEf3udcNOof-tPs4mVBXNMUW4lmJOitEZrYl-k09E', 'email', '', '', '2026-02-15 05:10:05.355986+00', '2026-02-15 05:10:13.201607+00', 'email/signup', '2026-02-15 05:10:13.201553+00', NULL, NULL, NULL, NULL, false),
	('0609af9d-ca96-40a0-b230-76399247baf9', '31107ede-48ba-4a8e-9a04-603fc9ba1ab0', '1717f6cc-10cd-4d3b-a4a5-9e993bff2c64', 's256', 'YUgirOjtP1proeWc18o6i_XFplaoXXuB6rfUREIrP4U', 'email', '', '', '2026-02-18 01:05:42.529775+00', '2026-02-18 01:06:15.128776+00', 'email/signup', '2026-02-18 01:06:15.128471+00', NULL, NULL, NULL, NULL, false),
	('532d33f2-dfc2-49de-a189-01fac919b8fa', 'f01dc2bb-b486-4702-baec-ad4f200d37ad', '8e67018e-7a8b-428d-9c50-ed546d58a92a', 's256', 'GQUbj-EWHYz0vMCYu7TlHsAqrtiJ0YvkC54HOo1rEvw', 'email', '', '', '2026-02-18 01:09:51.427593+00', '2026-02-18 01:09:59.413133+00', 'email/signup', '2026-02-18 01:09:59.413086+00', NULL, NULL, NULL, NULL, false),
	('a6cf3ccb-e706-4829-bf10-c07d7de378cc', 'a8f1361b-9a69-4101-8b63-72f256657716', 'd817d3a6-1dcd-41ed-b70a-a2c427fe1955', 's256', 'M-SSgcEbNEvR6j6pFvQHSwdC9mQ7qAo_JfZ6DpxxEQo', 'email', '', '', '2026-02-18 01:51:28.407285+00', '2026-02-18 01:51:55.016249+00', 'email/signup', '2026-02-18 01:51:55.015635+00', NULL, NULL, NULL, NULL, false),
	('22393e83-6e4b-4e4f-9721-1c5b94976ba1', '7ccb807c-7c3d-4fcc-bf5f-bdab6529a067', '0eb33299-f022-48d6-826c-2118cc3088c4', 's256', 'ucqhPtIlOJOXiG3YPUQeyEPx9FDLl9UL1yDXiP_aWy4', 'email', '', '', '2026-02-18 22:49:58.654894+00', '2026-02-18 22:49:58.654894+00', 'email/signup', NULL, NULL, NULL, NULL, NULL, false),
	('0409bf7a-4a6b-4f73-a04f-82b587664856', '7ccb807c-7c3d-4fcc-bf5f-bdab6529a067', 'f4bff616-6a4c-4276-bd47-b4a4b6fd4c60', 's256', 'WOTljI_iRTQmI5IvyulE1C5MzRJhfQR7KbicSmyQsA4', 'email', '', '', '2026-02-18 22:52:38.217602+00', '2026-02-18 22:54:09.953756+00', 'email/signup', '2026-02-18 22:54:09.953702+00', NULL, NULL, NULL, NULL, false),
	('95fcd77b-b0f5-49e7-8fb7-f08993eb602c', '6906a626-1c51-46ed-a410-353162ec1628', 'ed98aa67-fdcc-4a8d-985d-9b3a48d7606c', 's256', 'DevTXEbk3OgI51GgPM0cxmrGifmHl92Zlgia7x54Exw', 'email', '', '', '2026-02-18 23:19:52.077391+00', '2026-02-18 23:20:00.042041+00', 'email/signup', '2026-02-18 23:20:00.041972+00', NULL, NULL, NULL, NULL, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'ecbf824d-15c3-46f5-ac3a-6c48a0f34a97', 'authenticated', 'authenticated', 'geraldhill751@gmail.com', '$2a$10$3G.s383MCn1FBJvSgdTdke3MohnH0aRiu4USw9dR3fOv8KAnqTTKy', '2025-12-16 23:38:49.141315+00', NULL, '', '2025-12-16 23:36:51.754396+00', '', NULL, '', '', NULL, '2025-12-16 23:39:06.563009+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ecbf824d-15c3-46f5-ac3a-6c48a0f34a97", "email": "geraldhill751@gmail.com", "username": "gerald", "email_verified": true, "phone_verified": false}', NULL, '2025-12-16 23:36:51.662483+00', '2026-02-20 00:25:23.196323+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6906a626-1c51-46ed-a410-353162ec1628', 'authenticated', 'authenticated', 'marcosvale0310@gmail.com', '$2a$10$p2HwoEIPtDYAL05SiXAMVusR5y.C0RHtBFnnJcF6c7/JEf9VKkoAm', '2026-02-18 23:20:00.036298+00', NULL, '', '2026-02-18 23:19:52.079491+00', '', NULL, '', '', NULL, '2026-02-18 23:20:08.13568+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "6906a626-1c51-46ed-a410-353162ec1628", "email": "marcosvale0310@gmail.com", "prefix": "mv", "last_name": "Valencia", "first_name": "Marcos", "display_name": "MarcosVale", "email_verified": true, "phone_verified": false}', NULL, '2026-02-18 23:19:52.064721+00', '2026-02-20 01:20:11.919415+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('ecbf824d-15c3-46f5-ac3a-6c48a0f34a97', 'ecbf824d-15c3-46f5-ac3a-6c48a0f34a97', '{"sub": "ecbf824d-15c3-46f5-ac3a-6c48a0f34a97", "email": "geraldhill751@gmail.com", "username": "gerald", "email_verified": true, "phone_verified": false}', 'email', '2025-12-16 23:36:51.707975+00', '2025-12-16 23:36:51.708036+00', '2025-12-16 23:36:51.708036+00', 'd4d68560-394e-4837-b03b-7c02de169467'),
	('6906a626-1c51-46ed-a410-353162ec1628', '6906a626-1c51-46ed-a410-353162ec1628', '{"sub": "6906a626-1c51-46ed-a410-353162ec1628", "email": "marcosvale0310@gmail.com", "prefix": "mv", "last_name": "Valencia", "first_name": "Marcos", "display_name": "MarcosVale", "email_verified": true, "phone_verified": false}', 'email', '2026-02-18 23:19:52.07468+00', '2026-02-18 23:19:52.074747+00', '2026-02-18 23:19:52.074747+00', 'f56151bf-75f5-4b00-a29d-07248c580aff');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('7dc4d541-dc16-4817-bacd-3e79c794fee9', 'ecbf824d-15c3-46f5-ac3a-6c48a0f34a97', '2025-12-16 23:39:06.563113+00', '2026-02-20 00:25:23.208858+00', NULL, 'aal1', NULL, '2026-02-20 00:25:23.208754', 'node', '3.101.109.204', NULL, NULL, NULL, NULL, NULL),
	('003dfedc-d428-41ff-93a5-3fe6c8e5f568', '6906a626-1c51-46ed-a410-353162ec1628', '2026-02-18 23:20:08.135797+00', '2026-02-20 01:20:11.931186+00', NULL, 'aal1', NULL, '2026-02-20 01:20:11.931076', 'node', '54.193.116.63', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('7dc4d541-dc16-4817-bacd-3e79c794fee9', '2025-12-16 23:39:06.597757+00', '2025-12-16 23:39:06.597757+00', 'password', '49e2ba6c-68e4-479b-9a16-7a9891284ed3'),
	('003dfedc-d428-41ff-93a5-3fe6c8e5f568', '2026-02-18 23:20:08.140849+00', '2026-02-18 23:20:08.140849+00', 'password', '218c34ee-9dc2-41bf-b09d-b8cfef66c4e7');


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

INSERT INTO "public"."permission_levels" ("id", "name", "description") VALUES
	(0, 'Owner', 'Highest permission level. Usually the creator of the tournament.'),
	(1, 'Admin', 'Can access all pages related to a tournament.'),
	(2, 'Moderator', 'Can access all pages except Permissions, Publishing & Payments Setup.'),
	(3, 'Bracket Manager', 'Can access all pages within the Events & Reporting sections.'),
	(4, 'Reporter', 'Can access all pages within the Reporting section.');


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
