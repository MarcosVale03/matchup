import { notFound } from "next/dist/client/components/navigation";
import { fetchThreads } from "@/server/queries/forum.queries";
import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import ForumPostList from "@/features/forum-results.tsx/forum-thread-list";


export default async function TournamentForum({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const posts = await fetchThreads();
    const tournamentData = (await fetchTournamentFromId(id)).tournament;

    if (!posts.success || !posts.data) {
        return (
            <div className="bg-white py-6 font-[Poppins]">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-5 ">
                    <h1 className="text-center font-bold text-primary mb-2 text-xl sm:text-2xl lg:text-4xl">
                        {tournamentData?.id ? tournamentData.name : "Tournament Forum"}
                    </h1>
                    <p className="mt-3 text-base sm:text-md text-gray-600 max-w-2xl mx-auto">
                        Discuss strategies, ask questions, and connect with other participants
                    </p>
                </div>

                {/* Main content */}
                <div className="bg-white overflow-hidden">
                    <ForumPostList posts={[]} tournamentData={tournamentData} />
                </div>
            </div>
        </div>

        );
    }

    return (
        <div className="bg-white py-6 font-[Poppins]">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-5 ">
                    <h1 className="text-center font-bold text-primary mb-2 text-xl sm:text-2xl lg:text-4xl">
                        {tournamentData?.id ? tournamentData.name : "Tournament Forum"}
                    </h1>
                    <p className="mt-3 text-base sm:text-md text-gray-600 max-w-2xl mx-auto">
                        Discuss strategies, ask questions, and connect with other participants
                    </p>
                </div>

                {/* Main content */}
                <div className="bg-white overflow-hidden">
                    <ForumPostList posts={posts.data!} tournamentData={tournamentData} />
                </div>
            </div>
        </div>
    );
}