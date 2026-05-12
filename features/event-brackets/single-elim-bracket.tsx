'use client'
import {FetchBracketResponse, MatchResponse} from "@/server/queries/brackets.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {MouseEventHandler} from "react";

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
    console.log(winner)

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

export default function SingleElimBracket({ rounds, showSeeds = true, round = null, match = null }:
{ rounds: FetchBracketResponse, showSeeds?: boolean, round: number | null, match: number | null }) {
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

    return (
        <div className="flex overflow-x-auto gap-0 p-8 bg-white min-h-screen" onClick={handleBgClick}>
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
                            <button key={match.id} onClick={(e) => {
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
               <MatchPopup showSeeds={showSeeds} match={rounds[round].matches[match]} onClick={(e) => e.stopPropagation()}>

               </MatchPopup>}
        </div>
    );
}


function MatchPopup({ onClick, match, showSeeds }: {
    onClick: MouseEventHandler;
    match: MatchResponse;
    showSeeds: boolean
}) {
    const slot1 = match.match_slots[0];
    const slot2 = match.match_slots[1];

    // TODO: winner detection is hardcoded — should compare slot scores
    // once scoring is wired up
    const isComplete = match.is_complete;
    const winner = isComplete && slot1.score != slot2.score ? (slot1.score > slot2.score ? 1 : 2) : null;
    console.log(winner)

    return (
        <div className="absolute bottom-2/5 right-1/3 w-1/3 h-1/3 bg-gray-50 border-4 border-primary shadow-xl rounded-3xl"
            onClick={onClick}>
            {/* Connector line leading in from the previous round */}
            {/*roundIndex > 0 && <div className="w-6 h-px bg-gray-300" />*/}

            <div className='w-full h-full grid grid-cols-2'>
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
        <div className={`flex items-center px-3 py-2 justify-between m-4 h-20
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
