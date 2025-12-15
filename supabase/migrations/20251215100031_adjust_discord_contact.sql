revoke delete on table "public"."discord_contact" from "anon";

revoke insert on table "public"."discord_contact" from "anon";

revoke references on table "public"."discord_contact" from "anon";

revoke select on table "public"."discord_contact" from "anon";

revoke trigger on table "public"."discord_contact" from "anon";

revoke truncate on table "public"."discord_contact" from "anon";

revoke update on table "public"."discord_contact" from "anon";

revoke delete on table "public"."discord_contact" from "authenticated";

revoke insert on table "public"."discord_contact" from "authenticated";

revoke references on table "public"."discord_contact" from "authenticated";

revoke select on table "public"."discord_contact" from "authenticated";

revoke trigger on table "public"."discord_contact" from "authenticated";

revoke truncate on table "public"."discord_contact" from "authenticated";

revoke update on table "public"."discord_contact" from "authenticated";

revoke delete on table "public"."discord_contact" from "service_role";

revoke insert on table "public"."discord_contact" from "service_role";

revoke references on table "public"."discord_contact" from "service_role";

revoke select on table "public"."discord_contact" from "service_role";

revoke trigger on table "public"."discord_contact" from "service_role";

revoke truncate on table "public"."discord_contact" from "service_role";

revoke update on table "public"."discord_contact" from "service_role";

alter table "public"."discord_contact" drop constraint "discord_contact_contacts_fk_01";

alter table "public"."discord_contact" drop constraint "discord_contact_uk_01";

alter table "public"."discord_contact" drop constraint "discord_contact_pk";

drop table "public"."discord_contact";


  create table "public"."discord_contacts" (
    "contact_id" bigint not null,
    "invite_code" character varying(8) not null
      );


alter table "public"."discord_contacts" enable row level security;

alter table "public"."discord_contacts" add constraint "discord_contact_pk" PRIMARY KEY (contact_id);

alter table "public"."discord_contacts" add constraint "discord_contact_contacts_fk_01" FOREIGN KEY (contact_id) REFERENCES public.contacts(id) not deferrable initially immediate;

alter table "public"."discord_contacts" add constraint "discord_contact_uk_01" UNIQUE (invite_code);

grant delete on table "public"."discord_contacts" to "anon";

grant insert on table "public"."discord_contacts" to "anon";

grant references on table "public"."discord_contacts" to "anon";

grant select on table "public"."discord_contacts" to "anon";

grant trigger on table "public"."discord_contacts" to "anon";

grant truncate on table "public"."discord_contacts" to "anon";

grant update on table "public"."discord_contacts" to "anon";

grant delete on table "public"."discord_contacts" to "authenticated";

grant insert on table "public"."discord_contacts" to "authenticated";

grant references on table "public"."discord_contacts" to "authenticated";

grant select on table "public"."discord_contacts" to "authenticated";

grant trigger on table "public"."discord_contacts" to "authenticated";

grant truncate on table "public"."discord_contacts" to "authenticated";

grant update on table "public"."discord_contacts" to "authenticated";

grant delete on table "public"."discord_contacts" to "service_role";

grant insert on table "public"."discord_contacts" to "service_role";

grant references on table "public"."discord_contacts" to "service_role";

grant select on table "public"."discord_contacts" to "service_role";

grant trigger on table "public"."discord_contacts" to "service_role";

grant truncate on table "public"."discord_contacts" to "service_role";

grant update on table "public"."discord_contacts" to "service_role";