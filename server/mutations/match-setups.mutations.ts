'use server'

import * as z from "zod"
import { createClient } from "@/server/db/server"
import { cookies } from 'next/headers'
import { MutationResponse } from "@/lib/types/types"

// creating admins insert schema with objects
const AdminInsertSchema = z.object({
    tournament_id : z.number().int().positive(),
    user_id : z.string().uuid(),
    permission_level : z.number().int().min(0).max(4),
    //email : z.string().email()
})

// init the admin insert errors
export type AdminInsertErrors = {
    tournament_id? : string[],
    user_id? : string[],
    permission_level? : string[]
    //email? : string[]
}

// function inserts adminds into the table in the db
export async function insertAdmin(tournament_id : number, user_id : string, permission_level : number) : Promise<MutationResponse<void, AdminInsertErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parse admin insert schema
    const result = AdminInsertSchema.safeParse({
        tournament_id : tournament_id,
        user_id : user_id,
        permission_level : permission_level,
        //email : email
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

    // insert data into adminds table
    const {data, error} = await supabase.rpc('insert_admin', {
        a_tournament_id : result.data.tournament_id,
        a_user_id : result.data.user_id,
        a_permission_level : result.data.permission_level,
        //a_admin_email : result.data.email
    })

    // checks if inserting gave any errors 
    if (error) {
        throw new Error("Admin Insert Transaction Failed: " + error.details + " " + error.message)
    }

    // returns success
    return {
        success: true,
    }
}


// creating admin update schema with objects
const AdminUpdateSchema = z.object({
    tournament_id : z.number().int().positive(),
    user_id : z.string().uuid(),
    permission_level : z.number().int().min(0).max(4),
    //email : z.string().email()
})

// init the admin udpate errors
export type AdminUpdateErrors = {
    tournament_id? : string[],
    user_id? : string[],
    permission_level? : string[]
    //email? : string[]
}

// this function allows us to update the adminds data
export async function updateAdmin(tournament_id : number, user_id : string, permission_level : number, email : string) : Promise<MutationResponse<void, AdminUpdateErrors>> {
    
    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parse admin insert schema
    const result = AdminUpdateSchema.safeParse({
        tournament_id : tournament_id,
        user_id : user_id,
        permission_level : permission_level,
        //email : email
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

    // inserting the new data in admin table
    const {data, error} = await supabase.rpc('update_admins', {
        a_tournament_id : result.data.tournament_id,
        a_user_id : result.data.user_id,
        a_permission_level : result.data.permission_level,
        //a_admin_email : email,
    })

    // checking if the insert gave any errors 
    if (error) {
        throw new Error("Admin Update Transaction Failed:" + error.details + " " + error.message)
    }

    // returning success
    return {
        success : true,
    }
}

export async function deleteAdmins(tournament_id : number) {

    // creating client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    
    // deleting wave from db
    const {count, error} = await supabase.from('admins').delete().eq('tournament_id', tournament_id).neq('permission_level', 0)
    if (error) {
        throw new Error("DB Error while trying to delete from Admins" + error.details + " " + error.message)
    }
    // returns sucess
    return {
        success : true
    }

}