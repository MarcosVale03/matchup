'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"
import {MutationResponse} from "@/lib/types/types";

// creating user update schema
const UserUpdateSchema = z.object({
    prefix: z.string().max(20).optional().nullable(),
    display_name: z.string().min(1).max(50),
    first_name: z.string().min(1).max(50),
    last_name: z.string().min(1).max(50),
    state: z.string().max(50).optional().nullable(),
    country: z.string().max(50).optional().nullable(),
    show_results : z.boolean(),

})

// init user update errors
export type UserUpdateErrors = {
    prefix? : string[],
    display_name? : string[],
    first_name? : string[],
    last_name? : string[],
    state? : string[],
    country? : string[],
    show_results? : string[],

}

export async function updateUser(
    prefix : string, 
    display_name : string, 
    first_name : string, 
    last_name : string, 
    state : string, 
    country : string,
    show_results : boolean,

): Promise<MutationResponse<void, UserUpdateErrors>> {

    // creating client 
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // parsing the user update schema
    const result = UserUpdateSchema.safeParse({
        prefix : prefix,
        display_name : display_name,
        first_name : first_name,
        last_name : last_name,
        state : state, 
        country : country,
        show_results : show_results,

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

    // inserting new data into users table
    const {data, error} = await supabase.rpc('update_user', {
        u_prefix : result.data.prefix ?? "",
        u_display_name : result.data.display_name,
        u_first_name : result.data.first_name,
        u_last_name : result.data.last_name,
        u_state : result.data.state ?? "",
        u_country : result.data.country ?? "",
        u_show_results : result.data.show_results,
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