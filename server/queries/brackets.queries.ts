'use server'

import { createClient } from "@/server/db/server"
import { cookies } from 'next/headers'

export type MatchResponse = {
    id: number,
    code: string,
    w_advance_match_id: number | null,
    w_advance_slot_num: number | null,
    l_advance_match_id: number | null,
    l_advance_slot_num: number | null,
    isComplete: boolean,
    match_slots: {
        slot_num: number,
        score: number,
        placement: number | null,
        prereqCondition: string,
        seed: {
            seed_num: number,
            user: {
                first_name: string,
                last_name: string,
                display_name: string,
                prefix: string | null,
                country: string | null,
                state: string | null,
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
                w_advance_match_id,
                w_advance_slot_num,
                l_advance_match_id,
                l_advance_slot_num,
                id,
                code,
                isComplete,
                match_slots:match_slots_matches_fk_01(
                    slot_num,
                    score,
                    placement,
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
        .order('code', {referencedTable: 'matches', ascending: true})

    if (error || !data) {
        throw new Error("DB error while trying to query rounds: " + error.details + " " + error.message)
    }

    return await Promise.all(data.map(async round => {return {
        tournament_id: round.tournament_id,
        event_id: round.event_id,
        phase_group_identifier: round.phase_group_identifier,
        round_num: round.round_num,
        matches: await Promise.all(round.matches.map(async match => {return {
            id: match.id,
            code: match.code,
            w_advance_match_id: match.w_advance_match_id,
            w_advance_slot_num: match.w_advance_slot_num,
            l_advance_match_id: match.l_advance_match_id,
            l_advance_slot_num: match.l_advance_slot_num,
            isComplete: match.isComplete,
            match_slots: await Promise.all(match.match_slots.map(async slot => {return {
                slot_num: slot.slot_num,
                score: slot.score,
                placement: slot.placement,
                seed: slot.seed,
                prereqCondition: slot.seed?.user
                    ? ""
                    : await getPrereqCondition(round.tournament_id, round.event_id, round.phase_group_identifier, round.round_num, match.id, slot.slot_num)
            }}))
        }}))
    }}))
}


async function getPrereqCondition(tournamentId: number, eventId: number, phaseGroupIdentifier: string, round_num: number, match_id: number, slot_num: number) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const { data, error } = await supabase.from('matches').select('code').eq('tournament_id', tournamentId)
        .eq('event_id', eventId).eq('phase_group_identifier', phaseGroupIdentifier)
        .eq('w_advance_match_id', match_id).eq('w_advance_slot_num', slot_num).maybeSingle()

    if (error) {
        throw new Error("DB error while trying to query matches: " + error.details + " " + error.message)
    }

    if (!data) {
        const {data: dataL, error: errorL} = await supabase.from('matches').select('code').eq('tournament_id', tournamentId)
            .eq('event_id', eventId).eq('phase_group_identifier', phaseGroupIdentifier)
            .eq('l_advance_match_id', match_id).eq('l_advance_slot_num', slot_num).maybeSingle()

        if (errorL) {
            throw new Error("DB error while trying to query matches: " + errorL.details + " " + errorL.message)
        }

        if (!dataL) {
            const {data: dataP, error: errorP} = await supabase.from('phase_groups').select('bracket_phases(id, name)')
                .eq('tournament_id', tournamentId)
                .eq('event_id', eventId)
                .eq('identifier', phaseGroupIdentifier).maybeSingle()

            if (errorP) {
                throw new Error("DB error while trying to query phase_groups: " + errorP.details + " " + errorP.message)
            }
            if (!dataP) {
                throw new Error("Unexpected error while querying phase_groups")
            }

            const {data: dataBP, error: errorBP} = await supabase.from('bracket_phases').select(`
                name,
                next_phase_id
            `)
                .eq('tournament_id', tournamentId)
                .eq('event_id', eventId)
                .eq('next_phase_id', dataP.bracket_phases.id).maybeSingle()

            if (errorBP) {
                throw new Error("DB error while trying to query bracket_phases: " + errorBP.details + " " + errorBP.message)
            }
            if (!dataBP) {
                return `Entrant into ${dataP.bracket_phases.name}`
            }

            if (round_num < 0) {
                return `${dataBP.name}: Losers`
            }
            return `${dataBP.name}: Winners`
        }

        return `Loser of ${dataL.code}`
    }

    return `Winner of ${data.code}`
}