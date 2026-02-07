'use server'

import { createClient } from "@/server/db/server"
import { cookies } from 'next/headers'
import { MutationResponse } from "@/lib/types/types"
import {generateSingleEliminationBracket, getByeWinner,} from "@/server/brackets/single-elimination"

// helper funct to gen seed order for single elim bracket
export type BracketGenerationErrors = {
    tournament_id?: string[]
    event_name?: string[]
    general?: string[]
}

// gen seed order for single elim bracket w/ standard seeding pattern (first vs last, meet in middle, etc)
export async function generateBracket(
    tournamentId: number,
    eventName: string,
    phaseName: string = "Main Bracket"
): Promise<MutationResponse<null, BracketGenerationErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // validate tournament and event exist
    const { data: entrants, error: entrantsError } = await supabase
        .from('entrants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('event_name', eventName)

    if (entrantsError) {
        return {
            success: false,
            fieldErrors: { general: [entrantsError.message] }
        }
    }
    
    if (!entrants || entrants.length < 2) {
        return {
            success: false,
            fieldErrors: { general: ["Need at least 2 entrants to generate a bracket"] }
        }
    }

    const numEntrants = entrants.length

    // gen seeds for entrants based on order and insert into seeds table. seed num = initial seeding for bracket generation
    const seedInserts = entrants.map((entrant, index) => ({
        seed_num: index + 1,
        tournament_id: tournamentId,
        event_name: eventName,
        entrant_user_id: entrant.user_id,
        team_name: entrant.team_name
    }))

    
    const { error: seedError } = await supabase
        .from('seeds')
        .insert(seedInserts)

    if (seedError) {
        return {
            success: false,
            fieldErrors: { general: [`Failed to create seeds: ${seedError.message}`] }
        }
    }


    const { error: phaseError } = await supabase
        .from('bracket_phases')
        .insert({
            name: phaseName,
            tournament_id: tournamentId,
            event_name: eventName,
            bracket_type_name: 'Single Elimination',
            num_progressing_per_group: 1, 
            next_phase_name: null         
        })

    if (phaseError) {
        return {
            success: false,
            fieldErrors: { general: [`Failed to create bracket phase: ${phaseError.message}`] }
        }
    }

    
    const phaseGroupId = "1" 

    const { error: groupError } = await supabase
        .from('phase_groups')
        .insert({
            identifier: phaseGroupId,
            tournament_id: tournamentId,
            event_name: eventName,
            bracket_phase_name: phaseName,
        })

    if (groupError) {
        return {
            success: false,
            fieldErrors: { general: [`Failed to create phase group: ${groupError.message}`] }
        }
    }

   
    const generatedMatches = generateSingleEliminationBracket(numEntrants)

    const matchInserts = generatedMatches.map(match => ({
        identifier: match.id,
        tournament_id: tournamentId,
        event_name: eventName,
        phase_group_identifier: phaseGroupId,
        advance_match_identifier: null as string | null,
        advance_slot_num: null as number | null,
    }))

    const { error: matchError } = await supabase
        .from('matches')
        .insert(matchInserts)

    if (matchError) {
        return {
            success: false,
            fieldErrors: { general: [`Failed to create matches: ${matchError.message}`] }
        }
    }

    // based on generated matches, insert match slots with seeds for first round and null for later rounds
    const slotInserts = generatedMatches.flatMap(match =>
        match.slots.map(slot => ({
            match_identifier: match.id,
            tournament_id: tournamentId,
            event_name: eventName,
            phase_group_identifier: phaseGroupId,
            slot_num: slot.slot_number,
            seed_num: slot.seed_number,
        }))
    )

    const { error: slotError } = await supabase
        .from('match_slots')
        .insert(slotInserts)

    if (slotError) {
        return {
            success: false,
            fieldErrors: { general: [`Failed to create match slots: ${slotError.message}`] }
        }
    }

    // based on generated matches, want to see which match each one advances to
    for (const match of generatedMatches) {
        if (match.advance_match_id && match.advance_slot_number) {
            const { error: updateError } = await supabase
                .from('matches')
                .update({
                    advance_match_identifier: match.advance_match_id,
                    advance_slot_num: match.advance_slot_number,
                })
                .eq('identifier', match.id)
                .eq('tournament_id', tournamentId)
                .eq('event_name', eventName)
                .eq('phase_group_identifier', phaseGroupId)

            if (updateError) {
                return {
                    success: false,
                    fieldErrors: { general: [`Failed to set advancement for ${match.id}: ${updateError.message}`] }
                }
            }
        }
    }

    // if entrant doesn't have match, they get a bye and advance to next round
    for (const match of generatedMatches) {
        const byeWinner = getByeWinner(match)
        if (byeWinner !== null && match.advance_match_id && match.advance_slot_number) {
           
            const { error: byeError } = await supabase
                .from('match_slots')
                .update({ seed_num: byeWinner })
                .eq('match_identifier', match.advance_match_id)
                .eq('tournament_id', tournamentId)
                .eq('event_name', eventName)
                .eq('phase_group_identifier', phaseGroupId)
                .eq('slot_num', match.advance_slot_number)

            if (byeError) {
                return {
                    success: false,
                    fieldErrors: { general: [`Failed to process bye for ${match.id}: ${byeError.message}`] }
                }
            }
        }
    }

    return { success: true }    
}