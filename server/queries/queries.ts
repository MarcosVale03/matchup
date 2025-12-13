'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'

export async function fetchTournaments(searchQuery: string = "", startAfter: Date = new Date(0)) {
    /**
     * @param {string}  searchQuery     Query placed within the search bar. Used to perform a websearch of the table.
     *                                  Default = ""
     * @param {Date}    startAfter      Will only return tournament in which start_time is after the date in startAfter.
     *                                  Default = new Date(0) (Unix epoch)
     */
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data: tournaments} = searchQuery ?
        await supabase.from('tournaments').select().gt('start_time', startAfter.toISOString()).textSearch(
        'tournaments', searchQuery, {
            type: "websearch",
            config: "english"
        }) :
        await supabase.from('tournaments').select().gt('start_time', startAfter.toISOString())

    return tournaments
}