'use server'

import {createClient} from "@/server/db/server";
import {cookies} from 'next/headers'
import {QueryResponse} from "@/lib/types/types";
import {Database} from "@/lib/types/db.types";

// table we are working with
export type User = Database["public"]["Tables"]["users"]["Row"]

// query response types
export type FutureTournamentsResponse = {
    discord_invite: string | null
    email_contact: string | null
    end_time: string
    home_page: string
    id: number
    is_online: boolean
    is_public: boolean
    location_id: number | null
    name: string
    owner: string
    slug: string | null
    start_time: string
    users: {
        display_name: string
    }
    attendees: {
        user_id: string
    }[]
}[]

export type PastTournamentsResponse = {
    event_id: number
    placement: number | null
    team_name: string | null
    tournament_id: number
    user_id: string
    events: {
        tournament_id: number
        tournaments: {
            name: string
            end_time: string
            users: {
                display_name: string
            }
        }
    }
}[]

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

export async function getUserIdfromEmail(email : string):  Promise<QueryResponse<string>> {
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // grabbing information needed for user
    const {data, error} = await supabase.rpc('getuserfromemail', {user_email : email})

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
export async function fetchFutureTournaments(user_id: string): Promise<QueryResponse<FutureTournamentsResponse>> {
    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    // getting current time to find future tournaments
    const curr_date = new Date().toISOString()

    // getting all tournaments that has the users id in it and are in the future
    const {data, error} = await supabase
        .from('tournaments')
        .select('*, users!tournaments_users_fk_01(display_name), attendees!inner(user_id)')
        .eq('attendees.user_id', user_id)
        .gt('start_time', curr_date)

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

export async function fetchPastTournaments(user_id : string): Promise<QueryResponse<PastTournamentsResponse>> {

    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // getting current time to filter by past tournaments
    const curr_date = new Date().toISOString()

    // getting all tournaments plus users placement that happened before current date
    const { data, error } = await supabase
        .from('entrants')
        .select('*, events!inner(tournament_id, tournaments!inner(name, end_time, users!owner(display_name)))')
        .eq('user_id', user_id)
        .lt('events.tournaments.end_time', curr_date)

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

