import {notFound} from "next/navigation";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {BracketType, PermissionLevel} from "@/lib/types/types";
import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {
    doesPhaseGroupExist,
    fetchBracketPhasesFromEventId,
    fetchBracketTypeFromBracketPhase, fetchPhaseGroupsFromBracketPhase
} from "@/server/queries/phases.queries";
import SingleElimBracket from "@/features/event-brackets/admin-single-elim-bracket";
import {fetchBracket} from "@/server/queries/brackets.queries";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export default async function Page(
    { params, searchParams }: { params: Promise<{ tournamentId: string, eventId: string, bracketPhaseId: string, phaseGroupIdentifier: string }>
        searchParams?: Promise<{
            r: string,
            m: string
        }>}
) {
    const { tournamentId: tidStr, eventId: eidStr, bracketPhaseId: bpidStr, phaseGroupIdentifier} = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);
    const bracketPhaseId = Number(bpidStr)
    const sparams = await searchParams
    const round = sparams ? Number(sparams.r) : null
    const match = sparams ? Number(sparams.m) : null;

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0 || isNaN(bracketPhaseId) || bracketPhaseId <= 0) {
        notFound();
    }

    if (!(await doesPhaseGroupExist(tournamentId, eventId, bracketPhaseId, phaseGroupIdentifier))) {
        notFound()
    }

    // Kicks user out if they don't have permission to view the page
    const user = await getUser();
    const permissions = await hasPermissionLevel(user.id, tournamentId, PermissionLevel.Moderator)
    if (!permissions) {
        notFound()
    }

    const {success: eSuccess, events} = await fetchEventsFromTournamentId(tournamentId);
    if (!eSuccess || !events) {
        notFound()
    }

    const bracketPhases = await fetchBracketPhasesFromEventId(tournamentId, eventId);

    const phaseGroups = await fetchPhaseGroupsFromBracketPhase(tournamentId, eventId, bracketPhaseId);

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
            <Link
                href={`/admin/tournaments/${tournamentId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary
                           transition-colors ml-4 mt-6"
            >
                <ArrowLeft className="size-4" />
                Back to tournament details
            </Link>
            {bracketType == BracketType.SingleElimination && <SingleElimBracket
                tournamentId={tournamentId} events={events} currEventId={eventId}
                bracketPhases={bracketPhases} currBP={bracketPhaseId}
                phaseGroups={phaseGroups} currPG={phaseGroupIdentifier}
                rounds={matches} match={match} round={round} />}
        </div>
    )
}