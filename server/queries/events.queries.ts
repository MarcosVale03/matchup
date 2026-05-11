'use server'

import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {doesTournamentExist} from "@/server/queries/tournaments.queries";

export type FetchEventsFromTournamentIdResponse = {
    tournament_id: number,
    id: number,
    name: string,
    start_time: string,
    end_time: string,
    price: number,
    video_game_name: string,
    gaming_platform_name: string,
    teams_allowed: boolean,
    max_team_size: number | null
}[]

/**
 * Returns all events for given tournament
 * @param tournamentId
 *
 * @returns Response from query
 * @returns success - True if given tournament id exists and query goes through; False if it doesn't
 * @returns events - List of events for the given tournament
 */
export async function fetchEventsFromTournamentId(tournamentId: number): Promise<{
    success: boolean,
    events?: FetchEventsFromTournamentIdResponse
}> {
    if (!(await doesTournamentExist(tournamentId))) {
        return {
            success: false
        }
    }

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('events').select().eq('tournament_id', tournamentId)

    if (error) {
        throw new Error("DB error while trying to query events: " + error.details + " " + error.message)
    }

    return {
        success: true,
        events: data
    }
}


export type FetchEventFromEventIdResponse = {
    end_time: string
    gaming_platform_name: string
    id: number
    max_team_size: number | null
    name: string
    price: number
    start_time: string
    teams_allowed: boolean
    tournament_id: number
    video_game_name: string
}


export async function fetchEventFromEventId(tournamentId: number, eventId: number): Promise<{
    success: boolean,
    event?: FetchEventFromEventIdResponse
}> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {data, error} = await supabase.from('events').select('*').eq('tournament_id', tournamentId).eq('id', eventId).maybeSingle()


    if (error) {
        throw new Error("DB error while trying to query events: " + error.details + " " + error.message)
    }

    if (!data) {
        return {
            success: false
        }
    }

    return {
        success: true,
        event: data
    }
}



export type StandingRow = {
    user_id: string,
    display_name: string,
    prefix: string | null,
    seed: number,
    placement: number | null,
    wins: number,
    losses: number,
    draws: number,
    score_for: number,
    score_against: number,
    points: number,
}

export type FetchStandingsResponse = StandingRow[]

/**
 * Returns standings for an event, computed from completed matches across all phase groups.
 * Entrants with no completed matches still appear with zeroed stats.
 */
// Points awarded per match outcome. Probably change this
const WIN_POINTS = 3
const DRAW_POINTS = 1

type EntrantStats = {
    wins: number,
    losses: number,
    draws: number,
    score_for: number,
    score_against: number,
}

function emptyStats(): EntrantStats {
    return { wins: 0, losses: 0, draws: 0, score_for: 0, score_against: 0 }
}

function throwIfQueryError(res: { error: { details: string, message: string } | null }, label: string) {
    if (res.error) {
        throw new Error(`DB error while querying standings (${label}): ${res.error.details} ${res.error.message}`)
    }
}

export async function fetchStandings(tournamentId: number, eventId: number): Promise<FetchStandingsResponse> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const [phasesRes, seedsRes, matchesRes] = await Promise.all([
        supabase
            .from('bracket_phases')
            .select('id, next_phase_id')
            .eq('tournament_id', tournamentId)
            .eq('event_id', eventId),
        supabase
            .from('seeds')
            .select(`
                seed_num,
                entrant_user_id,
                phase_group:seeds_phase_groups_fk_01(bracket_phase_id),
                user:seeds_users_fk_01(display_name, prefix),
                entrant:seeds_entrants_fk_01(placement)
            `)
            .eq('tournament_id', tournamentId)
            .eq('event_id', eventId)
            .not('entrant_user_id', 'is', null),
        supabase
            .from('matches')
            .select(`
                id,
                isComplete,
                match_slots:match_slots_matches_fk_01(
                    slot_num,
                    score,
                    seed:match_slots_seeds_fk_01(
                        entrant_user_id
                    )
                )
            `)
            .eq('tournament_id', tournamentId)
            .eq('event_id', eventId)
            .eq('isComplete', true),
    ])

    throwIfQueryError(phasesRes, 'bracket_phases')
    throwIfQueryError(seedsRes, 'seeds')
    throwIfQueryError(matchesRes, 'matches')

    const phases = phasesRes.data!
    const seeds = seedsRes.data!
    const completedMatches = matchesRes.data!

    // The root phase is the one no other phase points to via next_phase_id.
    const phaseIdsWithPredecessor = new Set(
        phases.map(phase => phase.next_phase_id).filter((id): id is number => id !== null)
    )
    const rootPhase = phases.find(phase => !phaseIdsWithPredecessor.has(phase.id))
    const rootPhaseId = rootPhase?.id ?? null

    // Only seeds in the root phase represent the entrant's initial seeding.
    const firstPhaseSeeds = seeds.filter(seed => seed.phase_group?.bracket_phase_id === rootPhaseId)

    // Aggregate stats per entrant, deduping if the same user appears on multiple seeds.
    const statsByUserId = new Map<string, EntrantStats>()
    for (const seed of firstPhaseSeeds) {
        if (seed.entrant_user_id && !statsByUserId.has(seed.entrant_user_id)) {
            statsByUserId.set(seed.entrant_user_id, emptyStats())
        }
    }

    for (const match of completedMatches) {
        // Standings calculation assumes 1v1; teams are skipped.
        if (match.match_slots.length !== 2) continue
        const [slotA, slotB] = match.match_slots
        const slotAUserId = slotA.seed?.entrant_user_id ?? null
        const slotBUserId = slotB.seed?.entrant_user_id ?? null
        if (!slotAUserId || !slotBUserId) continue
        if (slotAUserId === slotBUserId) continue

        const slotAStats = statsByUserId.get(slotAUserId)
        const slotBStats = statsByUserId.get(slotBUserId)
        if (!slotAStats || !slotBStats) continue

        const slotAScore = slotA.score ?? 0
        const slotBScore = slotB.score ?? 0
        slotAStats.score_for += slotAScore
        slotAStats.score_against += slotBScore
        slotBStats.score_for += slotBScore
        slotBStats.score_against += slotAScore

        if (slotAScore === slotBScore) {
            slotAStats.draws++
            slotBStats.draws++
        } else if (slotAScore > slotBScore) {
            slotAStats.wins++
            slotBStats.losses++
        } else {
            slotBStats.wins++
            slotAStats.losses++
        }
    }

    // Build one row per unique user; guards against duplicate seeds for the same entrant.
    const rowsByUserId = new Map<string, StandingRow>()
    for (const seed of firstPhaseSeeds) {
        if (!seed.entrant_user_id) continue
        if (rowsByUserId.has(seed.entrant_user_id)) continue
        const displayName = seed.user?.display_name ?? ""
        if (!displayName) continue

        const entrantStats = statsByUserId.get(seed.entrant_user_id) ?? emptyStats()
        rowsByUserId.set(seed.entrant_user_id, {
            user_id: seed.entrant_user_id,
            display_name: displayName,
            prefix: seed.user?.prefix ?? null,
            seed: seed.seed_num,
            placement: seed.entrant?.placement ?? null,
            wins: entrantStats.wins,
            losses: entrantStats.losses,
            draws: entrantStats.draws,
            score_for: entrantStats.score_for,
            score_against: entrantStats.score_against,
            points: entrantStats.wins * WIN_POINTS + entrantStats.draws * DRAW_POINTS,
        })
    }

    const rows = Array.from(rowsByUserId.values())

    // Sort: placement asc (nulls last), then points desc, score diff desc, seed asc
    rows.sort((rowA, rowB) => {
        if (rowA.placement !== null && rowB.placement !== null) return rowA.placement - rowB.placement
        if (rowA.placement !== null) return -1
        if (rowB.placement !== null) return 1
        if (rowA.points !== rowB.points) return rowB.points - rowA.points
        const rowAScoreDiff = rowA.score_for - rowA.score_against
        const rowBScoreDiff = rowB.score_for - rowB.score_against
        if (rowAScoreDiff !== rowBScoreDiff) return rowBScoreDiff - rowAScoreDiff
        return rowA.seed - rowB.seed
    })

    return rows
}

export type MatchSlotRow = {
    slot_num: number
    score: number | null
    display_name: string | null
    prefix: string | null
}

export type MatchRow = {
    id: number
    code: string
    round_num: number
    isComplete: boolean
    phase_group_identifier: string
    slots: MatchSlotRow[]
}

export type FetchMatchesFromEventIdResponse = MatchRow[]

/**
 * Returns all matches for the given event within a tournament,
 * including the entrants on each slot.
 */
export async function fetchMatchesFromEventId(tournamentId: number, eventId: number): Promise<{
    success: boolean,
    matches?: FetchMatchesFromEventIdResponse
}> {
    if (!(await doesEventExist(tournamentId, eventId))) {
        return { success: false }
    }

    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const { data, error } = await supabase
        .from('matches')
        .select(`
            id,
            code,
            round_num,
            isComplete,
            phase_group_identifier,
            match_slots:match_slots_matches_fk_01(
                slot_num,
                score,
                seed:match_slots_seeds_fk_01(
                    user:seeds_users_fk_01(display_name, prefix)
                )
            )
        `)
        .eq('tournament_id', tournamentId)
        .eq('event_id', eventId)
        .order('round_num', { ascending: true })

    if (error) {
        throw new Error("DB error while trying to query matches: " + error.details + " " + error.message)
    }

    const matches: FetchMatchesFromEventIdResponse = data.map(m => ({
        id: m.id,
        code: m.code,
        round_num: m.round_num,
        isComplete: m.isComplete,
        phase_group_identifier: m.phase_group_identifier,
        slots: m.match_slots
            .map(s => ({
                slot_num: s.slot_num,
                score: s.score,
                display_name: s.seed?.user?.display_name ?? null,
                prefix: s.seed?.user?.prefix ?? null,
            }))
            .sort((a, b) => a.slot_num - b.slot_num),
    }))

    return {
        success: true,
        matches,
    }
}


export async function doesEventExist(tournamentId: number, eventId: number): Promise<boolean> {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {count, error} = await supabase.from('events').select(`*`, {count: 'exact', head: true}).eq('tournament_id', tournamentId).eq('id', eventId);

    // Throws error if something goes wrong
    if (error) {
        throw new Error("Tournament Query Failed: " + error.details + " " + error.message)
    }

    if (count === null) {
        throw new Error("An unknown error occurred while querying the database.")
    }

    // Returns if query returns a value.
    return count > 0
}