'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'

export type FetchTournamentsForSearchResponse = {
    email_contact: string | null,
    end_time: string,
    id: number,
    is_public: boolean,
    is_online: boolean,
    locations: {
        id: number,
        maps_place_id: string,
        address: string,
    } | null
    name: string,
    owner: {
        user_id: string,
        first_name: string,
        last_name: string,
        display_name: string,
        prefix: string | null
    },
    slug: string | null,
    start_time: string
}[]

/**
 * Returns all public tournaments in the database. If a search query is provided, the results are filtered by the query.
 * If a startAfter date is provided, only tournaments that start after that date are included.
 *
 * @param {string} searchQuery - Query placed within the search bar. Used to perform a websearch of the table. Default = ""
 * @param {string} startAfter - Will only return tournament in which start_time is after the date in startAfter. Default = new Date(0) (Unix epoch)
 * @param videoGame - CURRENTLY NOT WORKING Only tournaments containing events with this game will be returned. Default = ""
 * @param page - Page number to return (for pagination). Default = 0
 * @param perPage - Number of results per page. Default = 10
 *
 * @returns Array of tournament objects
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchTournamentsForSearch(searchQuery: string = "", startAfter: Date = new Date(0),
                                                videoGame: string = "", page: number = 0, perPage: number = 10):
    Promise<FetchTournamentsForSearchResponse> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const pageStart = page * perPage
    const pageEnd = pageStart + perPage - 1

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    // Create db query
    let query = supabase.from('tournaments').select(`
        id,
        name,
        start_time,
        end_time,
        slug,
        email_contact,
        is_public,
        is_online,
        locations (
            id,
            maps_place_id,
            address
        ),
        owner:users!tournaments_users_fk_01 (
            user_id,
            first_name,
            last_name,
            display_name,
            prefix
        )`/*,
        events!inner (
            video_game_name
        )`*/)
        .range(pageStart, pageEnd).gt('start_time', startAfter.toISOString()).order('start_time')

    // query = videoGame ? query.eq('events.video_game_name', videoGame) : query
    
    // Appends text search to query if searchQuery param is given
    query = searchQuery ? query.textSearch(
        'name', searchQuery, {
            type: "websearch",
            config: "english"
        }) : query

    const {data, error} = await query

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    // console.log(data)

    return data
}


/**
 * Given a slug, returns the id for the slug if one exists.
 *
 * @param slug
 *
 * @returns Response from query
 * @returns success - True if a tournament exists for that slug. False if it does not.
 * @returns data - ID of tournament matching slug
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchTournamentIdFromSlug(slug: string): Promise<{
    success: boolean,
    id?: number
}> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select('id').eq('slug', slug).maybeSingle()

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    if (data) {
        return {
            success: true,
            id: data.id
        }
    }
    return {
        success: false
    }

}


export type FetchTournamentFromIdResponse = {
    discord_invite: string | null,
    email_contact: string | null,
    end_time: string,
    entry_fee_cents: number,
    home_page: string,
    id: number
    is_public: boolean,
    is_online: boolean,
    locations: {
        id: number,
        maps_place_id: string,
        address: string,
    } | null,
    name: string,
    owner: {
        user_id: string,
        first_name: string,
        last_name: string,
        display_name: string,
        prefix: string | null
    },
    slug: string | null,
    start_time: string
}

/**
 * Given a tournament ID, returns the tournament object with the matching ID.
 *
 * @param {number} id - ID of the tournament to fetch.
 *
 * @returns Response from query
 * @returns success - True if the DB query is successful. (Error is thrown if it fails)
 * @returns data - Tournament object
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchTournamentFromId(id: number): Promise<{
    success: boolean,
    tournament?: FetchTournamentFromIdResponse
}> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select(`
        id,
        name,
        start_time,
        end_time,
        slug,
        home_page,
        discord_invite,
        email_contact,
        is_public,
        is_online,
        entry_fee_cents,
        locations (
            id,
            maps_place_id,
            address
        ),
        owner:users!tournaments_users_fk_01 (
            user_id,
            first_name,
            last_name,
            display_name,
            prefix
        )`).eq('id', id).maybeSingle()

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    if (!data) {
        return {
            success: false
        }
    }

    return {
        success: true,
        tournament: data
    }
}


export async function doesTournamentExist(tournamentId: number): Promise<boolean> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {count, error} = await supabase.from('tournaments').select(`*`, {count: 'exact', head: true}).eq('id', tournamentId);

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    if (count === null) {
        throw new Error("An unknown error occurred while querying the database.")
    }

    // Returns if query returns a value.
    return count > 0
}