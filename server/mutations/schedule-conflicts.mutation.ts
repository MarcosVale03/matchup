'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types"; 

// creating schedule conflict schema with objects
const ScheduleConflictInsertSchema = z.object({
    tournament_id : z.number().int().positive(),
    user_id : z.string().uuid(),
    start_time : z.string().datetime(),
    end_time : z.string().datetime(),
})

// init the schedule conflict insert errors
export type ScheduleConflictInsertErrors = {
    tournament_id? : string[],
    user_id? : string[],
    start_time? : string[],
    end_time? : string[]
}

// this function inserts the schedule conflicts into the table
export async function insertScheduleConflicts(tournament_id : number, user_id : string, start_time : string, end_time : string): Promise<MutationResponse<void, ScheduleConflictInsertErrors>> {

    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parses schedule conflict insert schema
    const result = ScheduleConflictInsertSchema.safeParse({
        tournament_id : tournament_id,
        user_id : user_id,
        start_time : start_time,
        end_time : end_time
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
       
    // inserts data into schedule conflict table 
    const {data, error} = await supabase.rpc('insert_schedule_conflict', {
        s_tournament_id : result.data.tournament_id,
        s_user_id : result.data.user_id,
        s_start_time : result.data.start_time,
        s_end_time : result.data.end_time
    })

    // checks if inserting gave any errors 
    if (error) {
        throw new Error("Schedule Conflict Insert Transaction Failed: " + error.details + " " + error.message)
    }

    // returns success
    return {
        success: true,
    }

}

// creating schedule conflict update schema with objects
const ScheduleConflictUpdateSchema = z.object({
    id : z.number().int().positive(),
    tournament_id : z.number().int().positive(),
    user_id : z.string().uuid(),
    start_time : z.string().datetime(),
    end_time : z.string().datetime(),
})

// init the schedule conflict update errors 
export type ScheuleConflictUpdateErrors = {
    id? : string[],
    tournament_id? : string[],
    user_id? : string[],
    start_time? : string[],
    end_time? : string[]
}

// this function allows us to update schedule conflicts table
export async function updateScheduleConflict(id : number, tournament_id : number, user_id : string, start_time : string, end_time : string): Promise<MutationResponse<void, ScheuleConflictUpdateErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parsing the schedule conflict update schema
    const result = ScheduleConflictUpdateSchema.safeParse({
        id : id,
        tournament_id : tournament_id,
        user_id : user_id,
        start_time : start_time,
        end_time : end_time
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

    const {data, error} = await supabase.rpc('update_schedule_conflict', {
        s_id : result.data.id,
        s_tournament_id : result.data.tournament_id,
        s_user_id : result.data.user_id,
        s_start_time : result.data.start_time,
        s_end_time : result.data.end_time
    })

    // checking if the insert gave any errors 
    if (error) {
        throw new Error("Schedule Conflict Update Transaction Failed:" + error.details + " " + error.message)
    }

    // returning success
    return {
        success : true,
    }
    
}

// this fucntion deletes a schedule conflict from the db
export async function deleteScheduleConflict(id : number) {
    
    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // deleting schedule conflict from db
    const {error} = await supabase.from('schedule_conflicts').delete().eq('id', id)
    if (error) {
        throw new Error("DB Error while trying to delete from Schedule Conflicts" + error.details + " " + error.message)
    }

    // returns sucess
    return {
        success : true
    }   
}

