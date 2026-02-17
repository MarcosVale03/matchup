import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Thread, Post } from "@/lib/types/types";
import { formatTournamentDateTime } from "@/ui/format-time";
import { fetchThreadWithPosts } from "@/server/queries/forum.queries";
import DeleteForum from "../forum-crud/delete-forum";
import AddForumPost from "../forum-crud/add-forum-post";
import ForumPost from "./forum-post-single";
import { useRouter } from "next/navigation";

export default function ForumThreadSingle({
    thread,
    onDelete
}: {
    thread: Thread,
    onDelete?: () => void
}) {
    const router = useRouter();
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [arePostsOpen, setArePostsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handlePostDeleted = () => {
        setSuccessMessage("Thread deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Toggle posts visibility and fetch posts if opening
    const handleTogglePosts = async () => {
        if (!arePostsOpen) {
            try {
                setIsLoadingPosts(true);
                const response = await fetchThreadWithPosts(thread.id);
                setPosts(response.data || []);
            } catch (err) {
                setError("Failed to fetch posts.");
            } finally {
                setIsLoadingPosts(false);
            }
        }
        setArePostsOpen(!arePostsOpen);
    }

    const handlePostAdded = (newPost: Post) => {
        setPosts(prevPosts => [...prevPosts, newPost]);
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 text-black">

                {/* Post Title, Author, Tournament, Timestamp */}
                <div className="flex-1 min-w-0">
                    <h3 className="mb-1.5 font-semibold text-lg sm:text-xl text-gray-900 line-clamp-2">
                        {thread.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm text-gray-500">
                        {/* Author */}
                        <span className="font-medium text-primary">
                            {/* {thread.author_id} */} "Author Name"
                        </span>

                        {/* Seperator */}
                        <span className="inline">
                            •
                        </span>

                        {/* Tournament Name */}
                        <span className="font-semibold text-gray-700">
                            "Tournament Name"
                        </span>

                        {/* Seperator */}
                        <span className="hidden sm:inline">
                            •
                        </span>

                        {/* Created at */}
                        <span>
                            {formatTournamentDateTime(thread.created_at)}
                        </span>
                    </div>
                </div>

                {/* Edit/Delete Buttons */}
                {/* Only show edit/delete if current user is author – for now always show */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                        type="button"
                        onClick={() => setIsAddFormOpen(true)}
                        className="p-2.5 sm:p-2 text-gray-600 hover:text-primary 
                                   hover:bg-gray-100 rounded-lg transition-colors 
                                   active:bg-gray-200 touch-manipulation"
                        aria-label="Add post"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2.5 sm:p-2 text-gray-600 hover:text-primary
                                   hover:bg-gray-100 rounded-lg transition-colors 
                                   active:bg-gray-200 touch-manipulation"
                        aria-label="Delete thread"
                    >
                        <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            {/* Thread content */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                {thread.content}
            </p>

            {/* Add Post Form, expands when clicking the plus button*/}
            {isAddFormOpen && (
                <AddForumPost
                    thread={thread}
                    onConfirm={() => {
                        setIsAddFormOpen(false);
                    }}
                    onPostAdded={handlePostAdded}
                    onCancel={() => setIsAddFormOpen(false)}
                />
            )}

            {/* Toggle Posts */}
            <button className="text-sm mt-4 text-gray-500 flex gap-1 hover:cursor-pointer hover:text-primary transition-colors"
                onClick={() => {
                    setArePostsOpen(!arePostsOpen);
                    handleTogglePosts()
                }}
                disabled={isLoadingPosts}
            >
                {arePostsOpen ? "Hide" : "View"} posts for this thread
                <ChevronDown className={`size-4 place-self-center transition-transform ${arePostsOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Error message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mt-1">
                    {error}
                </div>
            )}

            <ForumPost isOpen={arePostsOpen} thread={thread} posts={posts} onDelete={handlePostDeleted}/>

            {/* Delete Confirmation */}
            <DeleteForum
                threadId={thread.id}
                isOpen={showDeleteConfirm}
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    onDelete?.();
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div >
    );
}