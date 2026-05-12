import {notFound, redirect} from "next/navigation";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";
import {
    doesBracketPhaseExist,
    fetchPhaseGroupsFromBracketPhase
} from "@/server/queries/phases.queries";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ tournamentId: string, eventId: string, bracketPhaseId: string }> }
) {
    const { tournamentId: tidStr, eventId: eidStr, bracketPhaseId: bpidStr} = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);
    const bracketPhaseId = Number(bpidStr);

    if (isNaN(tournamentId) || tournamentId <= 0) {
        notFound();
    }

    if (!(await doesBracketPhaseExist(tournamentId, eventId, bracketPhaseId))) {
        notFound();
    }

    // Kicks user out if they don't have permission to view the page
    const user = await getUser();
    const permissions = user ? await hasPermissionLevel(user.id, tournamentId, PermissionLevel.Moderator) : false
    if (!permissions) {
        notFound()
    }

    const phaseGroups = await fetchPhaseGroupsFromBracketPhase(tournamentId, eventId, bracketPhaseId);

    redirect(`/admin/tournaments/${tournamentId}/reporting/${eventId}/${bracketPhaseId}/${phaseGroups[0].identifier}`);


}