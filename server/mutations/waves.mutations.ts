'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types";

const WaveInsertSchema = z.object({
    tournament_id: z.number().int().positive(),
    identifier: z.string().min(1).max(80),
})

export type WaveInsertErrors = {
    tournament_id?: string[],
    identifier?: string[]
}

export async function insertWave(tournament_id : number, identifier: string) : Promise<MutationResponse<void, WaveInsertErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = WaveInsertSchema.safeParse({
        tournament_id : tournament_id, 
        identifier : identifier
    })

    
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }
    // getting error supabase.rpc() might be because I havent made the other files
    const {data, error} = await supabase.rpc('insert_wave', {
        w_tournament_id : result.data.tournament_id,
        w_identifier : result.data.identifier
    })

    if (error) {
        throw new Error("Wave Insert Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
    }
}

const WaveUpdateSchema = z.object({
    tournament_id : z.number().int().positive(), 
    old_identifier: z.string().min(1).max(80),
    new_identifier: z.string().min(1).max(80)})

export type WaveUpdateErrors = {
    tournament_id? : string[],
    old_identifier?: string[], 
    new_identifier? : string[]
}

export async function updateWave(tournament_id : number, old_identifier: string, new_identifier: string) : Promise<MutationResponse<void, WaveUpdateErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = WaveUpdateSchema.safeParse({
        tournament_id : tournament_id,
        old_identifier : old_identifier,
        new_identifier : new_identifier
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    const {data, error} = await supabase.rpc('update_wave', {
        w_tournament_id : result.data.tournament_id,
        w_old_identifier : result.data.old_identifier,
        w_new_identifier : result.data.new_identifier
    })

    if (error) {
        throw new Error("Wave Update Transaction Failed:" + error.details + " " + error.message)
    }

    return {
        success : true,
    }
}

export async function deleteWave(tournament_id : number, identifier : string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    const {error} = await supabase.from('waves').delete().eq('tournament_id', tournament_id).eq('identifier', identifier)
    if (error) {
        throw new Error("DB Error while trying to delete from Waves" + error.details + " " + error.message)
    }
    return {
        success : true
    }
}
