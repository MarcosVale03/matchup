'use server'

import { createClient } from "@/server/db/server"
import { cookies } from 'next/headers'

export type MatchResponse = {
    id: number,
    code: string,
    advance_match_id: number | null,
    advance_slot_num: number | null,
    match_slots: {
        slot_num: number,
        seed: {
            seed_num: number,
            user: {
                first_name: string,
                last_name: string,
                display_name: string,
                prefix: string,
                country: string,
                state: string,
            } | null
        }
    }[]
}

export type FetchBracketResponse = {
    tournament_id: number,
    event_id: number,
    phase_group_identifier: string,
    round_num: number,
    matches: MatchResponse[]
}[]

// function to fetch all matches and slots for a tournament/event and assemble them into a structured format
export async function fetchBracket(
    tournamentId: number,
    eventId: number,
    phaseGroupIdentifier: string
): Promise<FetchBracketResponse> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // get all matches for this tournament/event
    const { data, error } = await supabase
        .from('rounds')
        .select(`
            *,
            matches(
                advance_match_id,
                advance_slot_num,
                id,
                code,
                match_slots:match_slots_matches_fk_01(
                    slot_num,
                    seed:match_slots_seeds_fk_01(
                        seed_num,
                        user:users(
                            first_name,
                            last_name,
                            display_name,
                            prefix,
                            country,
                            state
                        )
                    )
                )
            )
        `)
        .eq('tournament_id', tournamentId)
        .eq('event_id', eventId)
        .eq('phase_group_identifier', phaseGroupIdentifier)
        .order('round_num', {ascending: false})

    if (error || !data) {
        throw new Error("DB error while trying to query rounds: " + error.details + " " + error.message)
    }

    return data
}