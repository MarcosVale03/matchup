'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'

import {QueryResponse, Tournament} from "@/lib/types/types";

/**
 * Returns all public tournaments in the database. If a search query is provided, the results are filtered by the query.
 * If a startAfter date is provided, only tournaments that start after that date are included.
 *
 * @param {string} searchQuery - Query placed within the search bar. Used to perform a websearch of the table. Default = ""
 * @param {string} startAfter - Will only return tournament in which start_time is after the date in startAfter. Default = new Date(0) (Unix epoch)
 *
 * @returns Response from query
 * @returns success - True if the DB query is successful. (Error is thrown if it fails)
 * @returns data - Array of tournament objects
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchTournaments(searchQuery: string = "", startAfter: Date = new Date(0)): Promise<QueryResponse<Tournament[]>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = searchQuery ?
        await supabase.from('tournaments').select().eq('is_public', true).gt('start_time', startAfter.toISOString()).textSearch(
        'name', searchQuery, {
            type: "websearch",
            config: "english"
        }) :
        await supabase.from('tournaments').select().eq('is_public', true).gt('start_time', startAfter.toISOString())

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }


    return {
        success: true,
        data: data
    }
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
export async function fetchTournamentIdFromSlug(slug: string): Promise<QueryResponse<number>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select('id').eq('slug', slug)

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    if (data?.length > 0) {
        return {
            success: true,
            data: data[0].id
        }
    }
    return {
        success: false
    }

}


/**
 * Given a tournament ID, returns the tournament object with the matching ID.
 *
 * @param {number} id - ID of the tournament to fetch.
 *
 * @returns Response from query
 * @returns success - True if the DB query is successful. (Error is thrown if it fails)
 * @returns data - Tournament objects
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchTournamentFromId(id: number): Promise<QueryResponse<Tournament>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select().eq('id', id)

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }


    return {
        success: true,
        data: data[0]
    }
}