'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

// tables we are working with
type ScheduleConflict = Database['public']['Tables']['schedule_conflicts']['Row']

// Getting Scheudle Conflict by user
export async function fetchUserConflicts(tournament_id : number, user_id : string): Promise<QueryResponse<ScheduleConflict[]>> {

    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // grabbing information needed for user
    const {data, error} = await supabase.from('schedule_conflicts').select('*').eq('tournament_id', tournament_id).eq('user_id', user_id)
    // error check
    if (error) {
        return {
            success : false,
            message : error.message
        }
    }

    // returning data from DB
    return {
        success : true,
        data : data
    }

}

