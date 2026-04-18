alter table public.admins drop column "email";

DROP function public.insert_admin;

CREATE OR REPLACE FUNCTION public.insert_admin(a_tournament_id bigint, a_user_id uuid, a_permission_level integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO admins (
    tournament_id,
    user_id,
    permission_level
  )
  VALUES (
    a_tournament_id,
    a_user_id,
    a_permission_level
  );
END;$function$
;

DROP function public.update_admins;

CREATE OR REPLACE FUNCTION public.update_admins(a_tournament_id bigint, a_user_id uuid, a_permission_level integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
UPDATE admins
SET
    permission_level = a_permission_level
WHERE
    tournament_id = a_tournament_id
  AND user_id = a_user_id;
END;
$function$
;