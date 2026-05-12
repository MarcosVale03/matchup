'use client'
import {FetchBracketResponse, MatchResponse} from "@/server/queries/brackets.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ChangeEvent, FormEventHandler, MouseEventHandler, useEffect, useState} from "react";
import {FetchEventsFromTournamentIdResponse} from "@/server/queries/events.queries";
import {FetchBracketPhasesResponse, FetchPhaseGroupsResponse} from "@/server/queries/phases.queries";
import {reportScores} from "@/server/mutations/reporting.mutations";

const CARD_WIDTH = 200;
const COLUMN_WIDTH = 244;
const GUTTER = (COLUMN_WIDTH - CARD_WIDTH) / 2; // 22

function roundLabel(roundNum: number, totalRounds: number): string {
    if (roundNum === 1) return "Finals";
    if (roundNum === 2) return "Semifinals";
    if (roundNum === 3) return "Quarterfinals";
    return `Round ${totalRounds - roundNum + 1}`;
}

function Slot({
    name,
    prefix,
    score,
    isWinner,
    seed,
    showSeed
}: {
    name: string;
    prefix: string;
    score: number | null;
    isWinner: boolean;
    seed: number | null;
    showSeed: boolean;
}) {
    const isTBD = name === "TBD";

    return (
        <div
            className={`flex items-stretch gap-2 border-l-4 transition-colors
                ${isWinner ? "bg-primary/10 border-primary" : "border-transparent"}
                ${isTBD ? "text-gray-400 italic" : ""}`}
        >
            {showSeed && (
                <span
                    className={`text-sm border-r p-2 border-gray-500 shrink-0 flex items-center justify-center w-9 tabular-nums
                        ${isWinner ? "font-bold text-primary" : "text-gray-500"}`}
                >
                    {seed ?? ""}
                </span>
            )}

            <p
                className={`text-sm truncate min-w-0 flex-1 self-center py-2
                    ${!showSeed ? "pl-2" : ""}
                    ${isWinner ? "font-semibold text-primary" : "text-gray-800"}`}
            >
                {prefix && (
                    <span className="mr-1 text-xs font-bold opacity-70">{prefix}</span>
                )}
                {name}
            </p>

            {score != null && (
                <span
                    className={`text-sm font-bold shrink-0 tabular-nums pr-2 self-center
                        ${isWinner ? "text-primary" : "text-gray-400"}`}
                >
                    {score}
                </span>
            )}
        </div>
    );
}

function MatchNode({ match, matchIndex, isLast, showSeeds, onClick }: {
    match: MatchResponse;
    matchIndex: number;
    isLast: boolean;
    showSeeds: boolean;
    onClick: MouseEventHandler;
}) {
    const sortedSlots = [...match.match_slots].sort((a, b) => a.slot_num - b.slot_num);
    const slot1 = sortedSlots.find(s => s.slot_num === 1) ?? sortedSlots[0];
    const slot2 = sortedSlots.find(s => s.slot_num === 2) ?? sortedSlots[1];

    if (!slot1 || !slot2) {
        return (
            <div className="flex-1 flex items-center relative min-h-24 w-full">
                <div className="bg-white rounded-lg shadow-sm p-3 text-xs text-gray-500" style={{ width: CARD_WIDTH }}>
                    {match.code}: incomplete slots
                </div>
            </div>
        );
    }

    const isComplete = match.is_complete;
    const winner =
        isComplete && slot1.score !== slot2.score
            ? (slot1.score! > slot2.score! ? 1 : 2)
            : null;
    const isTopOfPair = matchIndex % 2 === 0;

    const cardRight = CARD_WIDTH;
    const midline = CARD_WIDTH + GUTTER;

    return (
        <div className="flex-1 flex items-center relative min-h-24 w-full">
            <div
                onClick={onClick}
                className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ width: CARD_WIDTH }}
            >
                <div className="absolute -top-4 -left-2 z-10 bg-gray-800 text-white text-xs font-bold px-1.5 py-0.5 rounded-md shadow-sm tracking-wide">
                    {match.code}
                </div>
                <Slot
                    name={slot1.seed?.user?.display_name ?? slot1.prereqCondition ?? "Error"}
                    prefix={slot1.seed?.user?.prefix ?? ""}
                    score={slot1.score}
                    isWinner={winner === 1}
                    seed={slot1.seed?.seed_num ?? null}
                    showSeed={showSeeds}
                />
                <div className="h-px bg-gray-200" />
                <Slot
                    name={slot2.seed?.user?.display_name ?? slot2.prereqCondition ?? "Error"}
                    prefix={slot2.seed?.user?.prefix ?? ""}
                    score={slot2.score}
                    isWinner={winner === 2}
                    seed={slot2.seed?.seed_num ?? null}
                    showSeed={showSeeds}
                />
            </div>

            {!isLast && (
                <>
                    <div
                        className="absolute h-px bg-gray-300"
                        style={{ top: '50%', left: cardRight, width: GUTTER }}
                    />
                    <div
                        className="absolute w-px bg-gray-300"
                        style={
                            isTopOfPair
                                ? { top: '50%', bottom: 0, left: midline }
                                : { top: 0, bottom: '50%', left: midline }
                        }
                    />
                    {isTopOfPair && (
                        <div
                            className="absolute h-px bg-gray-300"
                            style={{ bottom: 0, left: midline, width: GUTTER }}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default function SingleElimBracket({tournamentId, events, currEventId, bracketPhases, currBP, phaseGroups, currPG, rounds, showSeeds = true, round = null, match = null }:
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
    match: number | null }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const totalRounds = rounds.length;

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
            <div className="p-8">
                <div className="flex overflow-x-auto pl-2">
                    {rounds.map((round, roundIndex) => (
                        <div
                            key={roundIndex}
                            className="flex flex-col"
                            style={{ width: COLUMN_WIDTH, minWidth: COLUMN_WIDTH }}
                        >
                            <p
                                className="text-center font-semibold text-sm uppercase tracking-wider text-gray-500"
                                style={{ width: CARD_WIDTH }}
                            >
                                {roundLabel(round.round_num, totalRounds)}
                            </p>

                            <div className="flex flex-col flex-1">
                                {round.matches.map((match, matchIndex) => (
                                    <MatchNode
                                        key={match.code}
                                        match={match}
                                        matchIndex={matchIndex}
                                        isLast={roundIndex === rounds.length - 1}
                                        showSeeds={showSeeds}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClick(roundIndex, matchIndex);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    {((round !== null && match !== null) && rounds[round]?.matches[match] !== undefined) &&
                       <MatchPopup showSeeds={showSeeds} match={rounds[round].matches[match]}
                                   onClick={(e) => e.stopPropagation()}
                                   tournamentId={tournamentId} eventId={currEventId} phaseGroupIdentifier={currPG}
                       />}
                </div>
            </div>
        </div>
    );
}


function MatchPopup({ onClick, match, showSeeds, tournamentId, eventId, phaseGroupIdentifier }: {
    onClick: MouseEventHandler;
    match: MatchResponse;
    showSeeds: boolean;
    tournamentId: number;
    eventId: number;
    phaseGroupIdentifier: string;
}) {
    const {refresh} = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const slot1 = match.match_slots[0];
    const slot2 = match.match_slots[1];
    const [formData, setFormData] = useState({
        slot1Score: slot1.score,
        slot2Score: slot2.score,
        isCompleted: match.is_complete
    })

    useEffect(() => {
        setFormData({
            slot1Score: slot1.score,
            slot2Score: slot2.score,
            isCompleted: match.is_complete
        })
    }, [match.id, slot1.score, slot2.score, match.is_complete])

    const isComplete = match.is_complete;
    const winner = isComplete && slot1.score != slot2.score ? (slot1.score > slot2.score ? 1 : 2) : null;

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await reportScores(tournamentId, eventId, phaseGroupIdentifier, match.id, [formData.slot1Score, formData.slot2Score], formData.isCompleted)
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
            refresh()
        }
    }

    return (
        <div className="absolute bottom-2/5 right-1/3 w-1/3 h-1/3 bg-gray-100 border-4 border-primary shadow-xl rounded-3xl"
            onClick={onClick}>
            <div className='w-full h-20 grid grid-cols-2'>
                <PopupSlot
                    name={slot1.seed?.user?.display_name ?? slot1.prereqCondition ?? "Error"}
                    prefix={slot1.seed?.user?.prefix ?? ""}
                    score={slot1.score}
                    isWinner={winner == 1}
                    seed={slot1.seed?.seed_num ?? null}
                    showSeed={showSeeds}
                    slotNum={1}
                />
                <PopupSlot
                    name={slot2.seed?.user?.display_name ?? slot2.prereqCondition ?? "Error"}
                    prefix={slot2.seed?.user?.prefix ?? ""}
                    score={slot2.score}
                    isWinner={winner == 2}
                    seed={slot2.seed?.seed_num ?? null}
                    showSeed={showSeeds}
                    slotNum={2}
                />
            </div>
            <form className="w-full flex flex-col items-center justify-center mt-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 w-full m-4">
                    <input name='slot1Score' type='number' className='w-10 scale-150 justify-self-center' value={formData.slot1Score ?? 0} min={0}
                           onChange={(e) => {
                               if (!e.target.validity.valid) return;
                               setFormData({ ...formData, slot1Score: Number(e.target.value)}) }}
                    />
                    <input name='slot2Score' type='number' className='w-10 scale-150 justify-self-center' value={formData.slot2Score ?? 0} min={0}
                           onChange={(e) => {
                               if (!e.target.validity.valid) return;
                               setFormData({ ...formData, slot2Score: Number(e.target.value)}) }}
                    />
                </div>
                <div className='m-4'>
                    <input name='isComplete' id="isComplete" type='checkbox' checked={formData.isCompleted}
                           onChange={(e) => {
                               if (!e.target.validity.valid) return;
                               setFormData({ ...formData, isCompleted: e.target.checked}) }}
                    />
                    <label htmlFor="isComplete">Match Complete?</label>
                </div>
                <button type='submit' className="w-full sm:w-auto flex items-center justify-center py-1 px-16 m-4
                                       rounded-md text-base md:text-lg lg:text-xl font-jersey
                                       text-primary bg-white border-2 border-primary hover:bg-gray-200
                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        disabled={isSubmitting}
                >
                    Submit</button>
            </form>
        </div>
    );
}


function PopupSlot({
                  name,
                  prefix,
                  score,
                  isWinner,
                  seed,
                  showSeed,
                  slotNum
              }: {
    name: string;
    prefix: string;
    score: number | null;
    isWinner: boolean;
    seed: number | null;
    showSeed: boolean;
    slotNum: number;
}) {
    return (
        <div className={`flex items-center px-3 py-2 justify-between m-4 h-full
            ${isWinner ? "bg-primary/10" : ""}
            ${name === "TBD" ? "text-gray-400 italic" : ""}
            ${slotNum === 2 ? "flex-row-reverse" : ""}`}
        >
            <div className='flex flex-row items-center justify-start'>
                {showSeed && <div className={`text-sm mr-2 pr-3 border-r
                ${isWinner ? "font-bold text-primary" : "text-gray-800"}`}>
                    <p>{seed}</p>
                </div>}
                <p className={`text-sm truncate flex-1
                ${isWinner ? "font-bold text-primary" : "text-gray-800"}`}>
                    {prefix && <span className="mr-1 text-xs">{prefix}</span>}<span>{name}</span>
                </p>
            </div>

            {score != null && (
                <p className={`text-3xl mx-8 font-bold
                    ${isWinner ? "text-primary" : "text-gray-400"}`}>
                    {score}
                </p>
            )}
        </div>
    );
}
