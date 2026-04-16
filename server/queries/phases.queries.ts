'use server'
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {Database} from "@/lib/types/db.types";
import {BracketType, BracketTypeMap} from "@/lib/types/types";

export type FetchBracketPhasesResponse = Database["public"]["Views"]["bp_detailed"]["Row"][]

export async function fetchBracketPhasesFromEventId(tournamentId: number, eventId: number):
    Promise<FetchBracketPhasesResponse> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('bp_detailed').select('*').eq('tournament_id', tournamentId)
        .eq('event_id', eventId).order('id');

    if (error) {
        throw new Error("DB error while trying to query bracket_phases: " + error.details + " " + error.message)
    }

    for (const bp of data) {
        if (bp.bracket_type_name === null || bp.event_id === null || bp.id === null || bp.name === null || bp.num_progressing_per_group === null
            || bp.tournament_id === null || bp.num_pools === null || bp.num_entrants === null) {
            throw new Error("Unintentional null value occurred while querying view bp_detailed.")
        }
    }

    return data
}

export async function fetchBracketTypeFromBracketPhase(tournamentId: number, eventId: number, bracketPhaseId: number): Promise<{
    success: boolean,
    type?: BracketType
}> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('bracket_phases').select('bracket_type_name').eq('tournament_id', tournamentId)
        .eq('event_id', eventId).eq('id', bracketPhaseId).maybeSingle()

    if (error) {
        throw new Error("DB error while trying to query bracket_phases: " + error.details + " " + error.message)
    }

    if (!data) {
        return {
            success: false
        }
    }

    return {
        success: true,
        type: BracketTypeMap.get(data.bracket_type_name)
    }

}


export type FetchPhaseGroupsResponse = Database["public"]["Tables"]["phase_groups"]["Row"][]

export async function fetchPhaseGroupsFromBracketPhase(tournamentId: number, eventId: number, bracketPhaseId: number, limit?: number):
    Promise<FetchPhaseGroupsResponse>{
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    let query = supabase.from('phase_groups').select('*').eq('tournament_id', tournamentId)
        .eq('event_id', eventId).eq('bracket_phase_id', bracketPhaseId)

    query = limit ? query.limit(limit) : query

    const {data, error} = await query

    if (error) {
        throw new Error("DB error while trying to query phase_groups: " + error.details + " " + error.message)
    }

    return data
}

export async function doesBracketPhaseExist(tournamentId: number, eventId: number, bracketPhaseId: number): Promise<boolean> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {count, error} = await supabase.from('bracket_phases').select(`*`, {count: 'exact', head: true})
        .eq('tournament_id', tournamentId).eq('event_id', eventId).eq('id', bracketPhaseId);

    // Throws error if something goes wrong
    if (error) {
        throw new Error("DB error while trying to query bracket_phases: " + error.details + " " + error.message)
    }

    if (count === null) {
        throw new Error("An unknown error occurred while querying the database.")
    }

    // Returns if query returns a value.
    return count > 0
}

export async function doesPhaseGroupExist(tournamentId: number, eventId: number, bracketPhaseId: number, phaseGroupIdentifier: string): Promise<boolean> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {count, error} = await supabase.from('phase_groups').select(`*`, {count: 'exact', head: true})
        .eq('tournament_id', tournamentId).eq('event_id', eventId).eq('bracket_phase_id', bracketPhaseId).eq('identifier', phaseGroupIdentifier);

    // Throws error if something goes wrong
    if (error) {
        throw new Error("DB error while trying to query phase_groups: " + error.details + " " + error.message)
    }

    if (count === null) {
        throw new Error("An unknown error occurred while querying the database.")
    }

    // Returns if query returns a value.
    return count > 0
}