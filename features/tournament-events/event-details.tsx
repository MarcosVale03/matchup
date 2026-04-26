'use client'
import {Fragment, useEffect, useState} from "react";
import {FetchEventFromEventIdResponse, FetchStandingsResponse} from "@/server/queries/events.queries";
import {formatDate} from "date-fns";
import {CalendarSync, ChevronRight, Crown, Wrench, X} from "lucide-react";
import {FetchBracketPhasesResponse} from "@/server/queries/phases.queries";
import Link from "next/link";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const TABS = ["brackets", "players", "matches", "upcoming"] as const;
type TabName = typeof TABS[number];

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

function rankClass(rank: number): string {
    if (rank === 1) return "text-primary";
    if (rank === 2) return "text-secondary";
    if (rank === 3) return "text-secondary/95";
    return "text-gray-700";
}

function rowBg(rank: number, selected: boolean): string {
    if (selected) return "bg-primary/15";
    if (rank <= 3) return "bg-gray-300/30";
    return "bg-white";
}

export default function EventDetails({
    event,
    bracketPhases,
    standings,
}: {
    event: FetchEventFromEventIdResponse,
    bracketPhases: FetchBracketPhasesResponse,
    standings: FetchStandingsResponse,
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    const tabParam = searchParams.get("tab") as TabName | null;
    const activeTab: TabName = tabParam && TABS.includes(tabParam) ? tabParam : "brackets";

    const handleTabClick = (tab: TabName) => {
        const params = new URLSearchParams(searchParams);
        if (tab === "brackets") {
            params.delete("tab");
        } else {
            params.set("tab", tab);
        }
        const qs = params.toString();
        replace(qs ? `${pathname}?${qs}` : pathname);
    };

    const [selectedEntrant, setSelectedEntrant] = useState<string | null>(null);
    const [showAdmin, setShowAdmin] = useState(false);
    const [syncedAt, setSyncedAt] = useState<Date>(() => new Date());
    const [, setTick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 60_000);
        return () => clearInterval(id);
    }, []);

    function formatSyncedAgo(date: Date, now: Date = new Date()): string {
        const mins = Math.floor((now.getTime() - date.getTime()) / 60_000);
        if (mins < 1) return "JUST NOW";
        if (mins === 1) return "1 MIN AGO";
        return `${mins} MINS AGO`;
    }

    const redButtonClassName = `flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                             rounded-md shadow-sm text-sm md:text-lg font-jersey
                             text-white bg-primary hover:bg-secondary cursor-pointer
                             disabled:opacity-50 transition-colors duration-200`

    function renderBracketsTab() {
        return (
            <div className="flex flex-col gap-2.5">
                {bracketPhases.map((bp) => (
                    <Link key={bp.id}
                          href={`/tournaments/${event.tournament_id}/events/${event.id}/brackets?bpid=${bp.id}`}
                    >
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-5 py-4
                                     bg-gray-50 border border-gray-100 rounded-xl shadow-sm"
                        >
                            {/* Bracket Name */}
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <div className={`text-right font-jersey text-base sm:text-xl`}>
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
                                {bp.next_phase_name && <div
                                    className='min-w-28 text-center flex-col items-center justify-center'>
                                    <p className="font-bold">Progression</p>
                                    <p>{bp.next_phase_name}</p>
                                </div>}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    function renderPlayersTab() {
        if (standings.length === 0) {
            return <p className="text-gray-500 text-center py-8">No entrants yet.</p>;
        }

        return (
            <div>
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-1.5">
                        <thead>
                        {/* Column names */}
                        <tr>
                            {["#", "Entrant", "Initial Seed", "W", "L", "D", "Diff", "PTS", ""].map((header, i) => (
                                <th
                                    key={i}
                                    className={`px-3.5 py-2.5 font-jersey text-base uppercase text-gray-700 font-normal
                                              ${i === 1 ? "text-left" : "text-center"}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {standings.map((row, i) => {
                            const rank = row.placement ?? (i + 1);
                            const sel = selectedEntrant === row.user_id;
                            const diff = row.score_for - row.score_against;
                            const diffStr = diff > 0 ? `+${diff}` : String(diff);

                            return (
                                <Fragment key={row.user_id}>
                                    <tr
                                        onClick={() => setSelectedEntrant(sel ? null : row.user_id)}
                                        className={`cursor-pointer transition-colors bg-gray-200 ${
                                            sel ? "shadow-[inset_3px_0_0_var(--color-primary)] bg-primary/15" : ""
                                        }`}
                                    >
                                        {/* Rank */}
                                        <td className="text-center px-3.5 py-4 rounded-l-lg text-lg font-extrabold">
                                            {rank}
                                        </td>

                                        {/* Prefix and display name */}
                                        <td className="px-3.5 py-4">
                                            <div className="flex items-center gap-2">
                                                {row.prefix && (
                                                    <span className="text-xs font-bold opacity-70">{row.prefix}</span>
                                                )}
                                                <p className="font-jersey text-base md:text-lg lg:text-xl">
                                                    {row.display_name}
                                                </p>
                                            </div>
                                        </td>
                                        {/* Seed and stats */}
                                        <td className="text-center px-3.5 py-4 font-jersey text-xl text-gray-600">{row.seed}</td>
                                        <td className="text-center px-3.5 py-4 font-jersey text-xl text-black">{row.wins}</td>
                                        <td className="text-center px-3.5 py-4 font-jersey text-xl text-black">{row.losses}</td>
                                        <td className="text-center px-3.5 py-4 font-jersey text-xl text-gray-500">{row.draws}</td>
                                        <td className={`text-center px-3.5 py-4 font-jersey text-xl tabular-nums
                                            ${diff > 0 ? "text-primary" : diff < 0 ? "text-gray-500" : "text-gray-700"}`}>
                                            {diffStr}
                                        </td>
                                        <td className="text-center px-3.5 py-4 font-jersey text-2xl text-gray-900">{row.points}</td>
                                        <td className="text-center px-2 py-4 rounded-r-lg text-base text-gray-800">
                                            <ChevronRight
                                                className="size-5 hover:text-primary transition-colors duration-300"/>
                                        </td>
                                    </tr>
                                </Fragment>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    function renderMatchesTab() {
        return (
            <div className="flex flex-col gap-2.5">
                <p className="text-center">Placeholder</p>
                {/*{RECENT_MATCHES.map((m) => (*/}
                {/*    <div*/}
                {/*        key={m.id}*/}
                {/*        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4*/}
                {/*                   bg-gray-50 border border-gray-100 rounded-xl shadow-sm"*/}
                {/*    >*/}
                {/*        <div className="flex justify-between sm:contents">*/}
                {/*            <p className="text-xs font-bold tracking-wider uppercase text-gray-700 sm:min-w-12">*/}
                {/*                R{m.round}*/}
                {/*            </p>*/}
                {/*            <p className="text-sm text-gray-700 font-semibold sm:hidden">*/}
                {/*                {m.time}*/}
                {/*            </p>*/}
                {/*        </div>*/}

                {/*        <div className="flex-1 flex items-center justify-center gap-3 sm:gap-4">*/}
                {/*            <div*/}
                {/*                className={`flex-1 text-right font-jersey text-base sm:text-xl ${*/}
                {/*                    m.score1 > m.score2 ? "" : "text-gray-500"*/}
                {/*                }`}*/}
                {/*            >*/}
                {/*                <div className="flex justify-end gap-2">*/}
                {/*                    {m.score1 > m.score2 && (*/}
                {/*                        <Crown className="size-4 sm:size-5 text-yellow-500 place-self-center"/>*/}
                {/*                    )}*/}
                {/*                    {m.team1}*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*            <div*/}
                {/*                className="flex items-center justify-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-primary shrink-0">*/}
                {/*                <p className={`text-base sm:text-xl font-semibold ${*/}
                {/*                    m.score1 > m.score2 ? "text-white" : "text-white/70"*/}
                {/*                }`}>*/}
                {/*                    {m.score1}*/}
                {/*                </p>*/}
                {/*                <p className="text-base sm:text-xl font-semibold text-white/25">:</p>*/}
                {/*                <p className={`text-base sm:text-xl font-semibold ${*/}
                {/*                    m.score2 > m.score1 ? "text-white" : "text-white/50"*/}
                {/*                }`}>*/}
                {/*                    {m.score2}*/}
                {/*                </p>*/}
                {/*            </div>*/}

                {/*            <div*/}
                {/*                className={`flex-1 text-left font-jersey text-base sm:text-xl ${*/}
                {/*                    m.score2 > m.score1 ? "" : "text-gray-500"*/}
                {/*                }`}*/}
                {/*            >*/}
                {/*                <div className="flex justify-start gap-2">*/}
                {/*                    {m.team2}*/}
                {/*                    {m.score2 > m.score1 && (*/}
                {/*                        <Crown className="size-4 sm:size-5 text-yellow-500 place-self-center"/>*/}
                {/*                    )}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        <p className="hidden sm:block text-sm text-gray-700 font-semibold min-w-28 text-right">*/}
                {/*            {m.time}*/}
                {/*        </p>*/}

                {/*        {showAdmin && (*/}
                {/*            <button*/}
                {/*                className="text-base font-semibold bg-white border border-gray-300*/}
                {/*                           text-gray-700 px-3.5 py-1 rounded-md cursor-pointer*/}
                {/*                           hover:bg-gray-100 transition-colors duration-300*/}
                {/*                           w-full sm:w-auto"*/}
                {/*            >*/}
                {/*                Edit*/}
                {/*            </button>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
        );
    }

    function renderUpcomingTab() {
        return (
            <div className="flex flex-col gap-2.5">
                <p className="text-center">Placeholder</p>
                {/*{UPCOMING.map((m) => (*/}
                {/*    <div*/}
                {/*        key={m.id}*/}
                {/*        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4*/}
                {/*                   bg-gray-50 border border-gray-100 rounded-xl shadow-sm"*/}
                {/*    >*/}
                {/*        <div className="flex justify-between sm:contents">*/}
                {/*            <p className="text-xs font-bold tracking-wider uppercase text-gray-700 sm:min-w-12">*/}
                {/*                R{m.round}*/}
                {/*            </p>*/}
                {/*            <p className="text-sm text-gray-700 font-semibold sm:hidden">*/}
                {/*                {m.time}*/}
                {/*            </p>*/}
                {/*        </div>*/}

                {/*        <div className="flex-1 flex items-center justify-center gap-3 sm:gap-4">*/}
                {/*            <p className="flex-1 text-right font-jersey text-base sm:text-xl">*/}
                {/*                {m.team1}*/}
                {/*            </p>*/}

                {/*            <p className="px-3 sm:px-5 py-1.5 rounded-lg text-sm font-extrabold tracking-widest*/}
                {/*                          bg-red-50 border border-primary text-primary shrink-0">*/}
                {/*                VS*/}
                {/*            </p>*/}

                {/*            <p className="flex-1 text-left font-jersey text-base sm:text-xl">*/}
                {/*                {m.team2}*/}
                {/*            </p>*/}
                {/*        </div>*/}

                {/*        <p className="hidden sm:block text-sm text-gray-700 font-semibold min-w-28 text-right">*/}
                {/*            {m.time}*/}
                {/*        </p>*/}

                {/*        {showAdmin && (*/}
                {/*            <button className={`${redButtonClassName} w-full sm:w-auto`}>*/}
                {/*                <CalendarSync className="size-5"/>*/}
                {/*                Reschedule*/}
                {/*            </button>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            {/* HEADER */}
            <header className="pb-2">
                <div className="flex flex-wrap justify-between items-start gap-4">

                    {/* Event Details */}
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-white
                                        bg-secondary px-3 py-1 rounded w-fit mb-3"
                        >
                            Organizer View
                        </p>

                        {/* Event name */}
                        <h1 className="text-3xl lg:text-5xl font-jersey text-primary">
                            {event.name}
                        </h1>

                        {/* Video game name and start/end time */}
                        <div className="mt-1 flex flex-col gap-x-2 text-base text-gray-600">
                            <span className="font-semibold text-gray-800 lg:text-lg">{event.video_game_name}</span>
                            <span>
                                {formatDate(event.start_time, 'MMM d, yyyy')} — {formatDate(event.end_time, 'MMM d, yyyy')}
                            </span>
                        </div>

                        {/* Bracket phases involved in this event */}
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                            {bracketPhases.map((bp, index) => (
                                <div key={bp.id} className="flex items-center gap-1.5">
                                    <Link
                                        href={`/tournaments/${event.tournament_id}/events/${event.id}/brackets?bpid=${bp.id}`}>
                                        <span className="hover:text-primary transition-colors">{bp.name}</span>
                                    </Link>

                                    {index !== bracketPhases.length - 1 && (
                                        <ChevronRight className="size-3.5"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin tools button */}
                    <button
                        onClick={() => setShowAdmin(!showAdmin)}
                        className={redButtonClassName}
                    >
                        {showAdmin ? <X className="size-5"/> : <Wrench className="size-5"/>}
                        {showAdmin ? "Close Admin Tools" : "Admin Tools"}
                    </button>
                </div>
            </header>

            {/* ADMIN PANEL */}
            {showAdmin && (
                <div className="my-6 p-5 rounded-xl border border-zinc-700 bg-zinc-800 text-white">
                    <p className="font-jersey text-base md:text-lg lg:text-xl uppercase text-white mb-4">
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
                                                hover:text-white font-jersey text-sm md:text-lg"
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* TABS */}
            <nav className="flex mt-7">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`flex-1 sm:flex-none px-2 sm:px-7 py-2 text-sm md:text-lg uppercase
                                        -mb-0.5 transition-colors cursor-pointer border-b-3 font-jersey
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
                {activeTab === "brackets" && renderBracketsTab()}
                {activeTab === "players" && renderPlayersTab()}
                {activeTab === "matches" && renderMatchesTab()}
                {activeTab === "upcoming" && renderUpcomingTab()}
            </div>

            {/* footer */}
            <div
                className="py-5 border-t border-gray-300 text-xs text-gray-400 text-center tracking-wider font-semibold">
                LAST SYNCED {formatSyncedAgo(syncedAt)}
            </div>
        </div>
    );
}