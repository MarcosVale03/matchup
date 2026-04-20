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


export async function createSetupsFromInput(tournament_id : number, event_id : number, count : number) {

    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const setups = []
    // create a setup for # of setups TO asks for (count) 
    for (let i = 1; i <= count; i++) {
        setups.push({
            identifier : `Station ${i}`,
            tournament_id : tournament_id,
            event_id : event_id,
            phase_group_identifier : null,
            match_id : null,

        })
    }


    // inserting the setups into the db
    const {error} = await supabase.from('match_setups').insert(setups)

    if (error) {
        throw new Error("DB Error while trying to delete from Match Setups" + error.details + " " + error.message)
    }

    // returns sucess
    return {
        success : true
    }   

}


export async function assignMatchToSetup(tournament_id : number, event_id : number, phase_group_identifier : string, match_id : number) {

    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // find a single available station with from the same tournament/event
    const {error : FindError, data : FindData} = await supabase.from('match_setups').select('identifier').eq('tournament_id', tournament_id)
    .eq('event_id', event_id).is('match_id', null).limit(1).single()
    
    if (FindError) {
        throw new Error("DB Error while trying to delete from Match Setups" + FindError.details + " " + FindError.message)
    }

    // assign match to the setup we found
    const {error : UpdateError, data : UpdateData} =  await supabase.from('match_setups').update({'phase_group_identifier' : phase_group_identifier, match_id : match_id})
    .eq('identifier', FindData.identifier).eq('tournament_id', tournament_id).eq('event_id', event_id)


    if (UpdateError) {
        throw new Error("DB Error while trying to update from Match Setups" + UpdateError.details + " " + UpdateError.message)
    }

    // returns sucess
    return {
        success : true
    }   
}

export async function freeUpSetup(identifier : string, tournament_id : number, event_id : number) {

     // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // set the phsae and match id to null (meaning the match is over and station is available to use)
    const {error} = await supabase.from('match_setups').update({'phase_group_identifier' : null, 'match_id' : null})
    .eq('identifier', identifier).eq('tournament_id', tournament_id).eq('event_id', event_id)
    
    if (error) {
        throw new Error("DB Error while trying to delete from Match Setups" + error.details + " " + error.message)
    }

    // returns sucess
    return {
        success : true
    }   
}