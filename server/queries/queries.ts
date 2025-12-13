'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'

import {Database} from "@/server/db/db.types";

type QueryResponse<T> = {
    status: "success" | "error",
    data?: T,
    message?: string
}

type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];

export async function fetchTournaments(searchQuery: string = "", startAfter: Date = new Date(0)): Promise<QueryResponse<Tournament[]>> {
    /**
     * @param {string}  searchQuery     Query placed within the search bar. Used to perform a websearch of the table.
     *                                  Default = ""
     * @param {Date}    startAfter      Will only return tournament in which start_time is after the date in startAfter.
     *                                  Default = new Date(0) (Unix epoch)
     */
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = searchQuery ?
        await supabase.from('tournaments').select().gt('start_time', startAfter.toISOString()).textSearch(
        'tournaments', searchQuery, {
            type: "websearch",
            config: "english"
        }) :
        await supabase.from('tournaments').select().gt('start_time', startAfter.toISOString())

    if (error) {
        return {
            status: "error",
            message: error.message
        }
    }

    return {
        status: "success",
        data: data
    }
}