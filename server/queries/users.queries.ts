import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

export async function getUser() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
}