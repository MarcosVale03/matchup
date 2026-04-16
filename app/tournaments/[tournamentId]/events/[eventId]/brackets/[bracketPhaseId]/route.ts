import {notFound, redirect} from "next/navigation";
import {doesBracketPhaseExist} from "@/server/queries/phases.queries";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ tournamentId: string, eventId: string, bracketPhaseId: string}> }
) {
    const { tournamentId: tidStr, eventId: eidStr, bracketPhaseId: bpidStr } = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);
    const bracketPhaseId = Number(bpidStr);

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0 || isNaN(bracketPhaseId) || bracketPhaseId <= 0) {
        notFound();
    }

    if (!(await doesBracketPhaseExist(tournamentId, eventId, bracketPhaseId))) {
        notFound()
    }
    redirect(`/tournaments/${tournamentId}/events/${eventId}/brackets?bpid=${bracketPhaseId}`);
}