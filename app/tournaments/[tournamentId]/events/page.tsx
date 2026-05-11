import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";
import EventList from "@/features/tournament-events/event-list";

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


    return (<div className="bg-main-bg flex flex-col font-[Poppins] text-black">
        <EventList events={events} amountRegistered={1}/>
    </div>)
}