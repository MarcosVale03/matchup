import ForumThreadList from '@/features/forum-results.tsx/forum-thread-list';
import { fetchThreads } from '@/server/queries/forum.queries';

export default async function ForumsPage() {
    const threads = await fetchThreads();
    const threadData = threads.success ? (threads.data ?? []) : [];


    return (
        <main className="flex-col bg-main-bg font-poppins text-black justify-center items-center p-4 md:px-8 3xl:px-32">
            <div className="text-center mb-6 mt-4 w-fit place-self-center">
                <h1 className="text-3xl md:text-4xl 3xl:text-5xl font-jersey tracking-wide font-normal">
                    Welcome to the Matchup Forums: Connect and Share!
                </h1>
            </div>

            <ForumThreadList threads={threadData} />
        </main>
    );
}