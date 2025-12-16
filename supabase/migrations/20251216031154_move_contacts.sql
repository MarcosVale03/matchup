revoke delete on table "public"."contacts" from "anon";

revoke insert on table "public"."contacts" from "anon";

revoke references on table "public"."contacts" from "anon";

revoke select on table "public"."contacts" from "anon";

revoke trigger on table "public"."contacts" from "anon";

revoke truncate on table "public"."contacts" from "anon";

revoke update on table "public"."contacts" from "anon";

revoke delete on table "public"."contacts" from "authenticated";

revoke insert on table "public"."contacts" from "authenticated";

revoke references on table "public"."contacts" from "authenticated";

revoke select on table "public"."contacts" from "authenticated";

revoke trigger on table "public"."contacts" from "authenticated";

revoke truncate on table "public"."contacts" from "authenticated";

revoke update on table "public"."contacts" from "authenticated";

revoke delete on table "public"."contacts" from "service_role";

revoke insert on table "public"."contacts" from "service_role";

revoke references on table "public"."contacts" from "service_role";

revoke select on table "public"."contacts" from "service_role";

revoke trigger on table "public"."contacts" from "service_role";

revoke truncate on table "public"."contacts" from "service_role";

revoke update on table "public"."contacts" from "service_role";

revoke delete on table "public"."discord_contacts" from "anon";

revoke insert on table "public"."discord_contacts" from "anon";

revoke references on table "public"."discord_contacts" from "anon";

revoke select on table "public"."discord_contacts" from "anon";

revoke trigger on table "public"."discord_contacts" from "anon";

revoke truncate on table "public"."discord_contacts" from "anon";

revoke update on table "public"."discord_contacts" from "anon";

revoke delete on table "public"."discord_contacts" from "authenticated";

revoke insert on table "public"."discord_contacts" from "authenticated";

revoke references on table "public"."discord_contacts" from "authenticated";

revoke select on table "public"."discord_contacts" from "authenticated";

revoke trigger on table "public"."discord_contacts" from "authenticated";

revoke truncate on table "public"."discord_contacts" from "authenticated";

revoke update on table "public"."discord_contacts" from "authenticated";

revoke delete on table "public"."discord_contacts" from "service_role";

revoke insert on table "public"."discord_contacts" from "service_role";

revoke references on table "public"."discord_contacts" from "service_role";

revoke select on table "public"."discord_contacts" from "service_role";

revoke trigger on table "public"."discord_contacts" from "service_role";

revoke truncate on table "public"."discord_contacts" from "service_role";

revoke update on table "public"."discord_contacts" from "service_role";

revoke delete on table "public"."email_contacts" from "anon";

revoke insert on table "public"."email_contacts" from "anon";

revoke references on table "public"."email_contacts" from "anon";

revoke select on table "public"."email_contacts" from "anon";

revoke trigger on table "public"."email_contacts" from "anon";

revoke truncate on table "public"."email_contacts" from "anon";

revoke update on table "public"."email_contacts" from "anon";

revoke delete on table "public"."email_contacts" from "authenticated";

revoke insert on table "public"."email_contacts" from "authenticated";

revoke references on table "public"."email_contacts" from "authenticated";

revoke select on table "public"."email_contacts" from "authenticated";

revoke trigger on table "public"."email_contacts" from "authenticated";

revoke truncate on table "public"."email_contacts" from "authenticated";

revoke update on table "public"."email_contacts" from "authenticated";

revoke delete on table "public"."email_contacts" from "service_role";

revoke insert on table "public"."email_contacts" from "service_role";

revoke references on table "public"."email_contacts" from "service_role";

revoke select on table "public"."email_contacts" from "service_role";

revoke trigger on table "public"."email_contacts" from "service_role";

revoke truncate on table "public"."email_contacts" from "service_role";

revoke update on table "public"."email_contacts" from "service_role";

revoke delete on table "public"."tournament_contacts" from "anon";

revoke insert on table "public"."tournament_contacts" from "anon";

revoke references on table "public"."tournament_contacts" from "anon";

revoke select on table "public"."tournament_contacts" from "anon";

revoke trigger on table "public"."tournament_contacts" from "anon";

revoke truncate on table "public"."tournament_contacts" from "anon";

revoke update on table "public"."tournament_contacts" from "anon";

revoke delete on table "public"."tournament_contacts" from "authenticated";

revoke insert on table "public"."tournament_contacts" from "authenticated";

revoke references on table "public"."tournament_contacts" from "authenticated";

revoke select on table "public"."tournament_contacts" from "authenticated";

revoke trigger on table "public"."tournament_contacts" from "authenticated";

revoke truncate on table "public"."tournament_contacts" from "authenticated";

revoke update on table "public"."tournament_contacts" from "authenticated";

revoke delete on table "public"."tournament_contacts" from "service_role";

revoke insert on table "public"."tournament_contacts" from "service_role";

revoke references on table "public"."tournament_contacts" from "service_role";

revoke select on table "public"."tournament_contacts" from "service_role";

revoke trigger on table "public"."tournament_contacts" from "service_role";

revoke truncate on table "public"."tournament_contacts" from "service_role";

revoke update on table "public"."tournament_contacts" from "service_role";

alter table "public"."discord_contacts" drop constraint "discord_contact_contacts_fk_01";

alter table "public"."discord_contacts" drop constraint "discord_contact_uk_01";

alter table "public"."discord_contacts" drop constraint "discord_contacts_invite_code_len_check";

alter table "public"."email_contacts" drop constraint "email_contacts_contacts_fk_01";

alter table "public"."email_contacts" drop constraint "email_contacts_uk_01";

alter table "public"."tournament_contacts" drop constraint "tournament_contacts_contacts_fk_01";

alter table "public"."tournament_contacts" drop constraint "tournament_contacts_tournaments_fk_01";

alter table "public"."contacts" drop constraint "contacts_pk";

alter table "public"."discord_contacts" drop constraint "discord_contact_pk";

alter table "public"."email_contacts" drop constraint "email_contacts_pk";

alter table "public"."tournament_contacts" drop constraint "tournament_contacts_pk";

drop index if exists "public"."contacts_pk";

drop index if exists "public"."discord_contact_pk";

drop index if exists "public"."discord_contact_uk_01";

drop index if exists "public"."email_contacts_pk";

drop index if exists "public"."email_contacts_uk_01";

drop index if exists "public"."tournament_contacts_pk";

drop table "public"."contacts";

drop table "public"."discord_contacts";

drop table "public"."email_contacts";

drop table "public"."tournament_contacts";

alter table "public"."tournaments" add column "discord_invite" varchar(8);

alter table "public"."tournaments" add column "email_contact" varchar(254);

alter table "public"."tournaments" add CONSTRAINT "tournaments_one_of_two_contacts_check" CHECK (email_contact is not null or discord_invite is not null);

drop sequence if exists "public"."contacts_id_seq";