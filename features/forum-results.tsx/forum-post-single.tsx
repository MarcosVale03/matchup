import { formatTournamentDateTime } from "@/ui/format-time";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Post, Thread } from "@/lib/types/types";
import DeletePost from "../forum-crud/delete-post";

export default function ForumPost({ isOpen, thread, posts, onDelete }: { isOpen: boolean, thread: Thread, posts: Post[], onDelete: (postId: string) => void }) {

    const [isEditing, setIsEditing] = useState(false);

    // Calls the delete form to pop up
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <main>
            {/* Posts List, expands when clicking the arrow */}
            {isOpen && posts.length > 0 && (
                <div className="mt-3 space-y-4">
                    {posts
                        .filter(post => post.created_at !== thread.created_at)
                        .map((post, id) => (
                            <div key={id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                {/* Author & Timestamp with Edit/Delete Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm text-gray-500">
                                        <span className="font-medium text-primary">
                                            "Author Name"
                                        </span>

                                        <span className="inline">
                                            •
                                        </span>

                                        <span>
                                            {formatTournamentDateTime(post.created_at)}
                                        </span>
                                    </div>

                                    {/* Edit/Delete Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 text-gray-600 hover:text-primary 
                                           hover:bg-gray-100 rounded-lg transition-colors 
                                           active:bg-gray-200"
                                            aria-label="Edit post"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="p-2 text-gray-600 hover:text-red-600 
                                                       hover:bg-gray-100 rounded-lg transition-colors 
                                                       active:bg-gray-200"
                                            aria-label="Delete post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Post content */}
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                                    {post.content}
                                </p>

                                {/* Delete Confirmation */}
                                <DeletePost
                                    postId={post.id}
                                    isOpen={showDeleteConfirm}
                                    onConfirm={() => {
                                        setShowDeleteConfirm(false);
                                        onDelete?.(post.id);
                                    }}
                                    onCancel={() => setShowDeleteConfirm(false)}
                                />

                            </div>
                        ))}
                </div>
            )}
        </main>
    )
}