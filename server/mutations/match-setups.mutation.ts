'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types"; 

// creating match setups schema with objects 
const MatchSetupsInsertSchema = z.object({
        identifier : z.string(),
        tournament_id : z.number(),
        event_id : z.number(),
        match_identifier : z.string().nullable().optional(),
        phase_group_identifier : z.string().nullable().optional(),
})

// init the match setup insert errors 
export type MatchSetupInsertErrors = {
    identifier? : string[],
    tournament_id? : string[],
    event_id? : string[],
    match_identifier? : string[],
    phase_group_identifier? : string[],
}

// this function inserts match setups into the table
export async function insertMatchSetups(identifier : string, tournament_id : number, event_id : number, match_identifier : string | null, phase_group_identifier: string | null): Promise<MutationResponse<void, MatchSetupInsertErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parses schedule conflict insert schema
    const result = MatchSetupsInsertSchema.safeParse({
        identifier : identifier,
        tournament_id : tournament_id ,
        event_id : event_id,
        match_identifier : match_identifier,
        phase_group_identifier : phase_group_identifier,
    })

    // check for any errors
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    // inserts data into setups table 
    const {data, error} = await supabase.rpc('insert_setups', {
        s_identifier : result.data.identifier,
        s_tournament_id : result.data.tournament_id,
        s_event_id : result.data.event_id,
        s_match_identifier : result.data.match_identifier ?? undefined,
        s_phase_group_identifier : result.data.phase_group_identifier ?? undefined
    })

    // checks if inserting gave any errors 
    if (error) {
        throw new Error("Match Setups Insert Transaction Failed: " + error.details + " " + error.message)
    }

    // returns success
    return {
        success: true,
    }
}

// creating match setups update schema with objects
const MatchSetupUpdateSchema = z.object({
        identifier : z.string(),
        tournament_id : z.number(),
        event_id : z.number(),
        match_identifier : z.string().nullable().optional(),
        phase_group_identifier : z.string().nullable().optional(),
})

// init the match setup insert errors 
export type MatchSetupUpdateErrors = {
    identifier? : string[],
    tournament_id? : string[],
    event_id? : string[],
    match_identifier? : string[],
    phase_group_identifier? : string[],
}

// this function allows us to update setups table
export async function updateMatchSetups(identifier : string, tournament_id : number, event_id : number, match_identifier : string | null, phase_group_identifier: string | null): Promise<MutationResponse<void, MatchSetupInsertErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parses schedule conflict insert schema
    const result = MatchSetupUpdateSchema.safeParse({
        identifier : identifier,
        tournament_id : tournament_id ,
        event_id : event_id,
        match_identifier : match_identifier,
        phase_group_identifier : phase_group_identifier,
    })

    // check for any errors
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    // inserts data into setups table 
    const {data, error} = await supabase.rpc('update_setup', {
        s_identifier : result.data.identifier,
        s_tournament_id : result.data.tournament_id,
        s_event_id : result.data.event_id,
        s_match_identifier : result.data.match_identifier ?? undefined,
        s_phase_group_identifier : result.data.phase_group_identifier ?? undefined
    })

    // checking if the insert gave any errors 
    if (error) {
        throw new Error("Match Setups Update Transaction Failed:" + error.details + " " + error.message)
    }

    // returning success
    return {
        success : true,
    }
}

// this fucntion deletes a Setups from the db
export async function deleteMatchSetup(identifier: string, tournament_id : number, event_id : number) {
    
    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // deleting schedule conflict from db
    const {error} = await supabase.from('match_setups').delete().eq('identifier', identifier).eq('tournament_id', tournament_id).eq('event_id', event_id)
    if (error) {
        throw new Error("DB Error while trying to delete from Match Setups" + error.details + " " + error.message)
    }

    // returns sucess
    return {
        success : true
    }   
}



