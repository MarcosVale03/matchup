'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

import {Database} from "@/lib/types/db.types";

type Event = Database["public"]["Tables"]["events"]["Row"]

export async function fetchEventsFromTournamentId(tournamentId: number): Promise<Event[]> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('events').select().eq('tournament_id', tournamentId)
    if (error) {
        throw new Error("DB error while trying to query events: " + error.details + " " + error.message)
    }

    return data
}