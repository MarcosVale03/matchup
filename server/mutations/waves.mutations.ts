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

export async function insertWaves(tournament_id : number, identifier: string) : Promise<MutationResponse<number, WaveInsertErrors>> {
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
        data: data
    }
}

const WaveUpdateSchema = WaveInsertSchema.safeExtend({id : z.number()})

export type WaveUpdateErrors = {
    tournament_id? : string[],
    identifier? : string[]
}

export async function updateWave(tournament_id : number, identifier: string) : Promise<MutationResponse<number, WaveUpdateErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = WaveUpdateSchema.safeParse({
        tournament_id : tournament_id,
        identifier : identifier
    })
}
