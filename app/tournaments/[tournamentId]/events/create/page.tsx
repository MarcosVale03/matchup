import { fetchTournamentFromId } from '@/server/queries/tournaments.queries';
import { notFound, redirect } from 'next/navigation';
import EventInsertForm from '@/features/tournament-events/create-event';
import {getUser} from "@/server/queries/users.queries";

export default async function CreateEventPage({
    params,
}: {
    params: { tournamentId: string };
}) {
    const { tournamentId: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const user = await getUser();

    const { success, tournament } = await fetchTournamentFromId(id);

    if (!success || !tournament) {
        notFound();
    }

    if (!user || user.id !== tournament.owner.user_id) {
        redirect(`/tournaments/${id}`);
    }

    return (
        <div className="bg-main-bg flex-1 flex flex-col text-black font-poppins">
            <EventInsertForm
                tournamentId={tournament.id}
                tournamentName={tournament.name}
                tournamentStart={tournament.start_time}
                tournamentEnd={tournament.end_time}
            />
        </div>
    );
}
