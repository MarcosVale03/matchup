import {fetchTournamentFromId} from "@/server/queries/tournaments.queries";
import {notFound} from "next/navigation";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {TournamentDetails} from "@/features/tournament-search/tournament-details";
import {Trophy} from "lucide-react";
import Link from "next/link";
import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";

export default async function TournamentDetailsPage({params}: { params: { tournamentId: string } }) {
    const {tournamentId: idStr} = await params;
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const {success: tournamentSuccess, tournament} = await fetchTournamentFromId(id);
    const {success: eventsSuccess, events} = await fetchEventsFromTournamentId(id);


    if (!tournamentSuccess || !tournament) {
        return (
            <main className="bg-main-bg flex flex-col items-center justify-center py-10 text-black font-poppins">
                <Trophy size={48} className="text-gray-300 mb-4"/>
                <h1 className="text-2xl font-jersey text-gray-700 mb-2">
                    Tournament Does Not Exist
                </h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    This tournament may have been deleted or the link is invalid.
                </p>
                <Link
                    href="/tournaments"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-base font-jersey
                                hover:bg-secondary transition-colors duration-150"
                >
                    Back to Tournaments
                </Link>
            </main>
        );
    }

    // getting the permissions for editing and deleting
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {data: {user}} = await supabase.auth.getUser();

    const permissions = {
        canEdit: user?.id === tournament.owner.user_id,
        canDelete: user?.id === tournament.owner.user_id,
    };

    return (
        <TournamentDetails
            tournament={tournament}
            permissions={permissions}
            events={events}
        />
    );
}