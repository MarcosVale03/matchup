import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound } from "next/navigation";
import TournamentDetails from "@/features/tournament-search/tournament-details";
import NavigationBar from "@/ui/navigation-bar";

export default async function Page({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const { success, tournament } = await fetchTournamentFromId(id)
    if (!success || !tournament) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-white flex flex-col">
            <NavigationBar />
            <div>
                <TournamentDetails tournament={tournament} />
            </div>
        </main>
    );

}