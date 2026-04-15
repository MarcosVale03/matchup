'use client'

import {FetchBracketPhasesResponse} from "@/server/queries/phases.queries";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function BracketDetails({bracketPhases, currBP}: {
    bracketPhases: FetchBracketPhasesResponse,
    currBP: number
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
        <div>
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
        </div>
    )
}