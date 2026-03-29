import {notFound} from "next/navigation";
import {fetchThreadWithPosts} from "@/server/queries/forum.queries";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {ThreadView} from "@/features/forum-results.tsx/thread-view";

export default async function ThreadDetailsAndPosts({ params, searchParams }: {
    params: { threadId: string };
    searchParams: { title: string };
}) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    const { threadId } = await params;
    const { title } = await searchParams;

    if (!threadId) notFound();

    const ThreadWithPosts = await fetchThreadWithPosts(threadId);
    const ThreadWithPostsData = ThreadWithPosts.success ? (ThreadWithPosts.data ?? []) : [];
    const mainThread = ThreadWithPostsData[0];
    const posts = ThreadWithPostsData.slice(1);

    if (!mainThread) notFound();

    return (
        <ThreadView
            title={title}
            mainThread={mainThread}
            posts={posts}
            isOwner={user?.id === mainThread.author_id}
        />
    );
}