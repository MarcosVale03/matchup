'use server'

import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'
import * as z from "zod"

import {QueryResponse} from "@/lib/types/types";
import {ISOToDateObj} from "@/lib/types/zod.types";

const TournamentsFetchSchema = z.array(z.object({
    id: z.number(),
    name: z.string().min(3).max(80),
    slug: z.nullable(z.string().min(3).max(80)),
    start_time: ISOToDateObj,
    end_time: ISOToDateObj,
    home_page: z.string()
}))

type TournamentsFetch = z.infer<typeof TournamentsFetchSchema>
type Tournament = TournamentsFetch[0]

export async function fetchTournaments(searchQuery: string = "", startAfter: Date = new Date(0)): Promise<QueryResponse<TournamentsFetch>> {
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
        'name', searchQuery, {
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

    const result = TournamentsFetchSchema.safeParse(data)
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


export async function fetchTournamendIdFromSlug(slug: string): Promise<QueryResponse<number>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select('id').eq('slug', slug)
    if (error) {
        if (error) {
            console.log(error)
            return {
                success: false,
                message: error.message
            }
        }
    }
    return {
        success: true,
        data: data[0].id
    }
}

export async function fetchTournamentFromId(id: number): Promise<QueryResponse<Tournament>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('tournaments').select().eq('id', id)

    if (error) {
        return {
            success: false,
            message: error.message
        }
    }

    const result = TournamentsFetchSchema.safeParse(data)
    if (!result.success) {
        return {
            success: false,
            message: z.prettifyError(result.error)
        }
    }

    return {
        success: true,
        data: result.data[0]
    }
}