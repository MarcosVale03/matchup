'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import * as z from "zod";

const ReportScoresSchema = z.object({
    tournamentId: z.number().min(0),
    eventId: z.number().min(0),
    phaseGroupIdentifier: z.string().min(1).max(8).regex(/^\S*$/),
    matchId: z.number().min(0),
    scores: z.array(z.number().min(0)),
    isComplete: z.boolean()
})

export async function reportScores(tournamentId: number, eventId: number, phaseGroupIdentifier: string, matchId: number, scores: number[], isComplete: boolean) {
    const result = ReportScoresSchema.safeParse({
        tournamentId,
        eventId,
        phaseGroupIdentifier,
        matchId,
        scores,
        isComplete,
    })

    // Returns errors if validation isn't successful
    if (!result.success) {
        const err = z.treeifyError(result.error)
        console.error(err)
        throw new Error("Error updating score: Provided data invalid.")
    }

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {error} = await supabase.rpc('report_scores', {
        tid: result.data.tournamentId,
        eid: result.data.eventId,
        pgid: result.data.phaseGroupIdentifier,
        mid: result.data.matchId,
        scores: result.data.scores,
        completed: result.data.isComplete
    })

    if (error) {
        throw new Error("Score Update Failed: " + error.details + " | " + error.message)
    }


    return
}