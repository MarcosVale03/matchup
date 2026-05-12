'use client'
import {FetchBracketResponse} from "@/server/queries/brackets.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ChangeEvent, MouseEventHandler} from "react";
import {FetchEventsFromTournamentIdResponse} from "@/server/queries/events.queries";
import {FetchBracketPhasesResponse, FetchPhaseGroupsResponse} from "@/server/queries/phases.queries";
import {MatchReportPopup} from "@/features/event-brackets/match-report-popup";

const isValidScore = (score: number | null | undefined): score is number =>
    typeof score === "number" && Number.isFinite(score) && score >= 0;

export default function AdminRoundRobinBracket({tournamentId, events, currEventId, bracketPhases, currBP, phaseGroups, currPG, rounds, showSeeds = true, round = null, match = null}:
{
    tournamentId: number,
    events: FetchEventsFromTournamentIdResponse,
    currEventId: number,
    bracketPhases: FetchBracketPhasesResponse,
    currBP: number,
    phaseGroups: FetchPhaseGroupsResponse,
    currPG: string,
    rounds: FetchBracketResponse,
    showSeeds?: boolean,
    round: number | null,
    match: number | null
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    if (rounds.length === 0) {
        return <p className="text-gray-400 text-center py-8">No bracket data yet</p>;
    }

    const handleClick = (rnum: number, mid: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('r', rnum.toString())
        params.set('m', mid.toString())
        replace(`${pathname}?${params.toString()}`);
    }

    const handleBgClick: MouseEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const params = new URLSearchParams(searchParams);
        params.delete('r')
        params.delete('m')
        replace(`${pathname}?${params.toString()}`);
    }

    const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const eid = Number(e.target.value)
        replace(`/admin/tournaments/${tournamentId}/reporting/${eid}`);
    }
    const handleBPChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const bpid = Number(e.target.value)
        replace(`/admin/tournaments/${tournamentId}/reporting/${currEventId}/${bpid}`);
    }
    const handlePGChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const pgid = e.target.value
        replace(`/admin/tournaments/${tournamentId}/reporting/${currEventId}/${currBP}/${pgid}`);
    }

    const orderedRounds = [...rounds].sort((a, b) => a.round_num - b.round_num);

    return (
        <div className="flex flex-col text-black" onClick={handleBgClick}>
            <div className='flex flex-wrap gap-4 items-end mx-4 mt-4'>
                <h2 className="mr-2">Reporting</h2>
                <label className="flex flex-col text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                    <select
                        defaultValue={currEventId}
                        onChange={handleEventChange}
                        className="mt-1 min-w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5
                                   text-sm text-gray-800 shadow-sm hover:border-primary
                                   focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                                   transition-colors normal-case tracking-normal cursor-pointer"
                    >
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.name}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phase
                    <select
                        defaultValue={currBP}
                        onChange={handleBPChange}
                        className="mt-1 min-w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5
                                   text-sm text-gray-800 shadow-sm hover:border-primary
                                   focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                                   transition-colors normal-case tracking-normal cursor-pointer"
                    >
                        {bracketPhases.map(bp => (
                            <option key={bp.id} value={bp.id}>{bp.name}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pool
                    <select
                        defaultValue={currPG}
                        onChange={handlePGChange}
                        className="mt-1 min-w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5
                                   text-sm text-gray-800 shadow-sm hover:border-primary
                                   focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                                   transition-colors normal-case tracking-normal cursor-pointer"
                    >
                        {phaseGroups.map(pg => (
                            <option key={pg.identifier} value={pg.identifier}>Pool {pg.identifier}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="">Schedule</h3>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-600">
                            {orderedRounds.length} {orderedRounds.length === 1 ? "Round" : "Rounds"}
                        </span>
                    </div>

                    <ol className="flex flex-col">
                        {orderedRounds.map((roundEntry, roundIndex) => (
                            <li
                                key={roundEntry.round_num}
                                className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 px-6 py-6 border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex sm:flex-col items-center gap-3 sm:w-14 shrink-0">
                                    <span className="relative z-1 inline-flex items-center justify-center
                                                     w-14 h-14 rounded-full bg-primary shadow-md
                                                     font-jersey text-3xl text-white">
                                        {roundEntry.round_num}
                                    </span>
                                    <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                                        Round
                                    </span>
                                </div>

                                <div className="flex-1 grid gap-2 sm:gap-3 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                                    {roundEntry.matches.map((m, matchIndex) => {
                                        if (m.match_slots.length !== 2) return null;
                                        const [slot1, slot2] = m.match_slots;

                                        const hasScores =
                                            isValidScore(slot1.score) &&
                                            isValidScore(slot2.score);

                                        const winningSide: 1 | 2 | null = m.is_complete && hasScores
                                            ? slot1.score === slot2.score
                                                ? null
                                                : (slot1.score as number) > (slot2.score as number) ? 1 : 2
                                            : null;

                                        const name1 = slot1.seed?.user?.display_name ?? "TBD";
                                        const name2 = slot2.seed?.user?.display_name ?? "TBD";

                                        const nameClass = (side: 1 | 2) =>
                                            winningSide === side
                                                ? "text-primary font-semibold"
                                                : m.is_complete && winningSide !== null
                                                    ? "text-gray-400 line-through decoration-gray-300"
                                                    : "text-gray-700";

                                        return (
                                            <button
                                                key={m.code}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClick(roundIndex, matchIndex);
                                                }}
                                                className="group relative rounded-xl bg-gray-50 hover:bg-white
                                                           border border-gray-100 hover:border-primary/30
                                                           transition-colors px-3 py-2
                                                           flex items-center gap-3 text-left cursor-pointer"
                                            >
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 tabular-nums shrink-0">
                                                    {m.code}
                                                </span>

                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2 text-sm">
                                                        <span className={`truncate ${nameClass(1)}`}>{name1}</span>
                                                        {hasScores && (
                                                            <span className={`tabular-nums font-bold ${winningSide === 1 ? "text-primary" : "text-gray-400"}`}>
                                                                {slot1.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 text-sm">
                                                        <span className={`truncate ${nameClass(2)}`}>{name2}</span>
                                                        {hasScores && (
                                                            <span className={`tabular-nums font-bold ${winningSide === 2 ? "text-primary" : "text-gray-400"}`}>
                                                                {slot2.score}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {!m.is_complete && (
                                                    <span className="absolute -top-2 -right-2 text-[9px] uppercase
                                                                     tracking-wider font-bold text-white bg-gray-400 rounded-full
                                                                     px-2 py-px">
                                                        LIVE
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {((round !== null && match !== null) && orderedRounds[round]?.matches[match] !== undefined) &&
                <MatchReportPopup
                    showSeeds={showSeeds}
                    match={orderedRounds[round].matches[match]}
                    onClickAction={handleBgClick}
                    tournamentId={tournamentId}
                    eventId={currEventId}
                    phaseGroupIdentifier={currPG}
                />}
        </div>
    );
}
