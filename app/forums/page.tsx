import ForumThreadList from '@/features/forum-results.tsx/forum-thread-list';
import { fetchThreads } from '@/server/queries/forum.queries';

export default async function ForumsPage() {

    const posts = await fetchThreads();

    // If we don't have posts, render an empty forum post list with a welcome message
    if (!posts.success || !posts.data) {
        return (
            <main className="bg-white flex flex-col font-[Poppins]">
                <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 mx-auto w-full max-w-7xl">

                    <h1 className="text-center font-bold text-primary mb-5 sm:mb-6 lg:mb-8 text-xl sm:text-3xl lg:text-4xl">
                        Welcome to the Matchup Forums: Connect and Share!
                    </h1>
                    <ForumThreadList posts={[]} />
                </div>
            </main>
        );
    }

    // If we have posts, render the forum post list
    return (
        <main className="bg-white flex flex-col font-[Poppins] justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full lg:px-8">

                <h1 className="text-center font-bold text-primary mb-5 sm:mb-6 lg:mb-8 text-xl sm:text-3xl lg:text-4xl">
                    Welcome to the Matchup Forums: Connect and Share!
                </h1>
                
                <ForumThreadList posts={posts.data} />
            </div>
        </main>
    );
}