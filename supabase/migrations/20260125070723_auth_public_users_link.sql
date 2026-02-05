alter table "public"."tournaments" drop constraint "tournaments_owner_fk_01";

alter table "public"."users" drop constraint "public.users_auth.users_fk_01";

alter table "public"."tournaments" add constraint "tournaments_users_fk_01" FOREIGN KEY (owner) REFERENCES public.users(user_id) NOT DEFERRABLE INITIALLY IMMEDIATE;

alter table "public"."users" add constraint "public.users_auth.users_fk_01" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO public.users (user_id, first_name, last_name, display_name, prefix)
  VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'prefix');
  RETURN new;
END;$function$
;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();