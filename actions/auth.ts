'use server'

import { createClient} from "@/server/db/server"
import {cookies} from 'next/headers'

export async function signUp(username: string, email: string, password: string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {error} = await supabase.auth.signUp({email, password, options: {data: {username,}}}) 

    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    return {
        success: true,
        message: "Check your email for confirmation link",
    }
}

export async function signInWithEmail(email: string, password: string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithPassword({email: email, password: password,})

     if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    return {
        success: true,
        message: "Successfully logged in!",
    }

}