'use server'

import { createClient } from "@/server/db/server"
import { cookies } from 'next/headers'
import { QueryResponse } from "@/lib/types/types"
import { Database } from "@/lib/types/db.types"


type Match = Database["public"]["Tables"]["matches"]["Row"]
type MatchSlot = Database["public"]["Tables"]["match_slots"]["Row"]
type Seed = Database["public"]["Tables"]["seeds"]["Row"]


export interface BracketMatch extends Match {
    slots: (MatchSlot & { seed?: Seed | null })[]
}

// function to fetch all matches and slots for a tournament/event and assemble them into a structured format
export async function fetchBracket(
    tournamentId: number,
    eventName: string
): Promise<QueryResponse<BracketMatch[]>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // get all matches for this tournament/event
    const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('event_name', eventName)

    if (matchError) {
        return { success: false, message: matchError.message }
    }

    // get all slots for the matches in this tournament/event
    const { data: slots, error: slotError } = await supabase
        .from('match_slots')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('event_name', eventName)

    if (slotError) {
        return { success: false, message: slotError.message }
    }

    // need seed info to know which entrants are in each match slot
    const { data: seeds, error: seedError } = await supabase
        .from('seeds')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('event_name', eventName)

    if (seedError) {
        return { success: false, message: seedError.message }
    }

    // assemble matches with their corresponding slots and seed info
    const bracketMatches: BracketMatch[] = matches.map(match => {
        const matchSlots = slots
            .filter(s =>
                s.match_identifier === match.identifier &&
                s.phase_group_identifier === match.phase_group_identifier
            )
            .map(slot => ({
                ...slot,
                seed: seeds.find(s => s.seed_num === slot.seed_num) ?? null
            }))
            .sort((a, b) => a.slot_num - b.slot_num)

        return { ...match, slots: matchSlots }
    })

   // sort matches by round and match number=
    bracketMatches.sort((a, b) => {
        const roundA = parseInt(a.identifier.match(/R(\d+)/)?.[1] ?? "0")
        const roundB = parseInt(b.identifier.match(/R(\d+)/)?.[1] ?? "0")
        if (roundA !== roundB) return roundA - roundB
        const matchA = parseInt(a.identifier.match(/M(\d+)/)?.[1] ?? "0")
        const matchB = parseInt(b.identifier.match(/M(\d+)/)?.[1] ?? "0")
        return matchA - matchB
    })

    return { success: true, data: bracketMatches }
}