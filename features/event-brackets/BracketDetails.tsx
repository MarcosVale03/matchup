'use client'

import {FetchBracketPhasesResponse, FetchPhaseGroupsResponse} from "@/server/queries/phases.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";

export default function BracketDetails({bracketPhases, currBP, phaseGroups}: {
    bracketPhases: FetchBracketPhasesResponse,
    currBP: number,
    phaseGroups: {
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
    }[]
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleClick = (bpid: number) => {
        const params = new URLSearchParams(searchParams);
        if (bpid > 0) {
            params.set('bpid', bpid.toString());
        } else {
            params.delete('bpid');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="overflow-y-auto overflow-x-scroll mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <div className="mx-auto p-4 sm:p-6 lg:p-8">
                {/* TABS */}
                <nav className="flex mt-7">
                    <button
                        key={0}
                        onClick={() => handleClick(0)}
                        className={`flex-1 sm:flex-none px-2 sm:px-7 py-2 text-sm md:text-lg uppercase
                                            -mb-0.5 transition-colors cursor-pointer border-b-3 font-jersey-25
                                ${
                            currBP === 0
                                ? "text-primary border-primary"
                                : "text-gray-700 border-transparent"
                        }`}
                    >
                        Summary
                    </button>
                    {(bracketPhases).map((bp) => (
                        <button
                            key={bp.id}
                            onClick={() => handleClick(bp.id)}
                            className={`flex-1 sm:flex-none px-2 sm:px-7 py-2 text-sm md:text-lg uppercase
                                            -mb-0.5 transition-colors cursor-pointer border-b-3 font-jersey-25
                                ${
                                currBP === bp.id
                                    ? "text-primary border-primary"
                                    : "text-gray-700 border-transparent"
                            }`}
                        >
                            {bp.name}
                        </button>
                    ))}
                </nav>
                <div className="flex flex-col gap-8 my-4">
                    {phaseGroups.map(bp => {
                        return (
                            <div key={bp.bp.id} className="flex flex-col gap-2">
                                <h3 className='font-jersey-25 text-base sm:text-3xl'>{bp.bp.name}</h3>
                                <p>{`${bp.bp.num_entrants} Entrants • ${bp.bp.num_pools} Pools • ${bp.bp.bracket_type_name}
                                ${bp.bp.next_phase_id !== null ? ` • ${bp.bp.num_progressing_per_group}/Pool to ${bp.bp.next_phase_name}` : ''}`}</p>

                                <div className="flex flex-col gap-2.5">
                                    {bp.pg.map((pg) => (
                                        <Link key={pg.identifier} href={`/tournaments/${pg.tournament_id}/events/${pg.event_id}/brackets/${bp.bp.id}/${pg.identifier}`}>
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-5 py-4
                                   bg-gray-50 border border-gray-100 rounded-xl shadow-sm"
                                            >


                                                {/* Bracket Name */}
                                                <div className="flex items-center justify-center gap-3 sm:gap-4">
                                                    <div
                                                        className={`text-right font-jersey-25 text-base sm:text-xl`}
                                                    >
                                                        <p>Pool {pg.identifier}</p>
                                                    </div>


                                                </div>




                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}