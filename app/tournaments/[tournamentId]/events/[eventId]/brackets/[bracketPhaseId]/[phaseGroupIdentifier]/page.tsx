import {notFound} from "next/navigation";
import {doesPhaseGroupExist, fetchBracketTypeFromBracketPhase} from "@/server/queries/phases.queries";
import SingleElimBracket from "@/features/tournament-events/single-elim-bracket";
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
        <div>
            {bracketType == BracketType.SingleElimination && <SingleElimBracket rounds={matches} match={match} round={round} />}
        </div>
    )
}