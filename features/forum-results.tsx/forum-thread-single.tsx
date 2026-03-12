'use client'
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { formatDateTime } from "@/ui/format-time";
import { fetchThreadWithPosts } from "@/server/queries/forum.queries";
import AddForumPost from "../forum-crud/add-post";
import ForumPostsList from "./forum-post-list";
import DeleteThread from "../forum-crud/delete-thread";
import { Post, Thread } from "@/server/queries/forum.queries";
import { useProfile } from "@/app/client-layout";
import { useToast } from "@/ui/toast/use-toast";
import { Toast } from "@/ui/toast/toast";


// onDeleteAction calls handleThreadDeleted in forum-thread-list to show success message after deleting a thread
// Post logic is handled here, with individual crud operations in their respective components.
export default function ForumThreadSingle({
    thread,
    onThreadDeleteAction
}: {
    thread: Thread;
    onThreadDeleteAction?: () => void;
}) {

    const { user } = useProfile();
    const toast = useToast();

    // used to show the add post form when clicking the plus button
    const [isAddPostOpen, setIsAddPostOpen] = useState(false);

    // used to show if the posts for this thread are open or not
    const [arePostsOpen, setArePostsOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);

    // Toggle posts visibility and fetch posts if opening
    const openPosts = async (opts?: { refresh?: boolean }) => {
        const refresh = opts?.refresh ?? true;
        if (arePostsOpen && !refresh) return;

        setArePostsOpen(true);
        setIsLoadingPosts(true);
        setError(null);

        try {
            const response = await fetchThreadWithPosts(thread.id);
            setPosts(response.data ?? []);
        } catch (err) {
            setError("Failed to fetch posts.");
            console.error(err);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    // Handle post deletion, addition, and update to show success messages and update the posts list
    const handlePostDeleted = (postId: string) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
        toast.show("Post deleted successfully!")
    };

    const handlePostAdded = async () => {
        toast.show("Post deleted successfully!")
        setIsAddPostOpen(false);

        // force refresh so the new post shows up
        await openPosts({refresh: true});
    };

    const handlePostUpdated = (updatedPost: Post) => {
        setPosts(prev =>
            prev.map(post =>
                post.id === updatedPost.id ? updatedPost : post
            )
        );
        toast.show("Post updated successfully!")
    };

    // Toggle posts visibility when clicking the button, if opening and posts are already fetched, don't re-fetch
    const togglePosts = async () => {
        if (arePostsOpen) {
            setArePostsOpen(false);
            return;
        }

        await openPosts({refresh: false});
    };

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow mb-4">

            {/* Post Title, Author, Tournament, Timestamp */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 text-black">

                <div className="flex-1 min-w-0">
                    <h3 className="mb-1.5 font-semibold text-lg sm:text-xl text-gray-900 line-clamp-2">
                        {thread.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm text-gray-500">
                        {/* Author */}
                        <span className="font-medium text-primary">
                            {/* {thread.author_id} */} Author Name
                        </span>

                        {/* Separator */}
                        <span className="inline">
                            •
                        </span>

                        {/* Tournament Name */}
                        <span className="font-semibold text-gray-700">
                            Tournament Name
                        </span>

                        {/* Separator */}
                        <span className="hidden sm:inline">
                            •
                        </span>

                        {/* Created at */}
                        <span>
                            {formatDateTime(thread.created_at)}
                        </span>
                    </div>
                </div>

                {/* Add Post and Delete Thread Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                    {/* only show buttons if logged in */}
                    {user && (
                        <>
                            {/* Add post button */}
                            <button
                                type="button"
                                onClick={() => setIsAddPostOpen(true)}
                                className="p-2.5 sm:p-2 text-gray-600 hover:text-primary
                                                 hover:bg-gray-100 rounded-lg transition-colors
                                                 active:bg-gray-200 touch-manipulation"
                                aria-label="Add post"
                            >
                                <Plus className="w-5 h-5"/>
                            </button>
                            {/* Delete button for the thread */}
                            {/* Only shows if it's the owner */}
                            {user.id === thread.author_id && (
                                <>
                                    <DeleteThread
                                        threadId={thread.id}
                                        onConfirm={() => {
                                            onThreadDeleteAction?.();
                                        }}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Thread content */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                {thread.content}
            </p>

            {/* Add Post Form, expands when clicking the plus button*/}
            {isAddPostOpen && (
                <AddForumPost
                    thread={thread}
                    onPostAddedAction={handlePostAdded}
                    onPostCancelAction={() => setIsAddPostOpen(false)}
                />
            )}

            {/* Toggle Posts */}
            <button
                className="text-sm mt-4 text-gray-500 flex gap-1 hover:cursor-pointer hover:text-primary transition-colors"
                onClick={togglePosts}
                disabled={isLoadingPosts}
            >
                {arePostsOpen ? "Hide" : "View"} posts for this thread
                <ChevronDown
                    className={`size-4 place-self-center transition-transform ${arePostsOpen ? "rotate-180" : ""}`}/>
            </button>

            {/* Success message for the posts */}
            <Toast message={toast.message} />

            {/* Error message for the posts */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mt-1">
                    {error}
                </div>
            )}

            {/* Loading state */}
            {arePostsOpen && isLoadingPosts && (
                <p className="text-sm text-gray-400 mt-2">Loading posts...</p>
            )}

            {/* Forum Posts */}
            {arePostsOpen && !isLoadingPosts && (
                <ForumPostsList
                    thread={thread}
                    posts={posts}
                    onPostDelete={handlePostDeleted}
                    onPostUpdate={handlePostUpdated}
                />
            )}
        </div>
    );
}