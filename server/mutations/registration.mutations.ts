import {z} from "zod";
import {doesTournamentExist} from "@/server/queries/tournaments.queries";
import {doesEventExist} from "@/server/queries/events.queries";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

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
        userId: userId
    })

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Registration Transaction Failed: " + error.details + " | " + error.message)
    }

    return {
        success: true
    }
}