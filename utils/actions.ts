'use server'

import {createClient} from "@/utils/supabase/server";
import { cookies } from 'next/headers'

export async function addTournament() {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const { error } = await supabase
        .from('tournaments')
        .insert({ name: "New Tournament", slug: "new_tournament", description: "wah.", start_time: new Date().toISOString(), end_time: new Date().toISOString() })

    console.log(error)
}