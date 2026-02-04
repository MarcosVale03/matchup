CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.users (user_id, first_name, last_name, display_name, prefix)
  VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'prefix');
RETURN new;
END;$function$
;
