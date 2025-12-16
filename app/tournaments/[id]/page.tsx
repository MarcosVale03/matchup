import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound } from "next/navigation";
import { Tournament } from "@/lib/types/types";
import TournamentDetails from "@/features/tournament-search/tournament-details";

export default async function Page({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const {success, data} = await fetchTournamentFromId(id)
    if (!success || !data) {
        notFound()
    }

    const tournament: Tournament = data;
    return (
        <TournamentDetails tournament={tournament}/>
    )
}