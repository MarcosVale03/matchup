import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/server/db/server";
import TournamentDetails from "@/features/tournament-search/tournament-details";

export default async function DetailsPage({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const { success, tournament } = await fetchTournamentFromId(id);
    if (!success || !tournament) {
        notFound();
    }

    // getting the permissions for editing and deleting
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    const permissions = {
        canEdit: user?.id === tournament.owner.user_id,
        canDelete: user?.id === tournament.owner.user_id,
    };

    return (
        <main className="bg-white flex flex-col font-[Poppins]">
            <TournamentDetails tournament={tournament} permissions={permissions} />
        </main>
    );
}