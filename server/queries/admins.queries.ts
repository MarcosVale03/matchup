'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {PermissionLevel} from "@/lib/types/types";


/**
 * Checks if a given user is an admin for a given tournament
 * @param userId - ID of the user in question
 * @param tournamentId - ID of the tournament in question
 * @param permissionLevel - Minimum permission (highest index) level that user can have
 * @returns True if given user has at least the permission level specified. Returns false otherwise.
 *
 * @throws - Will throw an exception if an error occurs while querying the database.
 */
export async function hasPermissionLevel(userId: string, tournamentId: number, permissionLevel: PermissionLevel): Promise<boolean> {
    // Create supabase client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.rpc('has_permission_level', {
        tid: tournamentId,
        uid: userId,
        plevel: permissionLevel
    })

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Admin Query Failed: " + error.details + " " + error.message)
    }

    return data
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
        last_name: string
    }
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