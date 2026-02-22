'use server'

import {createClient} from "@/server/db/server"
import { redirect } from "next/navigation"
import {cookies} from 'next/headers'

// this fucntions signs up the user
export async function signUp(email: string, password: string, firstName: string, lastName: string, displayName: string, prefix: string) {
    // creates client
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    // uses supabase built in auth sign up method with our specificed arguments
    const {error} = await supabase.auth.signUp({email, password, options: {data: {
                first_name: firstName,
                last_name: lastName,
                display_name: displayName,
                prefix: prefix
            }}})

    // checks if we ran into any errors
    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    // redirect the user to the verify email page
    redirect("/verify-email");
}

// this function allows the user to sign in with their email and password
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

// this functions allows the user to log out of their profile
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