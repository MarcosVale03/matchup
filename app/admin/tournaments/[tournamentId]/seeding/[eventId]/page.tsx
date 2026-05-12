import {notFound} from "next/navigation";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";
import SeedEditor from "@/features/seeding/SeedEditor";
import {doesEventExist, fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {fetchSeedsFromEvent} from "@/server/queries/seeding.queries";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export default async function Page(
    { params }: { params: Promise<{ tournamentId: string, eventId: string }> }
) {
    const { tournamentId: tidStr, eventId: eidStr} = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0) {
        notFound();
    }

    if (!(await doesEventExist(tournamentId, eventId))) {
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

    const phaseGroups = await fetchSeedsFromEvent(tournamentId, eventId);

    return (
        <main className="bg-main-bg flex flex-col font-[Poppins] text-black">
            <Link
                href={`/admin/tournaments/${tournamentId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary
                           transition-colors ml-4 mt-6"
            >
                <ArrowLeft className="size-4" />
                Back to tournament details
            </Link>
            <SeedEditor tournamentId={tournamentId} events={events} currEventId={eventId} phaseGroupsInit={phaseGroups}/>
        </main>
    )
}