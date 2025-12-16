ALTER TABLE "public"."gaming_platforms" DROP CONSTRAINT "gaming_platforms_name_check";

ALTER TABLE "public"."gaming_platforms" ADD CONSTRAINT "gaming_platforms_name_min_len_check" CHECK (length(name) >= 2);

ALTER TABLE "public"."video_games" RENAME CONSTRAINT "video_games_name_check" TO "video_games_name_min_len_check";

ALTER TABLE "public"."events" RENAME CONSTRAINT "events_check" TO "events_start_end_time_check";

ALTER TABLE "public"."events" RENAME CONSTRAINT "events_name_check" TO "events_name_min_len_check";