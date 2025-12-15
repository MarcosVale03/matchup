ALTER TABLE "public"."locations" ADD CONSTRAINT locations_uk_03 UNIQUE (latitude, longitude) NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "public"."locations" RENAME COLUMN "mapsplaceid" TO "maps_place_id";