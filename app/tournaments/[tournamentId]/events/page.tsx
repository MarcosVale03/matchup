import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";

export default async function Page({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params
    const tournamentId = Number(idStr);

    if (isNaN(tournamentId) || tournamentId <= 0) {
        notFound();
    }

    const {success, events} = await fetchEventsFromTournamentId(tournamentId);

    if (!success || events === undefined) {
        notFound();
    }


    return (<div>
        {events.map((event) => {
            return (<li key={event.id}>
                {event.name}
            </li>)
        })}
    </div>)
}