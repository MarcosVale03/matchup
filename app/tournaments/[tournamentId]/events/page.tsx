import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {notFound} from "next/navigation";
import Link from "next/link";

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


    return (<div>
        {events.map((event) => {
            return (<li key={event.id}>
                <Link href={`/tournaments/${tournamentId}/events/${event.id}`}>{event.name}</Link>
            </li>)
        })}
    </div>)
}