import {fetchEventFromEventId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";
import EventDetails from "@/features/tournament-events/event-details";
import {fetchBracketPhasesFromEventId} from "@/server/queries/phases.queries";

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

    const bracket_phases = await fetchBracketPhasesFromEventId(tournamentId, eventId);

    return (
        <div className="flex-1 bg-main-bg font-poppins text-black overflow-y-auto mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <EventDetails event={event} bracketPhases={bracket_phases} />
        </div>
    )
}