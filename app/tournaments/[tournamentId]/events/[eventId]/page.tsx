import {fetchEventFromEventId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";
import EventDetails from "@/features/tournament-events/event-details";

export default async function Page({ params }: { params: { tournamentId: string, eventId: string } }) {
    const { tournamentId: tidStr, eventId: eidStr } = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0) {
        notFound();
    }

    console.log(tournamentId, eventId);
    const {success, event} = await fetchEventFromEventId(tournamentId, eventId);

    if (!success || event === undefined) {
        notFound();
    }


    return (
        <div className="bg-main-bg font-[Poppins] text-black">
            <EventDetails event={event} />
        </div>
    )
}