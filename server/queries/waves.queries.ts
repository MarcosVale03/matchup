'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

// init our wave type var
type Wave = Database["public"]["Tables"]["waves"]["Row"]

// this function gets all waves from a tournement id 
export async function fetchWaveFromTournament(tournament_id : number): Promise<QueryResponse<Wave[]>> {
    
    // creates client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // looks fo wave based on a tournament id 
    const {data, error} = await supabase.from('waves').select().eq('tournament_id', tournament_id)

    // checks if we got any error doing that
    if (error) {
        return {
            success : false,
            message : error.message
        }
    }


    // returns data
    return {
        success : true, 
        data : data
    }
}
