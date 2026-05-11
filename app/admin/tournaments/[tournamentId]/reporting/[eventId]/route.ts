import {notFound, redirect} from "next/navigation";
import {doesEventExist} from "@/server/queries/events.queries";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";
import {fetchBracketPhasesFromEventId} from "@/server/queries/phases.queries";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ tournamentId: string, eventId: string }> }
) {
    const { tournamentId: tidStr, eventId: eidStr} = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);

    if (isNaN(tournamentId) || tournamentId <= 0) {
        notFound();
    }

    if (!(await doesEventExist(tournamentId, eventId))) {
        notFound();
    }

    // Kicks user out if they don't have permission to view the page
    const user = await getUser();
    const permissions = await hasPermissionLevel(user.id, tournamentId, PermissionLevel.Moderator)
    if (!permissions) {
        notFound()
    }

    const bracketPhases = await fetchBracketPhasesFromEventId(tournamentId, eventId);

    redirect(`/admin/tournaments/${tournamentId}/reporting/${eventId}/${bracketPhases[0].id}`);


}