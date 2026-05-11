import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";
import EventList from "@/features/tournament-events/event-list";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";

export default async function Events({ params }: { params: Promise<{ tournamentId: string }> }) {
    const { tournamentId: idStr } = await params
    const tournamentId = Number(idStr);

    if (isNaN(tournamentId) || tournamentId <= 0) {
        notFound();
    }

    const {success, events} = await fetchEventsFromTournamentId(tournamentId);

    if (!success || events === undefined) {
        notFound();
    }

    // Kicks user out if they don't have permission to view the page
    const user = await getUser();
    const permissions = await hasPermissionLevel(user.id, tournamentId, PermissionLevel.Reporter)
    if (!permissions) {
        notFound()
    }

    return (
        <div className="bg-main-bg flex flex-1 flex-col font-poppins text-black">
            {/*<EventList events={events} />*/}
        </div>)
}