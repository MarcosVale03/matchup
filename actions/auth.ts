'use server'

import {createClient} from "@/server/db/server"
import { redirect } from "next/navigation"
import {cookies} from 'next/headers'

export async function signUp(email: string, password: string, firstName: string, lastName: string, displayName: string, prefix?: string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {error} = await supabase.auth.signUp({email, password, options: {data: {
                first_name: firstName,
                last_name: lastName,
                display_name: displayName,
                ...(prefix && { prefix: prefix })
            }}})

    if (error) {
        return {
            success: false,
            error: error.message,
        }
    }

    return {
        success: true,
        message: "Check your email for confirmation link"
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
