'use client'
import {Fragment, useState} from "react";
import {FetchEventFromEventIdResponse} from "@/server/queries/events.queries";
import {formatDate} from "date-fns";
import {CalendarSync, ChevronRight, Crown, ShieldAlert, Wrench, X} from "lucide-react";
import {FetchBracketPhasesResponse} from "@/server/queries/phases.queries";
import Link from "next/link";

interface Team {
    rank: number;
    name: string;
    wins: number;
    losses: number;
    draws: number;
    pts: number;
    streak: string;
    mapDiff: string;
    seed: number;
}

interface Match {
    id: number;
    team1: string;
    score1: number;
    team2: string;
    score2: number;
    round: number;
    time: string;
}

interface UpcomingMatch {
    id: number;
    team1: string;
    team2: string;
    round: number;
    time: string;
}

interface Alert {
    type: "warning" | "info" | "success";
    msg: string;
}

const TOURNAMENT = {
    name: "Test Event",
    game: "Valorant",
    format: "Round Robin → Single Elim",
    startDate: "Mar 1, 2026",
    endDate: "Mar 14, 2026",
    currentRound: 3,
    totalRounds: 5,
    registeredTeams: 12,
    matchesPlayed: 18,
    matchesRemaining: 12,
};

const TEAMS: Team[] = [
    {
        rank: 1,
        name: "Phantom Rift",
        wins: 5,
        losses: 0,
        draws: 0,
        pts: 15,
        streak: "W5",
        mapDiff: "+12",
        seed: 1,
    },
    {
        rank: 2,
        name: "Neon Vanguard",
        wins: 4,
        losses: 1,
        draws: 0,
        pts: 12,
        streak: "W3",
        mapDiff: "+8",
        seed: 3,
    },
    {
        rank: 3,
        name: "Iron Collective",
        wins: 4,
        losses: 1,
        draws: 0,
        pts: 12,
        streak: "W1",
        mapDiff: "+6",
        seed: 2,
    },
    {
        rank: 4,
        name: "Solar Flare",
        wins: 3,
        losses: 2,
        draws: 0,
        pts: 9,
        streak: "L1",
        mapDiff: "+3",
        seed: 5,
    },
    {
        rank: 5,
        name: "Dusk Protocol",
        wins: 3,
        losses: 2,
        draws: 0,
        pts: 9,
        streak: "W2",
        mapDiff: "+1",
        seed: 4,
    },
    {
        rank: 6,
        name: "Crimson Wolves",
        wins: 2,
        losses: 3,
        draws: 0,
        pts: 6,
        streak: "L2",
        mapDiff: "-1",
        seed: 6,
    },
    {
        rank: 7,
        name: "Glacier Nine",
        wins: 2,
        losses: 3,
        draws: 0,
        pts: 6,
        streak: "L1",
        mapDiff: "-3",
        seed: 8,
    },
    {
        rank: 8,
        name: "Echo Chamber",
        wins: 2,
        losses: 3,
        draws: 0,
        pts: 6,
        streak: "W1",
        mapDiff: "-4",
        seed: 7,
    },
    {
        rank: 9,
        name: "Verdant Edge",
        wins: 1,
        losses: 4,
        draws: 0,
        pts: 3,
        streak: "L3",
        mapDiff: "-6",
        seed: 10,
    },
    {
        rank: 10,
        name: "Obsidian Core",
        wins: 1,
        losses: 4,
        draws: 0,
        pts: 3,
        streak: "L1",
        mapDiff: "-7",
        seed: 9,
    },
    {
        rank: 11,
        name: "Byte Force",
        wins: 0,
        losses: 4,
        draws: 1,
        pts: 1,
        streak: "L4",
        mapDiff: "-4",
        seed: 11,
    },
    {
        rank: 12,
        name: "Wraith Signal",
        wins: 0,
        losses: 5,
        draws: 0,
        pts: 0,
        streak: "L5",
        mapDiff: "-5",
        seed: 12,
    },
];

const RECENT_MATCHES: Match[] = [
    {id: 1, team1: "Phantom Rift", score1: 2, team2: "Solar Flare", score2: 0, round: 3, time: "Today, 4:30 PM"},
    {id: 2, team1: "Neon Vanguard", score1: 2, team2: "Glacier Nine", score2: 1, round: 3, time: "Today, 3:00 PM"},
    {id: 3, team1: "Iron Collective", score1: 2, team2: "Verdant Edge", score2: 0, round: 3, time: "Today, 1:30 PM"},
    {id: 4, team1: "Dusk Protocol", score1: 2, team2: "Byte Force", score2: 1, round: 3, time: "Yesterday"},
    {id: 5, team1: "Crimson Wolves", score1: 0, team2: "Echo Chamber", score2: 2, round: 3, time: "Yesterday"},
];

const UPCOMING: UpcomingMatch[] = [
    {id: 6, team1: "Phantom Rift", team2: "Neon Vanguard", round: 4, time: "Mar 10, 2:00 PM"},
    {id: 7, team1: "Iron Collective", team2: "Dusk Protocol", round: 4, time: "Mar 10, 3:30 PM"},
    {id: 8, team1: "Solar Flare", team2: "Echo Chamber", round: 4, time: "Mar 10, 5:00 PM"},
];

const ALERTS: Alert[] = [
    {type: "warning", msg: "Byte Force has requested a reschedule for Round 4 match"},
    {type: "info", msg: "Tiebreaker rules activated for positions 2-3 and 6-8"},
    {type: "success", msg: "Round 3 completed — all results confirmed"},
];

const CUTOFF = 8;

function rankClass(rank: number): string {
    if (rank === 1) return "text-primary";
    if (rank === 2) return "text-secondary";
    if (rank === 3) return "text-secondary/95";
    return "text-gray-700";
}

function rowBg(team: Team, selected: boolean): string {
    if (selected) return "bg-primary/15";
    if (team.rank <= 3) return "bg-gray-300/30";

    if (team.rank <= CUTOFF) return "bg-gray-50";
    return "bg-white";
}

export default function EventDetails({
    event,
    bracketPhases
}: {
    event: FetchEventFromEventIdResponse,
    bracketPhases: FetchBracketPhasesResponse
}) {
    const [activeTab, setActiveTab] = useState<"brackets" | "standings" | "matches" | "upcoming">("brackets");
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [showAdmin, setShowAdmin] = useState(false);

    const selectedData: Team | undefined = selectedTeam
        ? TEAMS.find((x) => x.name === selectedTeam)
        : undefined;

    const redButtonClassName = `flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                             rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                             text-white bg-primary hover:bg-secondary cursor-pointer
                             disabled:opacity-50 transition-colors duration-200`

    return (
        <div className="overflow-y-auto mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <div className="mx-auto p-4 sm:p-6 lg:p-8">

                {/* HEADER */}
                <header className="pt-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">

                        {/* Event Details */}
                        <div>
                            <div className="flex items-center gap-2.5 mb-3">
                                <p
                                    className="text-xs font-bold tracking-widest uppercase text-white
                                    bg-secondary px-3 py-1 rounded"
                                >
                                    Organizer View
                                </p>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-jersey-25 text-primary">
                                {event.name}
                            </h1>
                            <p className="mt-2 text-base sm:text-lg font-semibold text-gray-700">
                                {event.video_game_name} · BRACKET FORMAT
                                · {formatDate(event.start_time, 'MMM d, yyyy')} — {formatDate(event.end_time, 'MMM d, yyyy')}
                            </p>
                        </div>

                        {/* Admin tools button */}
                        <button
                            onClick={() => setShowAdmin(!showAdmin)}
                            className={redButtonClassName}
                        >
                            {!showAdmin && (
                                <Wrench className="size-5"/>
                            )}

                            {showAdmin && (
                                <X className="size-5"/>
                            )}

                            {showAdmin ? "Close Admin Tools" : "Admin Tools"}
                        </button>
                    </div>

                    {/* stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
                        {[
                            {
                                label: "Round",
                                value: `${TOURNAMENT.currentRound} / ${TOURNAMENT.totalRounds}`,
                                bar: "bg-primary"
                            },
                            {label: "Teams", value: String(TOURNAMENT.registeredTeams)},
                            {label: "Played", value: String(TOURNAMENT.matchesPlayed)},
                            {label: "Remaining", value: String(TOURNAMENT.matchesRemaining)},
                        ].map((s, i) => (
                            <div key={i}
                                 className="relative overflow-hidden bg-white rounded-xl
                                 px-4 py-4 shadow-md"
                            >
                                <p className="font-jersey-25 text-base md:text-lg lg:text-xl">{s.label}</p>
                                <p className="font-semibold text-lg text-primary">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ADMIN PANEL */}
                {showAdmin && (
                    <div className="my-6 p-5 rounded-xl border border-zinc-700 bg-zinc-800 text-white">
                        <p className="font-jersey-25 text-base md:text-lg lg:text-xl uppercase text-white mb-4">
                            Admin Alerts & Actions
                        </p>

                        {/* Alerts placeholder info */}
                        <div className="flex flex-col gap-2.5">
                            {ALERTS.map((a, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 border border-zinc-600
                                               bg-zinc-700/50 rounded-lg text-base"
                                >
                                    <p className="flex-1 font-semibold text-base">
                                        {a.msg}
                                    </p>
                                    {a.type === "warning" && (
                                        <button
                                            className={redButtonClassName}
                                        >
                                            Review
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Admin options */}
                        <div className="flex flex-wrap gap-2.5 mt-5">
                            {["Edit", "Override Result", "Reschedule Match", "Export Data"].map((a) => (
                                <button
                                    key={a}
                                    className="bg-zinc-700 border border-zinc-600 px-4 py-2 rounded-lg
                                                cursor-pointer hover:bg-zinc-600 transition-colors text-zinc-300
                                                hover:text-white font-jersey-25 text-sm md:text-lg"
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* TABS */}
                <nav className="flex mt-7">
                    {(["brackets", "standings", "matches", "upcoming"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 sm:flex-none px-2 sm:px-7 py-2 text-sm md:text-lg uppercase
                                        -mb-0.5 transition-colors cursor-pointer border-b-3 font-jersey-25
                            ${
                                activeTab === tab
                                    ? "text-primary border-primary"
                                    : "text-gray-700 border-transparent"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* CONTENT */}
                <div className="py-7 pb-16">
                    {/* BRACKETS */}
                    {activeTab === "brackets" && (
                        <div className="flex flex-col gap-2.5">
                            {bracketPhases.map((bp) => (
                                <Link key={bp.id} href={`/tournaments/${event.tournament_id}/events/${event.id}/brackets?bpid=${bp.id}`}>
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-5 py-4
                               bg-gray-50 border border-gray-100 rounded-xl shadow-sm"
                                    >


                                        {/* Bracket Name */}
                                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                                            <div
                                                className={`text-right font-jersey-25 text-base sm:text-xl`}
                                            >
                                                <p>{bp.name}</p>
                                            </div>


                                        </div>

                                        {/* Bracket Info */}
                                        <div className="hidden sm:grid grid-cols-4 text-sm text-gray-700 font-semibold min-w-28">
                                            <div className='min-w-28 text-center flex-col items-center justify-center'>
                                                <p className="font-bold">Pools</p>
                                                <p>{bp.num_pools}</p>
                                            </div>
                                            <div className='min-w-28 text-center flex-col items-center justify-center'>
                                                <p className="font-bold">Entrants</p>
                                                <p>{bp.num_entrants}</p>
                                            </div>
                                            <div className='min-w-28 text-center flex-col items-center justify-center'>
                                                <p className="font-bold">Type</p>
                                                <p>{bp.bracket_type_name}</p>
                                            </div>
                                            {bp.next_phase_name && <div className='min-w-28 text-center flex-col items-center justify-center'>
                                                <p className="font-bold">Progression</p>
                                                <p>{bp.next_phase_name}</p>
                                            </div>}
                                        </div>


                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* STANDINGS */}
                    {activeTab === "standings" && (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-1.5">
                                    <thead>
                                    <tr>
                                        {["#", "Team", "W", "L", "D", "PTS", "Streak", ""].map((h, i) => (
                                            <th
                                                key={i}
                                                className={`px-3.5 py-2.5 font-jersey-25 text-base uppercase text-gray-700
                                                font-normal 
                                                ${
                                                    i === 1 ? "text-left" : "text-center"
                                                }`}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {TEAMS.map((team) => {
                                        const sel = selectedTeam === team.name;
                                        const isCut = team.rank === CUTOFF;

                                        return (
                                            <Fragment key={team.name}>
                                                <tr
                                                    onClick={() => setSelectedTeam(sel ? null : team.name)}
                                                    className={`cursor-pointer transition-colors ${rowBg(team, sel)} ${
                                                        sel ? "shadow-[inset_3px_0_0_var(--color-primary)]" : ""
                                                    }`}
                                                >
                                                    {/* Team Rank */}
                                                    <td className={`text-center px-3.5 py-4 rounded-l-lg text-lg font-extrabold ${rankClass(team.rank)}`}>
                                                        {team.rank}
                                                    </td>

                                                    {/* Team Name */}
                                                    <td className="px-3.5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-jersey-25 text-base md:text-lg lg:text-xl">{team.name}</p>
                                                        </div>
                                                    </td>

                                                    {/* Team Stats */}
                                                    <td className="text-center px-3.5 py-4 font-jersey-25 text-xl text-black">{team.wins}</td>
                                                    <td className="text-center px-3.5 py-4 font-jersey-25 text-xl text-black">{team.losses}</td>
                                                    <td className="text-center px-3.5 py-4 font-jersey-25 text-xl text-gray-500">{team.draws}</td>
                                                    <td className="text-center px-3.5 py-4 font-jersey-25 text-2xl text-gray-900">{team.pts}</td>

                                                    <td className="text-center px-3.5 py-4">
                                                        <p
                                                            className="text-sm font-bold px-2.5 py-0.5 rounded-md
                                                            text-black"
                                                        >
                                                            {team.streak}
                                                        </p>
                                                    </td>

                                                    <td className="text-center px-2 py-4 rounded-r-lg text-base text-gray-800">
                                                        <ChevronRight
                                                            className="size-5 hover:text-primary transition-colors duration-300"/>
                                                    </td>
                                                </tr>

                                                {/* Cutoff line */}
                                                {isCut && (
                                                    <tr key="cutoff">
                                                        <td colSpan={10} className="py-1">
                                                            <div className="flex items-center gap-3 px-3">
                                                                <div
                                                                    className="flex-1 h-px border-t-2 border-dashed
                                                                    border-primary"
                                                                />
                                                                <span
                                                                    className="text-base font-extrabold rounded-xl
                                                                     uppercase whitespace-nowrap px-3 py-1 bg-white
                                                                     text-primary"
                                                                >
                                                                    Elimination Cutoff
                                                                </span>
                                                                <div
                                                                    className="flex-1 h-px border-t-2 border-dashed
                                                                    border-primary"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* selected team detail */}
                            {selectedData && (
                                <div className="mt-5 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <div>
                                                <p className="text-2xl font-jersey-25">
                                                    {selectedData.name}
                                                </p>
                                                <p className="text-base font-semibold text-gray-700">
                                                    {selectedData.wins}W-{selectedData.losses}L-{selectedData.draws}D
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {showAdmin && (
                                                <>
                                                    <button
                                                        className={redButtonClassName}
                                                    >
                                                        <ShieldAlert className="size-5"/>
                                                        Disqualify
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 ">
                                        {[
                                            {
                                                label: "Win Rate",
                                                value: `${Math.round((selectedData.wins / Math.max(selectedData.wins + selectedData.losses + selectedData.draws, 1)) * 100)}%`
                                            },
                                            {label: "Points", value: String(selectedData.pts)},
                                            {label: "Streak", value: selectedData.streak},
                                        ].map((s, i) => (
                                            <div
                                                key={i}
                                                className="text-center py-3.5 px-3 bg-gray-50 rounded-lg border
                                                border-gray-200"
                                            >
                                                <p
                                                    className="font-jersey-25 uppercase text-gray-500 mb-1.5"
                                                >
                                                    {s.label}
                                                </p>
                                                <p className="text-2xl font-extrabold text-gray-900">
                                                    {s.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MATCHES */}
                    {activeTab === "matches" && (
                        <div className="flex flex-col gap-2.5">
                            {RECENT_MATCHES.map((m) => (
                                <div
                                    key={m.id}
                                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4
                           bg-gray-50 border border-gray-100 rounded-xl shadow-sm"
                                >
                                    {/* Round and Time - side by side on mobile, split on desktop */}
                                    <div className="flex justify-between sm:contents">
                                        <p className="text-xs font-bold tracking-wider uppercase text-gray-700 sm:min-w-12">
                                            R{m.round}
                                        </p>
                                        <p className="text-sm text-gray-700 font-semibold sm:hidden">
                                            {m.time}
                                        </p>
                                    </div>

                                    {/* Scores and team results */}
                                    <div className="flex-1 flex items-center justify-center gap-3 sm:gap-4">
                                        {/* Left side team */}
                                        <div
                                            className={`flex-1 text-right font-jersey-25 text-base sm:text-xl ${
                                                m.score1 > m.score2 ? "" : "text-gray-500"
                                            }`}
                                        >
                                            <div className="flex justify-end gap-2">
                                                {m.score1 > m.score2 && (
                                                    <Crown
                                                        className="size-4 sm:size-5 text-yellow-500 place-self-center"/>
                                                )}
                                                {m.team1}
                                            </div>
                                        </div>

                                        {/* Score divider */}
                                        <div
                                            className="flex items-center justify-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2
                                   rounded-lg bg-primary shrink-0"
                                        >
                                            <p className={`text-base sm:text-xl font-semibold ${
                                                m.score1 > m.score2 ? "text-white" : "text-white/70"
                                            }`}>
                                                {m.score1}
                                            </p>
                                            <p className="text-base sm:text-xl font-semibold text-white/25">:</p>
                                            <p className={`text-base sm:text-xl font-semibold ${
                                                m.score2 > m.score1 ? "text-white" : "text-white/50"
                                            }`}>
                                                {m.score2}
                                            </p>
                                        </div>

                                        {/* Right side team */}
                                        <div
                                            className={`flex-1 text-left font-jersey-25 text-base sm:text-xl ${
                                                m.score2 > m.score1 ? "" : "text-gray-500"
                                            }`}
                                        >
                                            <div className="flex justify-start gap-2">
                                                {m.team2}
                                                {m.score2 > m.score1 && (
                                                    <Crown
                                                        className="size-4 sm:size-5 text-yellow-500 place-self-center"/>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time - hidden on mobile (shown above), visible on desktop */}
                                    <p className="hidden sm:block text-sm text-gray-700 font-semibold min-w-28 text-right">
                                        {m.time}
                                    </p>

                                    {showAdmin && (
                                        <button
                                            className="text-base font-semibold bg-white border border-gray-300
                                   text-gray-700 px-3.5 py-1 rounded-md cursor-pointer
                                   hover:bg-gray-100 transition-colors duration-300
                                   w-full sm:w-auto"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* UPCOMING */}
                    {activeTab === "upcoming" && (
                        <div className="flex flex-col gap-2.5">
                            {UPCOMING.map((m) => (
                                <div
                                    key={m.id}
                                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4
                           bg-gray-50 border border-gray-100 rounded-xl shadow-sm"
                                >
                                    {/* Round and Time - side by side on mobile */}
                                    <div className="flex justify-between sm:contents">
                                        <p className="text-xs font-bold tracking-wider uppercase text-gray-700 sm:min-w-12">
                                            R{m.round}
                                        </p>
                                        <p className="text-sm text-gray-700 font-semibold sm:hidden">
                                            {m.time}
                                        </p>
                                    </div>

                                    {/* Team pairings */}
                                    <div className="flex-1 flex items-center justify-center gap-3 sm:gap-4">
                                        <p className="flex-1 text-right font-jersey-25 text-base sm:text-xl">
                                            {m.team1}
                                        </p>

                                        <p className="px-3 sm:px-5 py-1.5 rounded-lg text-sm font-extrabold tracking-widest
                                  bg-red-50 border border-primary text-primary shrink-0">
                                            VS
                                        </p>

                                        <p className="flex-1 text-left font-jersey-25 text-base sm:text-xl">
                                            {m.team2}
                                        </p>
                                    </div>

                                    {/* Time - hidden on mobile, visible on desktop */}
                                    <p className="hidden sm:block text-sm text-gray-700 font-semibold min-w-28 text-right">
                                        {m.time}
                                    </p>

                                    {showAdmin && (
                                        <button className={`${redButtonClassName} w-full sm:w-auto`}>
                                            <CalendarSync className="size-5"/>
                                            Reschedule
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* footer */}
                <div
                    className="py-5 border-t border-gray-300 text-xs text-gray-400 text-center tracking-wider font-semibold">
                    LAST SYNCED 2 MIN AGO
                </div>
            </div>
        </div>
    );
}