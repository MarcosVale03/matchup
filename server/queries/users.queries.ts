import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {AuthSessionMissingError} from "@supabase/auth-js";

export async function getUser() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        if (error instanceof AuthSessionMissingError) {
            return null
        }
        throw error;
    }

    return data.user;
}