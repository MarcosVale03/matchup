'use client'
import {FetchBracketResponse, MatchResponse} from "@/server/queries/brackets.queries";

type MatchSlot = MatchResponse["match_slots"][number];

type Standing = {
    key: string;
    seed_num: number | null;
    display_name: string;
    prefix: string | null;
    wins: number;
    losses: number;
    ties: number;
    byes: number;
    scoreFor: number;
    scoreAgainst: number;
    played: number;
};

type CellResult = {
    result: "W" | "L" | "T";
    scoreFor: number;
    scoreAgainst: number;
    matchCode: string;
} | null;

// A score is valid only when it is a finite, non-negative number
const isValidScore = (score: number | null | undefined): score is number =>
    typeof score === "number" && Number.isFinite(score) && score >= 0;

const keyOfSlot = (slot: MatchSlot): string | null => {
    const user = slot?.seed?.user;
    if (!user) return null;
    return `${slot.seed!.seed_num}__${user.display_name}`;
};

// A match contributes to standings/cross-table only when both slots resolve
// to real entrants and both scores are valid.
function isPlayableHeadToHead(match: MatchResponse): boolean {
    if (match.match_slots.length !== 2) return false;
    const [slot1, slot2] = match.match_slots;
    if (!keyOfSlot(slot1) || !keyOfSlot(slot2)) return false;
    if (!match.is_complete) return false;
    return isValidScore(slot1.score) && isValidScore(slot2.score);
}

// The lone entrant gets credit for showing up but no score is added to their for/against totals.
function detectByeEntrant(match: MatchResponse): MatchSlot | null {
    if (match.match_slots.length !== 2) return null;
    if (!match.is_complete) return null;
    const [slot1, slot2] = match.match_slots;
    const has1 = !!keyOfSlot(slot1);
    const has2 = !!keyOfSlot(slot2);
    if (has1 && !has2) return slot1;
    if (has2 && !has1) return slot2;
    return null;
}

function buildStandings(rounds: FetchBracketResponse): Standing[] {
    const standingsByKey = new Map<string, Standing>();

    const getOrCreateStanding = (slot: MatchSlot): Standing | null => {
        const user = slot?.seed?.user;
        if (!user) return null;
        const entrantKey = keyOfSlot(slot)!;
        let standing = standingsByKey.get(entrantKey);
        if (!standing) {
            standing = {
                key: entrantKey,
                seed_num: slot.seed!.seed_num ?? null,
                display_name: user.display_name,
                prefix: user.prefix,
                wins: 0,
                losses: 0,
                ties: 0,
                byes: 0,
                scoreFor: 0,
                scoreAgainst: 0,
                played: 0,
            };
            standingsByKey.set(entrantKey, standing);
        }
        return standing;
    };

    for (const round of rounds) {
        for (const match of round.matches) {
            // Register every entrant we can see so a player with zero
            // played matches still appears in the standings.
            for (const slot of match.match_slots) getOrCreateStanding(slot);

            // Bye: lone entrant in a completed match — 1 free win, no score deltas.
            const byeSlot = detectByeEntrant(match);
            if (byeSlot) {
                const standing = getOrCreateStanding(byeSlot);
                if (standing) {
                    standing.wins += 1;
                    standing.byes += 1;
                }
                continue;
            }

            if (!isPlayableHeadToHead(match)) continue;

            const [slot1, slot2] = match.match_slots;
            const entrant1Standing = getOrCreateStanding(slot1)!;
            const entrant2Standing = getOrCreateStanding(slot2)!;
            const score1 = slot1.score as number;
            const score2 = slot2.score as number;

            entrant1Standing.played += 1;
            entrant2Standing.played += 1;
            entrant1Standing.scoreFor += score1;
            entrant1Standing.scoreAgainst += score2;
            entrant2Standing.scoreFor += score2;
            entrant2Standing.scoreAgainst += score1;

            if (score1 === score2) {
                entrant1Standing.ties += 1;
                entrant2Standing.ties += 1;
            } else if (score1 > score2) {
                entrant1Standing.wins += 1;
                entrant2Standing.losses += 1;
            } else {
                entrant2Standing.wins += 1;
                entrant1Standing.losses += 1;
            }
        }
    }

    return Array.from(standingsByKey.values());
}

function buildMatrix(
    rounds: FetchBracketResponse,
    standings: Standing[],
): Map<string, Map<string, CellResult>> {
    const grid = new Map<string, Map<string, CellResult>>();
    for (const standing of standings) grid.set(standing.key, new Map());

    for (const round of rounds) {
        for (const match of round.matches) {
            if (match.match_slots.length !== 2) continue;
            const [slot1, slot2] = match.match_slots;
            const key1 = keyOfSlot(slot1);
            const key2 = keyOfSlot(slot2);
            if (!key1 || !key2) continue;

            // Pending or invalid-score match: leave cell as null so the UI
            // renders the "–" placeholder
            if (!isPlayableHeadToHead(match)) {
                grid.get(key1)?.set(key2, null);
                grid.get(key2)?.set(key1, null);
                continue;
            }

            const score1 = slot1.score as number;
            const score2 = slot2.score as number;

            const cellForEntrant1: CellResult =
                score1 === score2
                    ? { result: "T", scoreFor: score1, scoreAgainst: score2, matchCode: match.code }
                    : score1 > score2
                        ? { result: "W", scoreFor: score1, scoreAgainst: score2, matchCode: match.code }
                        : { result: "L", scoreFor: score1, scoreAgainst: score2, matchCode: match.code };

            const cellForEntrant2: CellResult =
                score1 === score2
                    ? { result: "T", scoreFor: score2, scoreAgainst: score1, matchCode: match.code }
                    : score2 > score1
                        ? { result: "W", scoreFor: score2, scoreAgainst: score1, matchCode: match.code }
                        : { result: "L", scoreFor: score2, scoreAgainst: score1, matchCode: match.code };

            grid.get(key1)?.set(key2, cellForEntrant1);
            grid.get(key2)?.set(key1, cellForEntrant2);
        }
    }
    return grid;
}

function sortStandings(
    standings: Standing[],
    grid: Map<string, Map<string, CellResult>>,
): Standing[] {
    return [...standings].sort((entrantA, entrantB) => {
        if (entrantB.wins !== entrantA.wins) return entrantB.wins - entrantA.wins;

        const diffA = entrantA.scoreFor - entrantA.scoreAgainst;
        const diffB = entrantB.scoreFor - entrantB.scoreAgainst;
        if (diffB !== diffA) return diffB - diffA;

        const aVsB = grid.get(entrantA.key)?.get(entrantB.key) ?? null;
        if (aVsB?.result === "W") return -1;
        if (aVsB?.result === "L") return 1;

        if (entrantB.scoreFor !== entrantA.scoreFor) return entrantB.scoreFor - entrantA.scoreFor;

        return (entrantA.seed_num ?? Number.MAX_SAFE_INTEGER) - (entrantB.seed_num ?? Number.MAX_SAFE_INTEGER);
    });
}

function PodiumBlock({
    entrant,
    rank,
    heightClass,
    bgClass,
    labelClass,
}: {
    entrant: Standing | null;
    rank: 1 | 2 | 3;
    heightClass: string;
    bgClass: string;
    labelClass: string;
}) {
    const diff = entrant ? entrant.scoreFor - entrant.scoreAgainst : 0;

    return (
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
            <div className="flex flex-col items-center max-w-full min-w-0 px-2">
                {/* Player name */}
                <p
                    className={`font-jersey text-3xl sm:text-4xl lg:text-5xl truncate max-w-full
                                ${entrant ? "text-gray-800" : "text-gray-600"}`}
                >
                    {entrant?.display_name ?? "—"}
                </p>
                {/* Show their record */}
                {entrant && (
                    <p className="text-sm text-gray-500 tabular-nums">
                        {entrant.wins}W · {entrant.losses}L{entrant.ties ? ` · ${entrant.ties}T` : ""}
                        <span className="mx-1 text-gray-300">|</span>
                        <span
                            className={
                                diff > 0 ? "text-primary font-semibold" : "text-gray-400"
                            }
                        >
                            {diff > 0 ? "+" : ""}{diff}
                        </span>
                    </p>
                )}
            </div>

            {/* Rank */}
            <div
                className={`w-full ${heightClass} ${bgClass} rounded-t-2xl shadow-lg
                            flex items-start justify-center pt-4 relative`}
            >
                <span className={`font-jersey text-7xl sm:text-8xl lg:text-9xl leading-none ${labelClass}`}>
                    {rank}
                </span>
            </div>
        </div>
    );
}

function Podium({ standings }: { standings: Standing[] }) {
    // Pad to three so the podium always renders three blocks even with fewer
    // entrants. Using `null` here (instead of casting) keeps PodiumBlock's
    // entrant prop honest about the empty-slot case.
    const topThree: (Standing | null)[] = standings.slice(0, 3);
    while (topThree.length < 3) topThree.push(null);
    const [first, second, third] = topThree;

    return (
        <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5">
                <h3 className="font-jersey text-3xl text-black">Podium</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-600">Top 3</span>
            </div>

            {/* Podium blocks */}
            <div className="px-4 sm:px-10 pt-6 pb-0">
                <div className="flex items-end gap-3 sm:gap-6 max-w-4xl mx-auto">
                    <PodiumBlock
                        entrant={second}
                        rank={2}
                        heightClass="h-36 sm:h-48"
                        bgClass="bg-[linear-gradient(180deg,#e5e7eb_0%,#9ca3af_100%)]"
                        labelClass="text-white drop-shadow"
                    />
                    <PodiumBlock
                        entrant={first}
                        rank={1}
                        heightClass="h-52 sm:h-64"
                        bgClass="bg-[linear-gradient(180deg,#fde68a_0%,#d4a017_100%)]"
                        labelClass="text-white drop-shadow"
                    />
                    <PodiumBlock
                        entrant={third}
                        rank={3}
                        heightClass="h-24 sm:h-32"
                        bgClass="bg-[linear-gradient(180deg,#d69968_0%,#8b4513_100%)]"
                        labelClass="text-white drop-shadow"
                    />
                </div>
            </div>
        </div>
    );
}

function CrossTable({standings, grid}: { standings: Standing[]; grid: Map<string, Map<string, CellResult>>; }) {
    if (standings.length === 0) return null;

    const cellOuter = "border border-gray-100 p-0";
    const cellInner = "h-10 w-14 sm:w-16 flex flex-col items-center justify-center text-xs tabular-nums";

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* Header plus color legend */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-jersey text-2xl text-black">Cross Table</h3>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm bg-primary" /> Win
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm bg-gray-200" /> Loss
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-sm bg-gray-400" /> Tie
                    </span>
                </div>
            </div>

            {/* Cross Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                    {/* Table header */}
                    <thead>
                        <tr>
                            <th className="bg-white p-2 text-left text-[10px] uppercase tracking-wider text-gray-400 w-full">
                                Entrant
                            </th>

                            {/* Column standings identifiers, hovering over the number displays who it is */}
                            {standings.map((opponent, columnIndex) => (
                                <th
                                    key={opponent.key}
                                    className="p-1 z-0 text-center font-semibold text-xs text-gray-500 bg-gray-50 border-b border-gray-100"
                                    title={opponent.display_name}
                                >
                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-gray-700 font-bold text-xs">
                                        {columnIndex + 1}
                                    </span>
                                </th>
                            ))}
                            <th className="p-2 text-center text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50">
                                W-L
                            </th>
                            <th className="p-2 text-center text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50">
                                +/-
                            </th>
                        </tr>
                    </thead>

                    {/* Score data of table */}
                    <tbody>
                        {standings.map((rowEntrant, rowIndex) => {
                            const diff = rowEntrant.scoreFor - rowEntrant.scoreAgainst;
                            return (
                                <tr key={rowEntrant.key}>

                                    {/* Row index, prefix and player name */}
                                    <th className="sticky left-0 z-1 bg-white p-2 text-left text-sm font-medium text-gray-800 whitespace-nowrap border-b border-gray-100">
                                        <span className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold tabular-nums
                                                    ${rowIndex === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
                                            >
                                                {rowIndex + 1}
                                            </span>
                                            {rowEntrant.prefix && (
                                                <span className="text-[10px] font-bold opacity-60">
                                                    {rowEntrant.prefix}
                                                </span>
                                            )}
                                            <span className="truncate max-w-[140px]">{rowEntrant.display_name}</span>
                                        </span>
                                    </th>

                                    {/* Match result matrix */}
                                    {standings.map((columnEntrant) => {
                                        // Diagonal: a player can never play themselves.
                                        if (columnEntrant.key === rowEntrant.key) {
                                            return (
                                                <td key={columnEntrant.key} className={cellOuter}>
                                                    <div
                                                        className={`${cellInner} bg-[repeating-linear-gradient(45deg,#f4f4f5,#f4f4f5_4px,#e4e4e7_4px,#e4e4e7_8px)]`}
                                                    />
                                                </td>
                                            );
                                        }
                                        const cell = grid.get(rowEntrant.key)?.get(columnEntrant.key) ?? null;
                                        if (!cell) {
                                            return (
                                                <td key={columnEntrant.key} className={cellOuter}>
                                                    <div className={`${cellInner} bg-white text-gray-300`}>–</div>
                                                </td>
                                            );
                                        }
                                        const cellBgClass =
                                            cell.result === "W"
                                                ? "bg-primary text-white"
                                                : cell.result === "L"
                                                    ? "bg-gray-100 text-gray-500"
                                                    : "bg-gray-400 text-white";
                                        // Player results
                                        return (
                                            <td
                                                key={columnEntrant.key}
                                                className={cellOuter}
                                                title={`${rowEntrant.display_name} ${cell.scoreFor}–${cell.scoreAgainst} ${columnEntrant.display_name} (${cell.matchCode})`}
                                            >
                                                <div className={`${cellInner} ${cellBgClass} font-semibold`}>
                                                    <span className="text-[11px] leading-none">
                                                        {cell.scoreFor}–{cell.scoreAgainst}
                                                    </span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                    {/* Win-Loss stats */}
                                    <td className="px-3 text-center text-sm font-bold text-gray-800 tabular-nums border-b border-gray-100 bg-gray-50">
                                        {rowEntrant.wins}-{rowEntrant.losses}
                                        {rowEntrant.ties ? `-${rowEntrant.ties}` : ""}
                                    </td>

                                    {/* Difference */}
                                    <td
                                        className={`px-3 text-center text-sm font-semibold tabular-nums border-b border-gray-100 bg-gray-50
                                            ${diff > 0 ? "text-primary" : diff < 0 ? "text-gray-400" : "text-gray-600"}`}
                                    >
                                        {diff > 0 ? `+${diff}` : diff}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ScheduleTimeline({ rounds }: { rounds: FetchBracketResponse }) {
    const orderedRounds = [...rounds].sort((roundA, roundB) => roundA.round_num - roundB.round_num);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-3xl text-black">Schedule</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-600">
                    {orderedRounds.length} {orderedRounds.length === 1 ? "Round" : "Rounds"}
                </span>
            </div>

            <div className="relative">
                <ol className="flex flex-col">
                    {orderedRounds.map((round) => (
                        <li
                            key={round.round_num}
                            className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 px-6 py-6 border-b border-gray-100 last:border-b-0"
                        >
                            {/* Round marker */}
                            <div className="flex sm:flex-col items-center gap-3 sm:w-14 shrink-0">
                                <span
                                    className="relative z-1 inline-flex items-center justify-center
                                               w-14 h-14 rounded-full bg-primary shadow-md
                                               font-jersey text-3xl text-white"
                                >
                                    {round.round_num}
                                </span>
                                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                                    Round
                                </span>
                            </div>

                            {/* Match chips */}
                            <div className="flex-1 grid gap-2 sm:gap-3 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                                {round.matches.map((match, matchIndex) => {

                                    if (match.match_slots.length !== 2) return null;
                                    const [slot1, slot2] = match.match_slots;

                                    const bothScoresReported =
                                        match.is_complete &&
                                        isValidScore(slot1.score) &&
                                        isValidScore(slot2.score);

                                    const winningSide: 1 | 2 | null = bothScoresReported
                                        ? slot1.score === slot2.score
                                            ? null
                                            : (slot1.score as number) > (slot2.score as number) ? 1 : 2
                                        : null;

                                    const name1 = slot1.seed?.user?.display_name ?? "TBD";
                                    const name2 = slot2.seed?.user?.display_name ?? "TBD";

                                    // Strike out the loser; highlight the winner.
                                    const nameClass = (side: 1 | 2) =>
                                        winningSide === side
                                            ? "text-primary font-semibold"
                                            : bothScoresReported && winningSide !== null
                                                ? "text-gray-400 line-through decoration-gray-300"
                                                : "text-gray-700";

                                    return (
                                        <div
                                            key={match.code}
                                            className="group relative rounded-xl bg-gray-50 hover:bg-white
                                                       border border-gray-100 hover:border-primary/30
                                                       transition-colors px-3 py-2
                                                       flex items-center gap-3"
                                        >
                                            {/* Game number */}
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-600 tabular-nums shrink-0">
                                                G{matchIndex + 1}
                                            </span>

                                            <div className="flex flex-col min-w-0 flex-1">

                                                {/* First player's name and score */}
                                                <div className="flex items-center justify-between gap-2 text-sm">
                                                    <span className={`truncate ${nameClass(1)}`}>{name1}</span>
                                                    {bothScoresReported && (
                                                        <span
                                                            className={`tabular-nums font-bold ${winningSide === 1 ? "text-primary" : "text-gray-400"}`}
                                                        >
                                                            {slot1.score}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Second player's name and score */}
                                                <div className="flex items-center justify-between gap-2 text-sm">
                                                    <span className={`truncate ${nameClass(2)}`}>{name2}</span>
                                                    {bothScoresReported && (
                                                        <span
                                                            className={`tabular-nums font-bold ${winningSide === 2 ? "text-primary" : "text-gray-400"}`}
                                                        >
                                                            {slot2.score}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {!bothScoresReported && (
                                                <span className="absolute -top-2 -right-2 text-[9px] uppercase
                                                      tracking-wider font-bold text-white bg-gray-400 rounded-full
                                                      px-2 py-px">
                                                    LIVE
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default function RoundRobinBracket({
    rounds,
}: {
    rounds: FetchBracketResponse;
    showSeeds?: boolean;
}) {
    if (rounds.length === 0) {
        return <p className="text-gray-400 text-center py-8">No bracket data yet</p>;
    }
    const orderedRounds = [...rounds].sort((roundA, roundB) => roundA.round_num - roundB.round_num);

    const rawStandings = buildStandings(orderedRounds);

    // A round-robin needs at least two entrants to be meaningful. With 0 or
    // 1, render the schedule/empty state but suppress podium and cross table
    // (which would otherwise show a single-row table or empty podium).
    if (rawStandings.length < 2) {
        return (
            <div className="px-6 sm:px-32 py-6 flex flex-col gap-8">
                <p className="text-gray-500 text-center py-4">
                    Waiting for entrants — a round-robin needs at least two participants.
                </p>
                <ScheduleTimeline rounds={orderedRounds} />
            </div>
        );
    }

    const grid = buildMatrix(orderedRounds, rawStandings);
    const standings = sortStandings(rawStandings, grid);

    //  a complete round-robin among N entrants has exactly
    // N*(N-1)/2 head-to-head matches
    const entrantCount = standings.length;
    const expectedMatches = (entrantCount * (entrantCount - 1)) / 2;
    const playedMatches =
        standings.reduce((sum, standing) => sum + standing.played, 0) / 2;
    const isProvisional = playedMatches < expectedMatches;

    return (
        <div className="px-6 sm:px-32 py-6 flex flex-col gap-8">
            <Podium standings={standings} />
            {isProvisional && (
                <p className="text-xs text-gray-500 text-center -mt-4">
                    Provisional standings — {playedMatches} of {expectedMatches} matches played.
                </p>
            )}
            <ScheduleTimeline rounds={orderedRounds} />
            <CrossTable standings={standings} grid={grid} />
        </div>
    );
}
