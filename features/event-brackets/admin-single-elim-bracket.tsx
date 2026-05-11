'use client'
import {FetchBracketResponse, MatchResponse} from "@/server/queries/brackets.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ChangeEvent, FormEventHandler, MouseEventHandler, useState} from "react";
import {FetchEventsFromTournamentIdResponse} from "@/server/queries/events.queries";
import {FetchBracketPhasesResponse, FetchPhaseGroupsResponse} from "@/server/queries/phases.queries";
import {reportScores} from "@/server/mutations/reporting.mutations";

// Groups flat match array into rounds by parsing "R1", "R2", etc. from match identifiers,
// then returns them sorted ascending so earlier rounds render left-to-right
/*function organizeIntoRounds(matches: FetchBracketResponse[]): FetchBracketResponse[][] {
    const roundMap = new Map<number, FetchBracketResponse[]>();

    for (const match of matches) {
        const roundNum = parseInt(match.identifier.match(/R(\d+)/)?.[1] ?? "0");
        if (!roundMap.has(roundNum)) roundMap.set(roundNum, []);
        roundMap.get(roundNum)!.push(match);
    }

    return Array.from(roundMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([, matches]) => matches);
}*/

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
    return (
        <div className={`flex items-center justify-between px-3 py-2 
            ${isWinner ? "bg-primary/10" : ""}
            ${name === "TBD" ? "text-gray-400 italic" : ""}`}
        >
            <div className='flex flex-row items-center w-full justify-start'>
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
                <p className={`text-sm ml-2 font-bold
                    ${isWinner ? "text-primary" : "text-gray-400"}`}>
                    {score}
                </p>
            )}
        </div>
    );
}

function MatchNode({ match, isLast, showSeeds }: {
    match: MatchResponse;
    isLast: boolean;
    showSeeds: boolean
}) {
    const slot1 = match.match_slots[0];
    const slot2 = match.match_slots[1];

    // TODO: winner detection is hardcoded — should compare slot scores
    // once scoring is wired up 
    const isComplete = match.is_complete;
    const winner = isComplete && slot1.score != slot2.score ? (slot1.score > slot2.score ? 1 : 2) : null;

    return (
        <div className="flex items-center relative ml-4">
            {/* Connector line leading in from the previous round */}
            {/*roundIndex > 0 && <div className="w-6 h-px bg-gray-300" />*/}

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-[200px]">
                <Slot
                    name={slot1.seed?.user?.display_name ?? slot1.prereqCondition ?? "Error"}
                    prefix={slot1.seed?.user?.prefix ?? ""}
                    score={slot1.score}
                    isWinner={winner == 1}
                    seed={slot1.seed?.seed_num ?? null}
                    showSeed={showSeeds}
                />
                <div className="h-px bg-gray-200" />
                <Slot
                    name={slot2.seed?.user?.display_name ?? slot2.prereqCondition ?? "Error"}
                    prefix={slot2.seed?.user?.prefix ?? ""}
                    score={slot2.score}
                    isWinner={winner == 2}
                    seed={slot2.seed?.seed_num ?? null}
                    showSeed={showSeeds}
                />
            </div>
            {/*Match Code*/}
            <div className="absolute bg-gray-800 text-white -left-4 font-bold w-6 h-6 flex align-center justify-center">{match.code}</div>

            {/* Connector line leading out to the next round */}
            {!isLast && <div className="w-6 h-px bg-gray-300" />}
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
        <div  className="flex flex-col bg-white text-black" onClick={handleBgClick}>
            <div className='flex space-x-2 items-center m-4'>
                <h2>Seeding</h2>
                <select defaultValue={currEventId} onChange={handleEventChange} className="text-blue-600">
                    {events.map(event => (
                        <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                </select>
                <select defaultValue={currBP} onChange={handleBPChange} className="text-blue-600">
                    {bracketPhases.map(bp => (
                        <option key={bp.id} value={bp.id}>{bp.name}</option>
                    ))}
                </select>
                <select defaultValue={currPG} onChange={handlePGChange} className="text-blue-600">
                    {phaseGroups.map(pg => (
                        <option key={pg.identifier} value={pg.identifier}>Pool {pg.identifier}</option>
                    ))}
                </select>
            </div>
            <div className="flex overflow-x-auto gap-0 p-8 min-h-screen" >
                {rounds.map((round, roundIndex) => (
                    <div key={roundIndex} className="flex flex-col justify-around min-w-[220px]">
                        {/* Label the last two rounds as Finals/Semifinals, everything else numerically */}
                        <p className="text-center font-[Poppins] font-semibold text-sm text-gray-500 mb-4">
                            {round.round_num === 1
                                ? "Finals"
                                : round.round_num === 2
                                    ? "Semifinals"
                                    : `Round ${rounds.length - round.round_num + 1}`}
                        </p>
                        {/* justify-around distributes matches vertically so they align
                            with their parent match in the next round */}
                        <div className="flex flex-col justify-around flex-1 gap-4">
                            {round.matches.map((match, matchIndex) => (
                                <button key={match.code} onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick(roundIndex, matchIndex)
                                }} className='cursor-pointer'>
                                    <MatchNode
                                        match={match}
                                        isLast={roundIndex === rounds.length - 1}
                                        showSeeds={showSeeds}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {/*SHOWN MATCH*/}
                {((round !== null && match !== null) && rounds[round]?.matches[match] !== undefined) &&
                   <MatchPopup showSeeds={showSeeds} match={rounds[round].matches[match]}
                               onClick={(e) => e.stopPropagation()}
                               tournamentId={tournamentId} eventId={currEventId} phaseGroupIdentifier={currPG}
                   >

                   </MatchPopup>}
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

    // TODO: winner detection is hardcoded — should compare slot scores
    // once scoring is wired up
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
            {/* Connector line leading in from the previous round */}
            {/*roundIndex > 0 && <div className="w-6 h-px bg-gray-300" />*/}

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
                    <input name='slot1Score' type='number' className='w-10 scale-150 justify-self-center' value={formData.slot1Score} min={0}
                           onChange={(e) => {
                               if (!e.target.validity.valid) return;
                               setFormData({ ...formData, slot1Score: Number(e.target.value)}) }}
                    />
                    <input name='slot2Score' type='number' className='w-10 scale-150 justify-self-center' value={formData.slot2Score} min={0}
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
