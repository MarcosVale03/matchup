'use server'

import * as z from "zod";
import {DateToISOStr} from "@/lib/types/zod.types";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {MutationResponse} from "@/lib/types/types";
import {doesTournamentExist} from "@/server/queries/tournaments.queries";
import {doesEventExist} from "@/server/queries/events.queries";

const EventInsertSchema = z.object({
    tournament_id: z.number().refine(data => doesTournamentExist(data), {error: "Tournament ID does not exist"}),
    name: z.string().min(3).max(80),
    times: z.object({
        start_time: DateToISOStr,
        end_time: DateToISOStr
    }).refine(data => data.start_time < data.end_time, {error: "Start time must be before end time"}),
    price: z.number(),
    game_and_platform: z.object({
        video_game: z.string(),
        platform: z.string()
    }),
    teams_allowed: z.boolean(),
    max_team_size: z.optional(z.number()),
}).refine(data => !data.teams_allowed || data.max_team_size, {error: "You must specify a max team size for a team event", path: ["max_team_size"]})
    .refine(data => isGamePlatformValid(data.game_and_platform.video_game, data.game_and_platform.platform), {error: "Invalid video game and platform combination", path:["game_and_platform"]})

export type EventInsertErrors = {
    tournament_id?: string[]
    name?: string[],
    times?: string[],
    price?: string[],
    game_and_platform?: string[],
    teams_allowed?: string[],
    max_team_size?: string[],
    is_online?: string[],
    location?: string[],
}

/**
 * Inserts a new event for the given tournament in the database. Also inserts a starting bracket phase and phase group
 * @param tournamentId - The id of the tournament that contains the new event
 * @param name - The name of the event
 * @param startTime - The start time of the event
 * @param endTime - The end time of the event. Must be later than the start time
 * @param price - The entry fee for the event
 * @param videoGame - The video game that the event is played on
 * @param platform - The gaming platform/console that the event is played on
 * @param teamsAllowed - True if teams are allowed in the tournament. False if teams are not allowed
 * @param maxTeamSize - The maximum size for a team within a tournament. Must be specified if teamsAllowed is true
 *
 * @returns Response from mutation
 * @returns success - True if the DB mutation is successful. False if it fails.
 * @returns formErrors - Optional. Contains error messages that apply to the whole form.
 * @returns fieldErrors - Optional. Contains error messages that apply to specific parts of the form.
 * @returns data - Returns event id of inserted event if success is true
 */

export async function insertEvent(tournamentId: number, name: string, startTime: Date, endTime: Date, price: number,
                                  videoGame: string, platform: string, teamsAllowed: boolean, maxTeamSize?: number):
    Promise<MutationResponse<number, EventInsertErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = await EventInsertSchema.safeParseAsync({
        tournament_id: tournamentId,
        name: name,
        times: {
            start_time: startTime,
            end_time: endTime,
        },
        price: price,
        game_and_platform: {
            video_game: videoGame,
            platform: platform,
        },
        teams_allowed: teamsAllowed,
        max_team_size: maxTeamSize,
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix above errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    const {data, error} = await supabase.rpc('insert_event', {
        e_tournament_id: result.data.tournament_id,
        e_name: result.data.name,
        e_start_time: result.data.times.start_time,
        e_end_time: result.data.times.end_time,
        e_price: result.data.price,
        e_video_game_name: result.data.game_and_platform.video_game,
        e_gaming_platform_name: result.data.game_and_platform.platform,
        e_teams_allowed: result.data.teams_allowed,
        e_max_team_size: result.data.max_team_size,
    })

    if (error) {
        throw new Error("Event Insert Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
        data: data
    }
}

async function isGamePlatformValid(videoGame: string, platform: string) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('event_video_games').select()
        .eq('video_game_name', videoGame).eq('gaming_platform_name', platform)
    if (error || !data) {
        throw new Error("DB error while querying event_video_games: " + error.details + " " + error.message)
    }
    return data.length > 0
}

const EventUpdateSchema = EventInsertSchema.safeExtend({id: z.number()})
    .refine(data => doesEventExist(data.tournament_id, data.id), {error: "Event ID doesn't exist", path: ["id"]})

export type EventUpdateErrors = {
    tournament_id?: string[],
    id?: string[],
    name?: string[],
    times?: string[],
    price?: string[],
    game_and_platform?: string[],
    teams_allowed?: string[],
    max_team_size?: string[],
    is_online?: string[],
    location?: string[],
}


/**
 * Inserts a new event for the given tournament in the database. Also inserts a starting bracket phase and phase group
 * @param tournamentId - The id of the tournament that contains the event
 * @param eventId - The id of the event within the tournament
 * @param name - The name of the event
 * @param startTime - The start time of the event
 * @param endTime - The end time of the event. Must be later than the start time
 * @param price - The entry fee for the event
 * @param videoGame - The video game that the event is played on
 * @param platform - The gaming platform/console that the event is played on
 * @param teamsAllowed - True if teams are allowed in the tournament. False if teams are not allowed
 * @param maxTeamSize - The maximum size for a team within a tournament. Must be specified if teamsAllowed is true
 *
 * @returns Response from mutation
 * @returns success - True if the DB mutation is successful. False if it fails.
 * @returns formErrors - Optional. Contains error messages that apply to the whole form.
 * @returns fieldErrors - Optional. Contains error messages that apply to specific parts of the form.
 * @returns data - Returns event id of inserted event if success is true
 */

export async function updateEvent(tournamentId: number, eventId: number, name: string, startTime: Date, endTime: Date, price: number,
                                  videoGame: string, platform: string, teamsAllowed: boolean, maxTeamSize?: number):
    Promise<MutationResponse<number, EventUpdateErrors>> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const result = await EventUpdateSchema.safeParseAsync({
        tournament_id: tournamentId,
        id: eventId,
        name: name,
        times: {
            start_time: startTime,
            end_time: endTime,
        },
        price: price,
        game_and_platform: {
            video_game: videoGame,
            platform: platform,
        },
        teams_allowed: teamsAllowed,
        max_team_size: maxTeamSize,
    })

    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix above errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }


    const {data, error} = await supabase.rpc('update_event', {
        e_tournament_id: result.data.tournament_id,
        e_id: result.data.id,
        e_name: result.data.name,
        e_start_time: result.data.times.start_time,
        e_end_time: result.data.times.end_time,
        e_price: result.data.price,
        e_video_game_name: result.data.game_and_platform.video_game,
        e_gaming_platform_name: result.data.game_and_platform.platform,
        e_teams_allowed: result.data.teams_allowed,
        e_max_team_size: result.data.max_team_size,
    })

    if (error) {
        throw new Error("Event Update Transaction Failed: " + error.details + " " + error.message)
    }

    return {
        success: true,
        data: data
    }
}



/**
 * Deletes a given tournament from the database.
 * @param tournamentId - ID of the parent tournament
 * @param eventId - ID of the event within the tournament to be deleted
 *
 * @returns Response from mutation.
 * @returns success - True if the DB mutation is successful. False if there are invalid parameters.
 *
 * @throws - Will throw an exception if an error occurs while entering data into the database.
 */
export async function deleteEvent(tournamentId: number, eventId: number) {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    if (!(await doesEventExist(tournamentId, eventId))) {
        return {
            success: false
        }
    }

    const {error} = await supabase.from('events').delete().eq('tournament_id', tournamentId).eq('id', eventId)
    if (error) {
        throw new Error("DB error while trying to delete from tournaments: " + error.details + " " + error.message)
    }
    return {
        success: true
    }
}