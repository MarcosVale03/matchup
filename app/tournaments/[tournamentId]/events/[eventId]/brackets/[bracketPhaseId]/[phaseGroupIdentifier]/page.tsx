import {notFound} from "next/navigation";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {doesPhaseGroupExist, fetchBracketTypeFromBracketPhase} from "@/server/queries/phases.queries";
import SingleElimBracket from "@/features/event-brackets/single-elim-bracket";
import RoundRobinBracket from "@/features/event-brackets/round-robin-bracket";
import {fetchBracket} from "@/server/queries/brackets.queries";
import {BracketType} from "@/lib/types/types";

export default async function Page({ params, searchParams }: { params: Promise<{
    tournamentId: string,
    eventId: string,
    bracketPhaseId: string,
    phaseGroupIdentifier: string
}>;
searchParams?: Promise<{
    r: string,
    m: string
}>}) {
    const { tournamentId: tidStr, eventId: eidStr, bracketPhaseId: bpidStr, phaseGroupIdentifier} = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);
    const bracketPhaseId = Number(bpidStr);
    const sparams = await searchParams
    const round = sparams ? Number(sparams.r) : null
    const match = sparams ? Number(sparams.m) : null

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0 || isNaN(bracketPhaseId) || bracketPhaseId <= 0) {
        notFound();
    }

    if (!(await doesPhaseGroupExist(tournamentId, eventId, bracketPhaseId, phaseGroupIdentifier))) {
        notFound()
    }

    const {success, type: bracketType} = await fetchBracketTypeFromBracketPhase(tournamentId, eventId, bracketPhaseId);
    if (!success) {
        notFound();
    }

    const matches = await fetchBracket(tournamentId, eventId, phaseGroupIdentifier);
    if (!matches) {
        notFound();
    }


    return (
        <div className="flex-1 bg-main-bg font-poppins text-black overflow-y-auto overflow-x-scroll mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <Link
                href={`/tournaments/${tournamentId}/events/${eventId}/brackets`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary
                           transition-colors ml-4 mt-6"
            >
                <ArrowLeft className="size-4" />
                Back to brackets
            </Link>
            {bracketType == BracketType.SingleElimination && <SingleElimBracket rounds={matches} match={match} round={round} />}
            {bracketType == BracketType.RoundRobin && <RoundRobinBracket rounds={matches} />}
        </div>
    )
}