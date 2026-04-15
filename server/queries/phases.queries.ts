import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

export type FetchBracketPhasesResponse = {
    bracket_type_name: string
    event_id: number
    id: number
    name: string
    next_phase_id: number | null
    next_phase_name: string | null
    num_progressing_per_group: number
    tournament_id: number
    num_pools: number
    num_entrants: number
}[]

export async function fetchBracketPhasesFromEventId(tournamentId: number, eventId: number):
    Promise<FetchBracketPhasesResponse> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('bp_detailed').select('*').eq('tournament_id', tournamentId).eq('event_id', eventId);

    if (error) {
        throw new Error("DB error while trying to query bracket_phases: " + error.details + " " + error.message)
    }

    return data
}