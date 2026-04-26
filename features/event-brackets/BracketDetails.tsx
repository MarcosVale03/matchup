'use client'
import {FetchBracketPhasesResponse, FetchPhaseGroupsResponse} from "@/server/queries/phases.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {ArrowRight, GitBranch, GitFork, Repeat, Trophy, Users} from "lucide-react";

type PhaseGroupSection = {
    bp: {
        bracket_type_name: string
        event_id: number
        id: number
        name: string
        next_phase_id: number | null
        next_phase_name: string | null
        num_progressing_per_group: number
        tournament_id: number
        num_pools: number
        num_entrants: number
    }
    pg: FetchPhaseGroupsResponse
}

function BracketTypeIcon({type, className}: { type: string; className?: string }) {
    const t = type.toLowerCase();
    if (t.includes("double")) return <GitFork className={className}/>;
    if (t.includes("single")) return <GitBranch className={className}/>;
    if (t.includes("round")) return <Repeat className={className}/>;
    return <Trophy className={className}/>;
}

function PhaseFlow({bracketPhases, currBP, onSelect}: {
    bracketPhases: FetchBracketPhasesResponse;
    currBP: number;
    onSelect: (id: number) => void;
}) {
    if (bracketPhases.length <= 1) return null;

    return (
        <div className="flex items-center gap-2 min-w-fit overflow-x-auto">
            {bracketPhases.map((bp, i) => {
                const active = currBP === bp.id;
                return (
                    <div key={bp.id} className="flex items-center gap-2 shrink-0">

                        {/* Bracket phase card */}
                        <button
                            onClick={() => onSelect(bp.id)}
                            className={`group relative px-4 py-2 rounded-lg border transition-all cursor-pointer
                                ${active
                                ? "bg-primary border-primary text-white shadow-sm"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-primary/40 hover:bg-white"}`}
                        >
                            <div className="flex items-center gap-2">
                                {/* Icon and bracket phase name and type */}
                                <BracketTypeIcon
                                    type={bp.bracket_type_name}
                                    className={`size-4 ${active ? "text-white" : "text-primary"}`}
                                />
                                <div className="text-left leading-tight">
                                    <p className="font-jersey text-base whitespace-nowrap">{bp.name}</p>
                                    <p className={`text-[10px] uppercase tracking-wider ${active ? "text-white/75" : "text-gray-400"}`}>
                                        {bp.bracket_type_name}
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Number of progressing */}
                        {i < bracketPhases.length - 1 && (
                            <div className="flex flex-col items-center gap-0.5 px-1">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                                    {bp.num_progressing_per_group}/pool
                                </span>
                                <ArrowRight className="size-4 text-gray-600"/>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Chips to the right of the phase header
function StatChip({label, value, accent = false}: {
    label: string;
    value: string | number;
    accent?: boolean;
}) {
    return (
        <div
            className={`flex items-baseline gap-2 rounded-full px-3 py-1
                ${accent ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-700"}`}
        >
            <span
                className={`text-[10px] uppercase tracking-wider font-semibold ${accent ? "text-primary/80" : "text-gray-500"}`}>
                {label}
            </span>
            <span className="font-jersey text-base tabular-nums">{value}</span>
        </div>
    );
}

// Card under the header of the phase
function PoolCard({
    identifier,
    href,
    index,
}: {
    identifier: string;
    href: string;
    index: number;
}) {
    return (
        <Link
            key={index}
            href={href}
            className="group relative block rounded-xl bg-white border border-gray-100 shadow-sm
                       hover:shadow-md hover:border-primary/40 transition-all overflow-hidden"
        >
            <div className="relative px-5 py-4 flex items-center gap-4">
                <div
                    className="shrink-0 w-14 h-14 rounded-lg bg-white border border-gray-200
                               group-hover:bg-primary group-hover:border-primary transition-colors
                               flex items-center justify-center"
                >
                    <span
                        className="font-jersey text-3xl text-gray-700 group-hover:text-white transition-colors"
                    >
                        {identifier[0]}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        Pool
                    </p>
                    <p className="font-jersey text-xl text-gray-800 truncate">
                        {identifier}
                    </p>
                </div>
                <ArrowRight
                    className="size-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0"
                />
            </div>
        </Link>
    );
}

function PhaseSection({section}: { section: PhaseGroupSection }) {
    const {bp, pg} = section;

    return (
        <section className="relative rounded-2xl bg-main-bg overflow-hidden">
            <div>
                <div className="pl-5 pr-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white">
                    {/* Header - Bracket name and type */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BracketTypeIcon type={bp.bracket_type_name} className="size-5 text-primary"/>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-jersey text-2xl sm:text-3xl text-black truncate leading-none">
                                {bp.name}
                            </h3>
                            <p className="text-xs uppercase text-gray-500 mt-1">
                                {bp.bracket_type_name}
                            </p>
                        </div>
                    </div>

                    {/* Right of header - total entrants, num of pools and progression if applicable */}
                    <div className="flex flex-wrap gap-2">
                        <StatChip label="Entrants" value={bp.num_entrants}/>
                        <StatChip label="Pools" value={bp.num_pools}/>
                        {bp.next_phase_id !== null && (
                            <StatChip
                                label={`Top ${bp.num_progressing_per_group}/pool →`}
                                value={bp.next_phase_name ?? ""}
                                accent
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Pools grid */}
            <div className="p-5">
                {pg.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
                        <Users className="size-4"/>
                        <p className="text-sm">No pools yet</p>
                    </div>
                ) : (
                    <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                        {pg.map((pool, i) => (
                            <PoolCard
                                key={pool.identifier}
                                identifier={pool.identifier}
                                index={i}
                                href={`/tournaments/${pool.tournament_id}/events/${pool.event_id}/brackets/${bp.id}/${pool.identifier}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default function BracketDetails({bracketPhases, currBP, phaseGroups}: {
    bracketPhases: FetchBracketPhasesResponse,
    currBP: number,
    phaseGroups: PhaseGroupSection[]
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const {replace} = useRouter()

    const handleClick = (bpid: number) => {
        const params = new URLSearchParams(searchParams);
        if (bpid > 0) {
            params.set('bpid', bpid.toString());
        } else {
            params.delete('bpid');
        }
        const qs = params.toString();
        replace(qs ? `${pathname}?${qs}` : pathname);
    }

    return (
        <div className="flex-1 mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 flex flex-col gap-6">
            {/* SEGMENTED TABS */}
            <div className="flex flex-col justify-center gap-2">
                <nav
                    className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white border border-gray-100 shadow-sm w-fit">
                    <button
                        onClick={() => handleClick(0)}
                        className={`px-4 py-1.5 rounded-lg text-sm sm:text-base font-jersey uppercase tracking-wide
                                transition-colors cursor-pointer
                                ${currBP === 0
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-600 hover:text-primary"}`}
                    >
                        Summary
                    </button>
                    {bracketPhases.map((bp) => (
                        <button
                            key={bp.id}
                            onClick={() => handleClick(bp.id)}
                            className={`px-4 py-1.5 rounded-lg text-sm sm:text-base font-jersey uppercase tracking-wide
                                    transition-colors cursor-pointer flex items-center gap-2
                                    ${currBP === bp.id
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-600 hover:text-primary"}`}
                        >
                            <BracketTypeIcon
                                type={bp.bracket_type_name}
                                className={`size-4 ${currBP === bp.id ? "text-white" : "text-primary"}`}
                            />
                            {bp.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* SUMMARY-ONLY: stats + phase flow */}
            {currBP === 0 && bracketPhases.length > 0 && (
                <PhaseFlow
                    bracketPhases={bracketPhases}
                    currBP={currBP}
                    onSelect={handleClick}
                />
            )}

            {/* PHASE SECTIONS */}
            <div className="flex flex-col gap-6">
                {phaseGroups.map((section) => (
                    <PhaseSection key={section.bp.id} section={section}/>
                ))}
            </div>
        </div>
    )
}
