'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {doesTournamentExist} from "@/server/queries/tournaments.queries";

export type FetchEventsFromTournamentIdResponse = {
    tournament_id: number,
    id: number,
    name: string,
    start_time: string,
    end_time: string,
    price: number,
    video_game_name: string,
    gaming_platform_name: string,
    teams_allowed: boolean,
    max_team_size: number | null
}[]

/**
 * Returns all events for given tournament
 * @param tournamentId
 *
 * @returns Response from query
 * @returns success - True if given tournament id exists and query goes through; False if it doesn't
 * @returns events - List of events for the given tournament
 */
export async function fetchEventsFromTournamentId(tournamentId: number): Promise<{
    success: boolean,
    events?: FetchEventsFromTournamentIdResponse
}> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    if (!(await doesTournamentExist(tournamentId))) {
        return {
            success: false
        }
    }

    const {data, error} = await supabase.from('events').select().eq('tournament_id', tournamentId)

    if (error) {
        throw new Error("DB error while trying to query events: " + error.details + " " + error.message)
    }


    return {
        success: true,
        events: data
    }
}