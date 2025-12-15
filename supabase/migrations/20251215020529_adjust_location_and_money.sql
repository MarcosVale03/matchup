alter table "public"."locations" drop column "coordinates";

alter table "public"."locations" add column "latitude" double precision not null;

alter table "public"."locations" add column "longitude" double precision not null;

alter table "public"."events" alter column "price" set data type numeric(12, 2) using "price"::numeric(12, 2);
