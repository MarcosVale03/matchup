'use server'

import { createClient } from "@/server/db/server"
import { cookies } from 'next/headers'
import { MutationResponse } from "@/lib/types/types"

// function to report match result and advance winner in bracket. (will add validation and error handling later)
export async function reportMatchResult(
    tournamentId: number,
    eventName: string,
    phaseGroupId: string,
    matchIdentifier: string,
    winnerSlotNum: number
): Promise<MutationResponse<null, { general?: string[] }>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // getting the match and winner slot info to know where to advance the winner
    const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('identifier', matchIdentifier)
        .eq('tournament_id', tournamentId)
        .eq('event_name', eventName)
        .eq('phase_group_identifier', phaseGroupId)
        .single()

    if (matchError || !match) {
        return {
            success: false,
            fieldErrors: { general: [`Match not found: ${matchError?.message}`] }
        }
    }

    // getting winner slot to determine the advancing seed
    const { data: winnerSlot, error: slotError } = await supabase
        .from('match_slots')
        .select('*')
        .eq('match_identifier', matchIdentifier)
        .eq('tournament_id', tournamentId)
        .eq('event_name', eventName)
        .eq('phase_group_identifier', phaseGroupId)
        .eq('slot_num', winnerSlotNum)
        .single()

    if (slotError || !winnerSlot) {
        return {
            success: false,
            fieldErrors: { general: [`Winner slot not found: ${slotError?.message}`] }
        }
    }

    if (!winnerSlot.seed_num) {
        return {
            success: false,
            fieldErrors: { general: ["Winner slot has no seed assigned — match may not be ready"] }
        }
    }

    // if this match feeds into another match, update the next match slot with the advancing seedn
    if (match.advance_match_identifier && match.advance_slot_num) {
        const { error: advanceError } = await supabase
            .from('match_slots')
            .update({ seed_num: winnerSlot.seed_num })
            .eq('match_identifier', match.advance_match_identifier)
            .eq('tournament_id', tournamentId)
            .eq('event_name', eventName)
            .eq('phase_group_identifier', phaseGroupId)
            .eq('slot_num', match.advance_slot_num)

        if (advanceError) {
            return {
                success: false,
                fieldErrors: { general: [`Failed to advance winner: ${advanceError.message}`] }
            }
        }
    }


    return { success: true }
}