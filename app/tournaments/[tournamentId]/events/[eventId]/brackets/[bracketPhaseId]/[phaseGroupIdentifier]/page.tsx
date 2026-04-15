import {notFound} from "next/navigation";
import {
    doesPhaseGroupExist,
    fetchBracketTypeFromBracketPhase
} from "@/server/queries/phases.queries";

export default async function Page({ params }: { params: Promise<{
    tournamentId: string,
    eventId: string,
    bracketPhaseId: string,
    phaseGroupIdentifier: string
}> }) {
    const { tournamentId: tidStr, eventId: eidStr, bracketPhaseId: bpidStr, phaseGroupIdentifier} = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);
    const bracketPhaseId = Number(bpidStr);

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
    console.log(bracketType)


    return (
        <div>

        </div>
    )
}