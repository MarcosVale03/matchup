'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

import {Database} from "@/lib/types/db.types";

type VideoGame = Database["public"]["Tables"]["video_games"]["Row"]

/**
 * Returns a set number of video games in the database according to the search query
 * @param searchQuery - Query entered by the user to search for a video game
 * @param page -
 * @param perPage
 */
export async function fetchVideoGames(searchQuery: string = "", page: number = 0, perPage: number = 10): Promise<VideoGame[]> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const pageStart = page * perPage
    const pageEnd = pageStart + perPage - 1

    let query = supabase.from('video_games').select().range(pageStart, pageEnd).order('name')

    // Substring match — typeahead needs to match partial words ("stree" → "Street Fighter 6"),
    // which websearch tsquery cannot do until a whole word is reached.
    query = searchQuery ? query.ilike('name', `%${searchQuery}%`) : query

    const {data, error} = await query
    if (error) {
        throw new Error("DB error while trying to query video_games: " + error.details + " " + error.message)
    }

    return data
}

export async function fetchPlatformsFromVideoGame(videoGame: string): Promise<{ gaming_platform_name: string }[]> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('event_video_games').select('gaming_platform_name').eq('video_game_name', videoGame)
    if (error) {
        throw new Error("DB error while trying to query event_video_games: " + error.details + " " + error.message)
    }

    return data
}