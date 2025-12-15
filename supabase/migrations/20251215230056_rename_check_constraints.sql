ALTER TABLE "public"."tournaments" RENAME CONSTRAINT "tournaments_check" TO "tournaments_start_end_time_check";

ALTER TABLE "public"."tournaments" RENAME CONSTRAINT "tournaments_name_check" TO "tournaments_name_min_len_check";

ALTER TABLE "public"."tournaments" RENAME CONSTRAINT "tournaments_slug_check" TO "tournaments_slug_min_len_check";

ALTER TABLE "public"."locations" RENAME CONSTRAINT "locations_address_check" TO "locations_address_min_len_check";

ALTER TABLE "public"."discord_contacts" ADD CONSTRAINT "discord_contacts_invite_code_len_check" CHECK (length(invite_code)=8)