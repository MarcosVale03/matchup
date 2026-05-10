'use server'

import {doesTournamentExist} from "@/server/queries/tournaments.queries";
import {doesEventExist} from "@/server/queries/events.queries";
import {z} from "zod";
import {FetchSeedsResponse} from "@/server/queries/seeding.queries";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

const SeedingSchema = z.object({
    tournamentId: z.number().positive().refine(data => doesTournamentExist(data), {error: "Tournament does not exist"}),
    eventId: z.number().positive(),
    seeding: z.array(z.object({
        identifier: z.string().min(1).max(8).regex(/^\S*$/),
        seeds: z.array(z.object({
            user: z.object({
                user_id: z.uuid(),
                display_name: z.string().min(3).max(50),
                prefix: z.string().max(10).optional()
            }).nullable()
        }))
    })).pipe(z.transform(data => {
        const res: {phaseGroups: string[], seeds: (string | null)[][]} = {
            phaseGroups: [],
            seeds: []
        }
        let max = 0
        data.forEach(pg => {
            res.phaseGroups.push(pg.identifier)
            res.seeds.push(pg.seeds.map(seed => seed.user?.user_id || null))
            max = pg.seeds.length > max ? pg.seeds.length : max
        })
        // Arrays need to be padded so lengths of 2nd dimension are the same
        for (let i = 0; i < data.length; i += 1) {
            while (res.seeds[i].length < max) {
                res.seeds[i].push(null)
            }
        }

        return res
    }))
}).refine(data => doesEventExist(data.tournamentId, data.eventId),
    {error: "Event does not exist", path: ["eventIds"]})

export async function updateSeeding(tournamentId: number, eventId: number, seeding: FetchSeedsResponse) {
    const result = await SeedingSchema.safeParseAsync({
        tournamentId,
        eventId,
        seeding
    })

    // Returns errors if validation isn't successful
    if (!result.success) {
        const err = z.treeifyError(result.error)
        console.error(err)
        throw new Error("Error updating seeding: Provided data invalid.")
    }

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {error} = await supabase.rpc('update_seeding', {
        tid: result.data.tournamentId,
        eid: result.data.eventId,
        pgids: result.data.seeding.phaseGroups,
        seed_users: result.data.seeding.seeds
    })

    if (error) {
        throw new Error("Seeding Update Failed: " + error.details + " | " + error.message)
    }

    return
}