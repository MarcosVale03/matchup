'use server'

import {z} from "zod";
import {doesTournamentExist, fetchTournamentFromId} from "@/server/queries/tournaments.queries";
import {doesEventExist, fetchEventFromEventId} from "@/server/queries/events.queries";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {sendNotification} from "@/features/notifications/send-notification";

const TournamentRegistrationSchema = z.object({
    tournamentId: z.number().positive().refine(data => doesTournamentExist(data), {error: "Tournament does not exist"}),
    eventIds: z.array(z.number().positive()),
    userId: z.string()
}).refine(data => {
    for (let i = 0; i < data.eventIds.length; i++) {
        if (!doesEventExist(data.tournamentId, data.eventIds[i])) {
            return false
        }
    }
    return true
}, {error: "Event does not exist", path: ["eventIds"]})

export async function registerUserForTournament(tournamentId: number, eventIds: number[], userId: string) {
    const result = await TournamentRegistrationSchema.safeParseAsync({
        tournamentId,
        eventIds,
        userId
    })

    // Returns errors if validation isn't successful
    if (!result.success) {
        const err = z.flattenError(result.error)
        return {
            success: false,
            formErrors: err.formErrors.concat(["Please fix below errors and try again"]),
            fieldErrors: err.fieldErrors
        }
    }

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {error} = await supabase.rpc("register_user_for_tournament", {
        tid: tournamentId,
        eids: eventIds,
        uid: userId
    })

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Registration Transaction Failed: " + error.details + " | " + error.message)
    }

    // Notify the organizer for every event the user registered for
    await notifyOrganizersOfRegistration(tournamentId, eventIds, userId)

    return {
        success: true
    }
}

async function notifyOrganizersOfRegistration(
    tournamentId: number,
    eventIds: number[],
    playerId: string
) {
    const tournamentRes = await fetchTournamentFromId(tournamentId)
    const organizerId = tournamentRes.tournament?.owner.user_id
    const tournamentName = tournamentRes.tournament?.name

    if (!organizerId || !tournamentName) return
    // Don't notify the organizer if they're the one registering
    if (organizerId === playerId) return

    // Look up the player's display name once — used for every event notification
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user: player } } = await supabase.auth.getUser()
    const playerName =
        (player?.user_metadata?.display_name as string | undefined) ??
        player?.email ??
        "A player"

    await Promise.all(eventIds.map(async (eventId) => {
        const eventRes = await fetchEventFromEventId(tournamentId, eventId)
        const eventName = eventRes.event?.name
        if (!eventName) return

        await sendNotification(organizerId, {
            type: "player_joined",
            tournamentId,
            tournamentName,
            eventId,
            eventName,
            playerName,
            playerId,
            timestamp: new Date().toISOString(),
        })
    }))
}