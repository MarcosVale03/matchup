'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

// init our wave type var
type MatchSetups = Database["public"]["Tables"]["match_setups"]["Row"]
type Matches = Database["public"]["Tables"]["matches"]["Row"]

// this function gets all setup information based on tournament details
export async function fetchMatchSetupByTournament(tournament_id : number, event_id : number): Promise<QueryResponse<MatchSetups[]>> {
    
    // creates client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // looks for setup based on a tournament id 
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

    // looks for available setups       
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


// export type MatchesFromPhaseGroupResponse = {
//     matches : {
//         tournament_id : number,
//         phase_group_identifier : string,
//         event_id : number,
//         round_num : number,
//         code : string,
//         id : number,
//         w_advance_slot_num : number,
//         w_advance_slot_id : number,
//         l_advance_slot_num : number,
//         l_advance_slot_id : number,
//         isComplete : boolean
//     },
//     match_slots : {
//         slot_num : number
//     },
//     seeds : {
//         entrant_user_id : number
//     },
//     users : {
//         display_name : string
//     }
// }

// this function gets matches per phase group
export async function fetchMatchPerPhaseGroup(tournament_id : number, event_id : number, phase_group_identifier : string): Promise<QueryResponse<any[]>> {

    // creates client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // looks for matches based on phase group 
    const {data, error} = await supabase.from('matches').select('*, match_slots!match_slots_matches_fk_01( slot_num, seeds (entrant_user_id, users (display_name)))').eq('tournament_id', tournament_id).eq('event_id', event_id).eq('phase_group_identifier', phase_group_identifier)

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