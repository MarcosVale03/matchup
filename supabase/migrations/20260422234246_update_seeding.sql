CREATE OR REPLACE FUNCTION public.update_seeding(tid bigint, eid smallint, pgids varchar(8)[], seed_users uuid[][])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path to ''
AS $function$
DECLARE
    i int = 1;
    seed int;
BEGIN
    WHILE i <= array_length(pgids, 1) LOOP
          FOR seed IN (
            SELECT seed_num
            FROM public.seeds
            WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgids[i]
            ORDER BY seed_num
          ) LOOP
            UPDATE public.seeds
            SET entrant_user_id = seed_users[i][seed]
            WHERE tournament_id = tid AND event_id = eid AND phase_group_identifier = pgids[i] AND seed_num = seed;
          END LOOP;

          i := i + 1;
    END LOOP;
END;$function$
;


CREATE OR REPLACE FUNCTION public.register_user_for_tournament(tid bigint, eids smallint[], uid uuid)
    RETURNS void
    LANGUAGE plpgsql
    SET search_path to ''
AS $$
DECLARE
e smallint;
    snum int;
    bphaseid smallint;
    pgroupid varchar(8);
    matchid varchar(8);
BEGIN
INSERT INTO public.attendees (tournament_id, user_id)
VALUES (tid, uid);

FOREACH e IN ARRAY eids
    LOOP
        INSERT INTO public.entrants (tournament_id, event_id, user_id)
        VALUES (tid, e, uid);

SELECT id
INTO bphaseid
FROM public.bracket_phases
WHERE tournament_id = tid AND event_id = e AND
    id NOT IN (
        SELECT COALESCE(next_phase_id, -1)
        FROM public.bracket_phases
        WHERE tournament_id = tid AND event_id = e
    );

SELECT c.identifier
INTO pgroupid
FROM (
         SELECT phase_groups.identifier AS identifier, COUNT(NULLIF(seeds.entrant_user_id::text, seeds.team_name::text)) as num_seeds
         FROM public.phase_groups LEFT OUTER JOIN public.seeds
                                                  ON (phase_groups.identifier = seeds.phase_group_identifier AND phase_groups.tournament_id = seeds.tournament_id AND phase_groups.event_id = seeds.event_id)
         WHERE phase_groups.tournament_id = tid AND phase_groups.event_id = e AND bracket_phase_id = bphaseid
         GROUP BY phase_groups.identifier
         ORDER BY num_seeds asc
     ) AS c
    LIMIT 1;

SELECT MIN(seed_num)
INTO snum
FROM public.seeds
WHERE tournament_id = tid and event_id = e and phase_group_identifier = pgroupid and team_name is null and entrant_user_id is null;

IF snum IS NOT NULL THEN
    UPDATE public.seeds
    SET entrant_user_id = uid
    WHERE tournament_id = tid AND event_id = e AND phase_group_identifier = pgroupid AND seed_num = snum;
ELSE
    SELECT MAX(seed_num) + 1
    INTO snum
    FROM public.seeds
    WHERE tournament_id = tid and event_id = e;

    INSERT INTO public.seeds (seed_num, tournament_id, event_id, phase_group_identifier, entrant_user_id)
    VALUES (snum, tid, e, pgroupid, uid);
END IF;

        PERFORM public.recreate_bracket(tid, e, pgroupid);
END LOOP;

    RETURN;
END;
$$;

  create policy "seeds_insert"
  on "public"."seeds"
  as permissive
  for insert
  to authenticated
with check (public.has_permission_level(tournament_id, auth.uid(), 2));



  create policy "seeds_update"
  on "public"."seeds"
  as permissive
  for update
                            to authenticated
                            using (public.has_permission_level(tournament_id, auth.uid(), 2));