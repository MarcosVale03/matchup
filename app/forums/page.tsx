import ForumThreadList from '@/features/forum-results.tsx/forum-thread-list';
import { fetchThreads } from '@/server/queries/forum.queries';

export default async function ForumsPage() {
    const threads = await fetchThreads();
    const threadData = threads.success ? (threads.data ?? []) : [];


    return (
        <main className="flex-col bg-main-bg font-poppins text-black justify-center items-center p-4 md:px-8 3xl:px-32">
            <div className="text-center mb-6 mt-4 w-fit place-self-center">
                <h2 className="">
                    Welcome to the Matchup Forums: Connect and Share!
                </h2>
            </div>

            <ForumThreadList threads={threadData} />
        </main>
    );
}