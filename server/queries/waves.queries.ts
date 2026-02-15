'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

type Wave = Database["public"]["Tables"]["waves"]["Row"]

export async function fetchWaveFromTournament(tournament_id : number): Promise<QueryResponse<Wave[]>> {
    
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('waves').select().eq('tournament_id', tournament_id)

    if (error) {
        return {
            success : false,
            message : error.message
        }
    }

    return {
        success : true, 
        data : data
    }
}
