import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";

export type FetchSeedsResponse = {
    identifier: string;
    seeds: {
        user: {
            user_id: string;
            display_name: string;
            prefix: string | null;
        } | null;
    }[]
}[]

export async function fetchSeedsFromEvent(tournamentId: number, eventId: number):
    Promise<FetchSeedsResponse>{
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('phase_groups').select(`
        identifier,
        seeds(
            user:users(
                user_id,
                display_name,
                prefix
            )
        )
    `)
        .eq('tournament_id', tournamentId)
        .eq('event_id', eventId)
        .eq('bracket_phase_id', 1)
        .order('identifier', {ascending: true})
        .order('seed_num', {referencedTable: 'seeds', ascending: true})

    if (error || !data) {
        throw new Error("DB error while trying to query rounds: " + error.details + " " + error.message)
    }

    return data
}