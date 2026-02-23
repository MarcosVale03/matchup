import DeletePost from "../forum-crud/delete-post";
import {Edit2, Trash2} from "lucide-react";
import {formatDateTime} from "@/ui/format-time";
import {useState} from "react";
import {Post, Thread} from "@/lib/types/types";
import EditPost from "../forum-crud/edit-post";
import {User} from '@supabase/supabase-js';


type ForumPostListProps = {
    isOpen: boolean;
    thread: Thread;
    posts: Post[];
    onPostDelete: (postId: string) => void;
    onPostUpdate: (updatedPost: Post) => void;
    user: User | null;
};

// onPostUpdate calls the function passed from forum-thread-single to update the post content in the posts state after successful edit
// onPostDelete calls the function passed from forum-thread-single to remove the deleted post from the posts state after successful delete
export default function ForumPostsList({    isOpen,
                                           thread,
                                           posts,
                                           onPostDelete,
                                           onPostUpdate,
                                           user
                                       }: ForumPostListProps) {

    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

    if (isOpen && posts.length === 1) {
        return (
            <main>
                <p className="text-gray-500 italic mt-2 text-sm">
                    No posts found for this thread
                </p>
            </main>
        );
    } else {

        return (
            <main>
                {isOpen && posts.length > 1 && (
                    <div className="mt-3 space-y-4">
                        {posts
                            .filter(post => post.created_at !== thread.created_at)
                            .map((post) => {

                                const isEditing = editingPostId === post.id;
                                const showDeleteConfirm = showDeleteConfirmId === post.id;

                                return (
                                    <div
                                        key={post.id}
                                        className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        {/* Header */}
                                        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                                            <div
                                                className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm text-gray-500">
                                                <span className="font-medium text-primary">
                                                    Author
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {formatDateTime(post.created_at)}
                                                </span>
                                            </div>

                                            {/* Edit/Delete */}
                                            {user && post.author_id === user.id && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingPostId(post.id)}
                                                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
                                                    >
                                                        <Edit2 className="w-4 h-4"/>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowDeleteConfirmId(post.id)}
                                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
                                                    >
                                                        <Trash2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        {isEditing ? (
                                            <EditPost
                                                post={post}
                                                onCancelAction={() => setEditingPostId(null)}
                                                onUpdatePostAction={(updatedPost) => {
                                                    onPostUpdate(updatedPost);
                                                    setEditingPostId(null);
                                                }}
                                            />
                                        ) : (
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                                                {post.content}
                                            </p>
                                        )}

                                        {/* Delete Form*/}
                                        <DeletePost
                                            postId={post.id}
                                            isOpen={showDeleteConfirm}
                                            onConfirm={() => {
                                                setShowDeleteConfirmId(null);
                                                onPostDelete?.(post.id);
                                            }}
                                            onCancel={() => setShowDeleteConfirmId(null)}
                                        />
                                    </div>
                                );
                            })}
                    </div>
                )}
            </main>
        );
    }
}