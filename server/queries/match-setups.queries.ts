'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

// init our wave type var
type MatchSetups = Database["public"]["Tables"]["match_setups"]["Row"]

// this function gets all setup information based on tournament details
export async function fetchMatchSetupByTournament(tournament_id : number, event_id : number): Promise<QueryResponse<MatchSetups[]>> {
    
    // creates client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // looks fo wave based on a tournament id 
    const {data, error} = await supabase.from('match_setups').select().eq('tournament_id', tournament_id).eq('event_id', event_id)

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

// this function gets all available setups 
export async function fetchAvailableMatchSetups(tournament_id : number, event_id : number): Promise<QueryResponse<MatchSetups[]>> { 

    // creates client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // looks fo wave based on a tournament id 
    const {data, error} = await supabase.from('match_setups').select().eq('tournament_id', tournament_id).eq('event_id', event_id).is('match_identifier', null)

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