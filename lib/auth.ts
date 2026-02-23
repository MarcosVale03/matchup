'use server'

import {createClient} from "@/server/db/server"
import { redirect } from "next/navigation"
import {cookies} from 'next/headers'
import * as z from 'zod'
import {MutationResponse} from "@/lib/types/types";

const UserSchema = z.object({
    email: z.email().max(254),
    password: z.string().min(8),
    first_name: z.string().min(1).max(50),
    last_name: z.string().min(1).max(50),
    display_name: z.string().min(3).max(50),
    prefix: z.string().max(10).optional()
})

type UserInsertErrors = {
    email?: string[],
    password?: string[],
    first_name?: string[],
    last_name?: string[],
    display_name?: string[],
    prefix?: string[]
}

/**
 * This function sings up the user to MatchUp
 * @param email
 * @param password
 * @param firstName
 * @param lastName
 * @param displayName
 * @param prefix
 *
 * @returns Response from mutation.
 * @returns success - True if signing up the user is successful. False if there are invalid parameters.
 * @returns formErrors - Optional. Contains error messages that apply to the whole form.
 * @returns fieldErrors - Optional. Contains error messages that apply to specific parts of the form.
 *
 * @throws - Will throw an exception if an error occurs while entering data into the database.
 */
export async function signUp(email: string, password: string, firstName: string, lastName: string, displayName: string, prefix: string):
    Promise<MutationResponse<null, UserInsertErrors>> {
    // creates client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // Validates user data with zod schema
    const result = UserSchema.safeParse({
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        prefix: prefix
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }
    
    const {email: validatedEmail, password: validatedPass, ...data} = result.data


    // uses supabase built in auth sign up method with our specified arguments
    const {error} = await supabase.auth.signUp({email: validatedEmail, password: validatedPass, options: {data: data}})

    // checks if we ran into any errors
    if (error) {
        // Catches error if user already exists
        if (error.status === 422) {
            return {
                success: false,
                formErrors: ["This user already exists."]
            }
        }

        throw new Error("Signup Failed: " + error.message + " (" + error.status + ")")
    }

    // redirect the user to the verify email page
    redirect("/verify-email");
}

/**
  * this function allows the user to sign in with their email and password
  */
export async function signInWithEmail(email: string, password: string) {
    // creates the client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // uses supabase built in auth sign in method 
    const { error } = await supabase.auth.signInWithPassword({email: email, password: password,})
     
     // checks if we ran into any errors
     if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    redirect('/tournaments')

}

/** this functions allows the user to log out of their profile
 */
export async function signOut() {
    // creates the client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // use supabase built in auth sign out method
    const { error } = await supabase.auth.signOut() 
    
    // checks if we ran into any errors
     if (error) {
        return {
            success: false,
            message: error.message,
        }
    }

    // returns success
    return {
        success: true,
        message: "Successfully logged in!",
    }
}