'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

import {Database} from "@/lib/types/db.types";

type VideoGame = Database["public"]["Tables"]["video_games"]["Row"]

export async function fetchVideoGames(): Promise<VideoGame[]> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('video_games').select()
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