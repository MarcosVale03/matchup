'use client'
import { BracketMatch } from "@/server/queries/brackets.queries";

// Groups flat match array into rounds by parsing "R1", "R2", etc. from match identifiers,
// then returns them sorted ascending so earlier rounds render left-to-right
function organizeIntoRounds(matches: BracketMatch[]): BracketMatch[][] {
    const roundMap = new Map<number, BracketMatch[]>();

    for (const match of matches) {
        const roundNum = parseInt(match.identifier.match(/R(\d+)/)?.[1] ?? "0");
        if (!roundMap.has(roundNum)) roundMap.set(roundNum, []);
        roundMap.get(roundNum)!.push(match);
    }

    return Array.from(roundMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([, matches]) => matches);
}

function Slot({
    name,
    score,
    isWinner,
}: {
    name: string;
    score: number | null;
    isWinner: boolean;
}) {
    return (
        <div className={`flex items-center justify-between px-3 py-2 
            ${isWinner ? "bg-primary/10" : ""}
            ${name === "TBD" ? "text-gray-400 italic" : ""}`}
        >
            <p className={`text-sm truncate flex-1 
                ${isWinner ? "font-bold text-primary" : "text-gray-800"}`}>
                {name}
            </p>
            {score != null && (
                <p className={`text-sm ml-2 font-bold
                    ${isWinner ? "text-primary" : "text-gray-400"}`}>
                    {score}
                </p>
            )}
        </div>
    );
}

function MatchNode({ match, roundIndex, isLast }: {
    match: BracketMatch;
    roundIndex: number;
    isLast: boolean;
}) {
    const slot1 = match.slots[0];
    const slot2 = match.slots[1];

    // TODO: winner detection is hardcoded — should compare slot scores
    // once scoring is wired up 
    const hasResult = true;
    const winner = hasResult ? slot1 : slot2
    // ? (slot1!.score! > slot2!.score! ? 1 : 2)
    // : null;

    return (
        <div className="flex items-center">
            {/* Connector line leading in from the previous round */}
            {roundIndex > 0 && <div className="w-6 h-px bg-gray-300" />}

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-[200px]">
                <Slot
                    name={slot1?.seed?.team_name ?? "TBD"}
                    score={2}
                    isWinner={true}
                />
                <div className="h-px bg-gray-200" />
                <Slot
                    name={slot2?.seed?.team_name ?? "TBD"}
                    score={1}
                    isWinner={false}
                />
            </div>

            {/* Connector line leading out to the next round */}
            {!isLast && <div className="w-6 h-px bg-gray-300" />}
        </div>
    );
}

export default function SingleElimBracket({ matches }: { matches: BracketMatch[] }) {
    const rounds = organizeIntoRounds(matches);

    if (rounds.length === 0) {
        return <p className="text-gray-400 text-center py-8">No bracket data yet</p>;
    }

    return (
        <div className="flex overflow-x-auto gap-0 py-4">
            {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="flex flex-col justify-around min-w-[220px]">
                    {/* Label the last two rounds as Finals/Semifinals, everything else numerically */}
                    <p className="text-center font-[Poppins] font-semibold text-sm text-gray-500 mb-4">
                        {roundIndex === rounds.length - 1
                            ? "Finals"
                            : roundIndex === rounds.length - 2
                                ? "Semifinals"
                                : `Round ${roundIndex + 1}`}
                    </p>
                    {/* justify-around distributes matches vertically so they align
                        with their parent match in the next round */}
                    <div className="flex flex-col justify-around flex-1 gap-4">
                        {round.map((match) => (
                            <MatchNode
                                key={match.identifier}
                                match={match}
                                roundIndex={roundIndex}
                                isLast={roundIndex === rounds.length - 1}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}