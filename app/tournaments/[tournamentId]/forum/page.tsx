import { notFound } from "next/dist/client/components/navigation";
import { fetchThreads } from "@/server/queries/forum.queries";
import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import ForumPostList from "@/features/forum-results.tsx/forum-thread-list";


export default async function TournamentForum({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const threads = await fetchThreads();
    const tournamentData = (await fetchTournamentFromId(id)).tournament;

    return (
        <></>
    );
}