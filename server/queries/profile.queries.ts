'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

// tables we are working with
export type User = Database["public"]["Tables"]["users"]["Row"]
type Tournament = Database["public"]["Tables"]["tournaments"]["Row"]
type Entrants = Database["public"]["Tables"]["attendees"]["Row"]


// Getting User Info for Profile 
export async function fetchUserInfo(user_id: string): Promise<QueryResponse<User>> {
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // grabbing information needed for user
    const {data, error} = await supabase.from('users').select('*').eq('user_id', user_id).single()

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


// Functions to display past/future tournaments User was in
export async function fetchFutureTournaments(user_id : string): Promise<QueryResponse<Tournament[]>> {
    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    // getting current time to find future tournaments
    const curr_date = new Date().toISOString()

    // getting all tournaments that has the users id in it and are in the future
    const {data, error} = await supabase.from('tournaments').select('*, user!inner(display_name), attendees!inner(user_id)').eq('attendees.user_id', user_id).gt('start_time', curr_date)

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

export async function fetchPastTournaments(user_id : string): Promise<QueryResponse<Entrants[]>> {

    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // getting current time to filter by past tournaments
    const curr_date = new Date().toISOString()

    // getting all tournaments plus users placement that happend before current date
    const {data, error} = await supabase.from('entrants').select('*, tournaments!tournament_id(name, users!owner(display_name))').eq('user_id', user_id).lt('tournaments.end_time', curr_date)

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

