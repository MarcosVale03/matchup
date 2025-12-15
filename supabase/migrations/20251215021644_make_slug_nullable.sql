alter table "public"."events" drop column "description";

alter table "public"."tournaments" alter column "slug" drop not null;

alter table "public"."tournaments" alter column "home_page" set default ''::text;
