'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";


/**
 * Checks if a given user is an admin for a given tournament
 * @param userId - ID of the user in question
 * @param tournamentId - ID of the tournament in question
 * @returns True if given user is an admin for the given tournament. Returns false otherwise.
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function isUserTournamentAdmin(userId: string, tournamentId: number): Promise<boolean> {
    // Create supabase client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Check for rows with matching user id and tournament id
    const {count, error} = await supabase.from('admins').select("*", {count: 'exact', head: true}).eq('user_id', userId).eq('tournament_id', tournamentId);

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Admin Query Failed: " + error.details + " " + error.message)
    }

    if (count === null) {
        throw new Error("An unknown error occurred while querying the database.")
    }

    // Returns if query returns a value.
    return count > 0
}


export type AdminsFromUserResponse = {
    permission_levels: {
        id: number,
        name: string
    },
    tournaments: {
        id: number,
        name: string
    }
}

/**
 * @param userId - ID of the user in question
 * @returns Array of objects containing the tournament the user is an admin for and what permission level they have.
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchAdminsFromUser(userId: string): Promise<AdminsFromUserResponse[]> {
    // Create supabase client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // DB Query
    const {data, error} = await supabase
        .from('admins')
        .select(`
            permission_levels (
                id,
                name
            ),
            tournaments (
                id,
                name
            )`)
        .eq('user_id', userId)

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    return data
}


export type AdminsFromTournamentResponse = {
    permission_levels: {
        id: number,
        name: string,
        description: string
    },
    users: {
        user_id: string,
        prefix: string | null,
        display_name: string,
        first_name: string,
        last_name: string,
    },
    email? : string
}

/**
 * @param tournamentId - ID of the tournament in question
 * @returns Array of objects containing the tournament the user is an admin for and what permission level they have.
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function fetchAdminsFromTournament(tournamentId: number): Promise<AdminsFromTournamentResponse[]> {
    // Create supabase client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // DB Query
    const {data, error} = await supabase
        .from('admins')
        .select(`
            email,   
            permission_levels (
                id,
                name,
                description
            ),
            users (
                user_id,
                prefix,
                display_name,
                first_name,
                last_name
            )`)
        .eq('tournament_id', tournamentId)

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    return data
}

