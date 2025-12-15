'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"

import {QueryResponse} from "@/lib/types/types";
import {isoToDateObj} from "@/lib/types/zod.types";

const FetchTournamentSchema = z.array(z.object({
    id: z.number(),
    name: z.string().min(3).max(80),
    slug: z.string().min(3).max(80),
    start_time: isoToDateObj,
    end_time: isoToDateObj,
    home_page: z.string()
}))

type Tournaments = z.infer<typeof FetchTournamentSchema>

export async function fetchTournaments(searchQuery: string = "", startAfter: Date = new Date(0)): Promise<QueryResponse<Tournaments>> {
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
            success: false,
            message: error.message
        }
    }

    const result = FetchTournamentSchema.safeParse(data)
    if (!result.success) {
        return {
            success: false,
            message: z.prettifyError(result.error)
        }
    }

    return {
        success: true,
        data: result.data
    }
}