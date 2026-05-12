import {notFound, redirect} from "next/navigation";
import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";
import {doesTournamentExist} from "@/server/queries/tournaments.queries";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ tournamentId: string }> }
) {
    const { tournamentId: tidStr} = await params
    const tournamentId = Number(tidStr);

    if (isNaN(tournamentId) || tournamentId <= 0) {
        notFound();
    }

    if (!(await doesTournamentExist(tournamentId))) {
        notFound();
    }

    // Kicks user out if they don't have permission to view the page
    const user = await getUser();
    const permissions = user ? await hasPermissionLevel(user.id, tournamentId, PermissionLevel.Moderator) : false
    if (!permissions) {
        notFound()
    }

    const {success, events} = await fetchEventsFromTournamentId(tournamentId);

    if (!success || events === undefined) {
        notFound();
    }

    redirect(`/admin/tournaments/${tournamentId}/seeding/${events[0].id}`);


}