alter table public.matches drop column "isComplete";

alter table public.matches add column "is_complete" boolean default false;

drop policy "seeds_insert" on "public"."seeds";

drop policy "seeds_update" on "public"."seeds";


CREATE OR REPLACE FUNCTION public.report_scores(tid bigint, eid smallint, pgid varchar(8), mid int, scores smallint[], completed boolean)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path to ''
AS $function$
DECLARE
       b_type text;
       snum smallint;
       m public.matches%ROWTYPE;
       wseed int;
       lseed int;
       userid uuid;
BEGIN
    SELECT bracket_type_name
    INTO b_type
    FROM public.phase_groups INNER JOIN public.bracket_phases ON (phase_groups.tournament_id = bracket_phases.tournament_id AND phase_groups.event_id = bracket_phases.event_id AND phase_groups.bracket_phase_id = bracket_phases.id)
    WHERE phase_groups.tournament_id = tid AND phase_groups.event_id = eid AND phase_groups.identifier = pgid;

    IF b_type = 'Single Elimination' THEN
       FOR snum IN (
        SELECT slot_num
        FROM public.match_slots
        WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND match_id = mid
        ORDER BY slot_num
       ) LOOP
        UPDATE public.match_slots
        SET score = scores[snum]
        WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND match_id = mid AND slot_num = snum;
       END LOOP;

       UPDATE public.matches
       SET is_complete = completed
       WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND id = mid;

        IF completed = true THEN
           SELECT *
           INTO m
           FROM public.matches
           WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND id = mid;

            SELECT seed_num
            INTO wseed
            FROM public.match_slots
            WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND match_id = mid
            ORDER BY score desc
            LIMIT 1;

            SELECT seed_num
            INTO lseed
            FROM public.match_slots
            WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND match_id = mid
            ORDER BY score asc
            LIMIT 1;

            IF m.w_advance_match_id IS NULL OR m.w_advance_slot_num IS NULL THEN
                SELECT entrant_user_id
                INTO userid
                FROM public.seeds
                WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND seed_num = wseed;

                UPDATE public.entrants
                SET placement = 1
                WHERE tournament_id = tid AND event_id = eid AND user_id = userid;
            ELSE
                UPDATE public.match_slots
                SET seed_num = wseed
                WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND match_id = m.w_advance_match_id AND slot_num = m.w_advance_slot_num;
            END IF;

            SELECT entrant_user_id
            INTO userid
            FROM public.seeds
            WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgid AND seed_num = lseed;

            UPDATE public.entrants
            SET placement = 2^(m.round_num - 1) + 1
            WHERE tournament_id = tid AND event_id = eid AND user_id = userid;

        END IF;
    END IF;
END;$function$
;


  create policy "entrants_update"
  on "public"."entrants"
  as permissive
  for update
                   to authenticated
                   using (public.has_permission_level(tournament_id, auth.uid(), 4));



create policy "match_slots_update"
  on "public"."match_slots"
  as permissive
  for update
                 to authenticated
                 using (public.has_permission_level(tournament_id, auth.uid(), 4));



create policy "matches_update"
  on "public"."matches"
  as permissive
  for update
                 to authenticated
                 using (public.has_permission_level(tournament_id, auth.uid(), 4));



create policy "seeds_insert"
  on "public"."seeds"
  as permissive
  for insert
  to authenticated
with check (((tournament_id IN ( SELECT tournaments.id
   FROM public.tournaments
  WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));



  create policy "seeds_update"
  on "public"."seeds"
  as permissive
  for update
                          to authenticated
                          using (((tournament_id IN ( SELECT tournaments.id
                          FROM public.tournaments
                          WHERE (tournaments.is_public = true))) OR public.has_permission_level(tournament_id, auth.uid(), 4)));