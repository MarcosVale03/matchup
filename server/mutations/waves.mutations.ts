'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types";

// creating wave insert schema with objects
const WaveInsertSchema = z.object({
    tournament_id: z.number().int().positive(),
    identifier: z.string().min(1).max(80),
})

// init the wave insert errors 
export type WaveInsertErrors = {
    tournament_id?: string[],
    identifier?: string[]
}

// this function inserts the waves into the waves table in the db
export async function insertWave(tournament_id : number, identifier: string) : Promise<MutationResponse<void, WaveInsertErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parses wave insert schema 
    const result = WaveInsertSchema.safeParse({
        tournament_id : tournament_id, 
        identifier : identifier
    })

    // checks for any errors
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }
    
    // inserts the data into the wave table
    const {data, error} = await supabase.rpc('insert_wave', {
        w_tournament_id : result.data.tournament_id,
        w_identifier : result.data.identifier
    })

    // checks if inserting gave any errors 
    if (error) {
        throw new Error("Wave Insert Transaction Failed: " + error.details + " " + error.message)
    }

    // returns success
    return {
        success: true,
    }
}

// creating wave update schema with objects
const WaveUpdateSchema = z.object({
    tournament_id : z.number().int().positive(), 
    old_identifier: z.string().min(1).max(80),
    new_identifier: z.string().min(1).max(80)})

// init the wave udpate errors
export type WaveUpdateErrors = {
    tournament_id? : string[],
    old_identifier?: string[], 
    new_identifier? : string[]
}

// this functions allows us to update the data of the waves
export async function updateWave(tournament_id : number, old_identifier: string, new_identifier: string) : Promise<MutationResponse<void, WaveUpdateErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parsing the wave update schema
    const result = WaveUpdateSchema.safeParse({
        tournament_id : tournament_id,
        old_identifier : old_identifier,
        new_identifier : new_identifier
    })

    // checking for any errors
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    // inserting the new data in the wave table 
    const {data, error} = await supabase.rpc('update_wave', {
        w_tournament_id : result.data.tournament_id,
        w_old_identifier : result.data.old_identifier,
        w_new_identifier : result.data.new_identifier
    })

    // checking if the insert gave any errors 
    if (error) {
        throw new Error("Wave Update Transaction Failed:" + error.details + " " + error.message)
    }

    // returning success
    return {
        success : true,
    }
}

// this function deletes a wave from the db
export async function deleteWave(tournament_id : number, identifier : string) {
    
    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // deleting wave from db
    const {error} = await supabase.from('waves').delete().eq('tournament_id', tournament_id).eq('identifier', identifier)
    if (error) {
        throw new Error("DB Error while trying to delete from Waves" + error.details + " " + error.message)
    }

    // returns sucess
    return {
        success : true
    }
}
