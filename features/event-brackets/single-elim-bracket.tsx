'use client'
import {FetchBracketResponse, MatchResponse} from "@/server/queries/brackets.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {MouseEventHandler} from "react";

const CARD_WIDTH = 200;
const COLUMN_WIDTH = 244;
const GUTTER = (COLUMN_WIDTH - CARD_WIDTH) / 2; // 22

// Appears at the top of the column
function roundLabel(roundNum: number, totalRounds: number): string {
    if (roundNum === 1) return "Finals";
    if (roundNum === 2) return "Semifinals";
    if (roundNum === 3) return "Quarterfinals";
    return `Round ${totalRounds - roundNum + 1}`;
}

type BracketStats = {
    totalEntrants: number;
    completedMatches: number;
    totalMatches: number;
    currentRoundLabel: string | null;
    champion: { displayName: string; prefix: string | null } | null;
};

function computeBracketStats(rounds: FetchBracketResponse): BracketStats {
    const totalRounds = rounds.length;
    let totalMatches = 0;
    let completedMatches = 0;
    for (const round of rounds) {
        totalMatches += round.matches.length;
        completedMatches += round.matches.filter(m => m.is_complete).length;
    }

    // The starting round has the highest round_num (round_num=1 is the final).
    const startRound = rounds.reduce<typeof rounds[number] | null>(
        (acc, r) => (acc === null || r.round_num > acc.round_num ? r : acc),
        null
    );
    const totalEntrants = startRound ? startRound.matches.length * 2 : 0;

    // Current round = lowest round_num with at least one incomplete match.
    const inProgress = [...rounds]
        .sort((a, b) => b.round_num - a.round_num)
        .find(r => r.matches.some(m => !m.is_complete));
    const currentRoundLabel = inProgress
        ? roundLabel(inProgress.round_num, totalRounds)
        : null;

    // Champion lives in the final (round_num === 1) if it's complete and decisive.
    const finalRound = rounds.find(r => r.round_num === 1);
    const finalMatch = finalRound?.matches[0];
    let champion: BracketStats["champion"] = null;
    if (finalMatch?.is_complete) {
        const [s1, s2] = finalMatch.match_slots;
        if (s1 && s2 && s1.score !== s2.score) {
            const winnerSlot = s1.score > s2.score ? s1 : s2;
            const user = winnerSlot.seed?.user;
            if (user) {
                champion = { displayName: user.display_name, prefix: user.prefix };
            }
        }
    }

    return { totalEntrants, completedMatches, totalMatches, currentRoundLabel, champion };
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
            {/* Seed number of the entrant */}
            {showSeed && (
                <span
                    className={`text-sm border-r p-2 border-gray-500 shrink-0 flex items-center justify-center w-9 tabular-nums
                        ${isWinner ? "font-bold text-primary" : "text-gray-500"}`}
                >
                    {seed ?? ""}
                </span>
            )}

            {/* Name of the entrant */}
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

            {/* Score of the entrant */}
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

    // Connector geometry, anchored inside the container (left-origin).
    //   card right edge → CARD_WIDTH
    //   pair midline    → CARD_WIDTH + GUTTER
    //   column edge     → CARD_WIDTH + 2*GUTTER (== COLUMN_WIDTH)
    const cardRight = CARD_WIDTH;
    const midline = CARD_WIDTH + GUTTER;

    return (
        <div className="flex-1 flex items-center relative min-h-24 w-full">
            {/* Match card */}
            <div
                onClick={onClick}
                className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ width: CARD_WIDTH }}
            >
                {/* Match code badge */}
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

            {/* L-shaped connector: horizontal out of the card, vertical to the
                pair's midpoint, then a horizontal into the next round (drawn
                once per pair from the top match). */}
            {!isLast && (
                <>
                    {/* Horizontal stub: card's right edge → pair midline */}
                    <div
                        className="absolute h-px bg-gray-300"
                        style={{ top: '50%', left: cardRight, width: GUTTER }}
                    />
                    {/* Vertical line at the pair midline */}
                    <div
                        className="absolute w-px bg-gray-300"
                        style={
                            isTopOfPair
                                ? { top: '50%', bottom: 0, left: midline }
                                : { top: 0, bottom: '50%', left: midline }
                        }
                    />
                    {/* Pair midline → next round's card (drawn once per pair) */}
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

export default function SingleElimBracket({
    rounds,
    showSeeds = true,
    round = null,
    match = null
}: {
    rounds: FetchBracketResponse;
    showSeeds?: boolean;
    round: number | null;
    match: number | null
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const {replace} = useRouter()
    const totalRounds = rounds.length;

    if (totalRounds === 0) {
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
        <div className="p-8" onClick={handleBgClick}>
            <div className="flex overflow-x-auto pl-2">
            {rounds.map((round, roundIndex) => (
                <div
                    key={roundIndex}
                    className="flex flex-col"
                    style={{ width: COLUMN_WIDTH, minWidth: COLUMN_WIDTH }}
                >
                    {/* Round label (e.g., Finals */}
                    <p
                        className="text-center font-semibold text-sm uppercase tracking-wider text-gray-500"
                        style={{ width: CARD_WIDTH }}
                    >
                        {roundLabel(round.round_num, totalRounds)}
                    </p>

                    {/* Matches */}
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
                {/*SHOWN MATCH*/}
                {((round !== null && match !== null) && rounds[round]?.matches[match] !== undefined) &&
                    <MatchPopup showSeeds={showSeeds} match={rounds[round].matches[match]} onClick={(e) => e.stopPropagation()}>

                    </MatchPopup>}
            </div>
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
