import {fetchEventFromEventId, fetchMatchesFromEventId, fetchStandings} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";
import EventDetails from "@/features/tournament-events/event-details";
import {fetchBracketPhasesFromEventId} from "@/server/queries/phases.queries";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";

export default async function Page({ params }: { params: Promise<{ tournamentId: string, eventId: string }> }) {
    const { tournamentId: tidStr, eventId: eidStr } = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0) {
        notFound();
    }

    const {success, event} = await fetchEventFromEventId(tournamentId, eventId);

    if (!success || event === undefined) {
        notFound();
    }

    // Kick the user out if they don't have permission to view the admin page
    const user = await getUser();
    const permissions = await hasPermissionLevel(user.id, tournamentId, PermissionLevel.Reporter)
    if (!permissions) {
        notFound()
    }

    const [bracket_phases, standings, matchesRes] = await Promise.all([
        fetchBracketPhasesFromEventId(tournamentId, eventId),
        fetchStandings(tournamentId, eventId),
        fetchMatchesFromEventId(tournamentId, eventId)
    ]);

    const matches = matchesRes.matches ?? [];

    return (
        <div className="flex-1 bg-main-bg font-poppins text-black overflow-y-auto mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <Link
                href={`/admin/tournaments/${tournamentId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary
                           transition-colors ml-4 mt-6"
            >
                <ArrowLeft className="size-4" />
                Back to tournament details
            </Link>
            <EventDetails event={event} bracketPhases={bracket_phases} standings={standings} matches={matches} isAdmin />
        </div>
    )
}
