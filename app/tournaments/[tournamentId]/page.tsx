import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound } from "next/navigation";
import TournamentDetails from "@/features/tournament-search/tournament-details";

export default async function DetailsPage({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const { success, tournament } = await fetchTournamentFromId(id)
    if (!success || !tournament) {
        notFound()
    }

    return (
        <main className="bg-white flex flex-col font-[Poppins]">
            <div>
                <TournamentDetails tournament={tournament} />
            </div>
        </main>
    );
}