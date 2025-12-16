'use server'

import * as z from "zod";
import {DateToISOStr, LocationSchema} from "@/lib/types/zod.types";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {SupabaseClient} from "@supabase/supabase-js";

const EventInsertSchema = z.object({
    tournament_id: z.number(),
    name: z.string().min(3).max(80),
    times: z.object({
        start_time: DateToISOStr,
        end_time: DateToISOStr
    }).refine(data => data.start_time < data.end_time, {error: "Start time must be before end time"}),
    price: z.number(),
    video_game: z.string(),
    platform: z.string(),
    teams_allowed: z.boolean(),
    max_team_size: z.optional(z.number()),
    is_online: z.boolean(),
    location: z.optional(LocationSchema),
}).superRefine((data, ctx) => {
    if (!(data.is_online || data.location)) {
        ctx.addIssue({
            code: "custom",
            message: "Need location for offline event",
            input: data.location,
            path: ["location"]
        })
    }

    if (data.teams_allowed && !data.max_team_size) {
        ctx.addIssue({
            code: "custom",
            message: "Need max team size for team event",
            input: data.max_team_size,
            path: ["max_team_size"]
        })
    }
})

export type EventInsertErrors = {
    tournament_id?: string[]
    name?: string[],
    times?: string[],
    price?: string[],
    video_game?: string[],
    platform?: string[],
    teams_allowed?: string[],
    max_team_size?: string[],
    is_online?: string[],
    location?: string[],
}

export async function insertEvent(tournamentId: number, name: string, startTime: Date, endTime: Date, price: number,
                                  videoGame: string, platform: string, teamsAllowed: boolean, isOnline: boolean, maxTeamSize?: number,
                                  location?: {
                                      maps_place_id: string,
                                      address: string,
                                      latitude: number,
                                      longitude: number
                                  }) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = EventInsertSchema.safeParse({
        tournament_id: tournamentId,
        name: name,
        times: {
            start_time: startTime,
            end_time: endTime,
        },
        price: price,
        video_game: videoGame,
        platform: platform,
        teams_allowed: teamsAllowed,
        max_team_size: maxTeamSize,
        is_online: isOnline,
        location: location
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix above errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    if (!isGamePlatformValid(supabase, result.data.video_game, result.data.platform)) {
        throw new Error("Video game and platform combination not valid.")
    }

    const {error} = await supabase.rpc('insert_event', {
        tournament_id: result.data.tournament_id,
        name: result.data.name,
        start_time: result.data.times.start_time,
        end_time: result.data.times.end_time,
        price: result.data.price,
        video_game: result.data.video_game,
        platform: result.data.platform,
        teams_allowed: result.data.teams_allowed,
        is_online: result.data.is_online,
        max_team_size: result.data.max_team_size,
        place_id: result.data.location?.maps_place_id,
        address: result.data.location?.address,
        latitude: result.data.location?.latitude,
        longitude: result.data.location?.longitude
    })

    if (error) {
        throw new Error("Event Insert Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true
    }
}

async function isGamePlatformValid(supabase: SupabaseClient, videoGame: string, platform: string) {
    const {data, error} = await supabase.from('event_video_games').select()
        .eq('video_game_name', videoGame).eq('gaming_platform_name', platform)
    if (error || !data) {
        throw new Error("DB error while querying event_video_games: " + error.details + " " + error.message)
    }
    return data.length > 0
}