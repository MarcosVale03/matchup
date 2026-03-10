import {fetchEventFromEventId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";

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


    return (<div>
        <h1>{event.name}</h1>
    </div>)
}