'use server'

import {createClient} from "@/utils/supabase/server";
import { cookies } from 'next/headers'

export async function fetchTournaments() {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data: tournaments} = await supabase.from('tournaments').select()
    return tournaments
}