'use client'
import DeletePost from "../forum-crud/delete-post";
import {Edit2, Trash2} from "lucide-react";
import {useState} from "react";
import {Post} from "@/server/queries/forum.queries";
import EditPost from "../forum-crud/edit-post";
import {useProfile} from "@/app/client-layout";
import {formatDate} from "date-fns";

type toast = {
    message: string | null
    show: (text: string) => void
}

export default function ForumPostsList({posts, toastControl, threadAuthorId}: { posts: Post[], toastControl: toast, threadAuthorId: string }) {
    const {user} = useProfile();
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);


    const handleDeletePost = () => {
        setShowDeleteConfirmId(null);
        toastControl.show("Post deleted successfully.");
    }

    const handleEditPost = () => {
        setEditingPostId(null);
        toastControl.show("Post edited successfully.");
    }

    if (posts.length === 0) {
        return (
            <p className="text-gray-500 italic text-sm text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                No replies yet — be the first to respond!
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {posts.map((post) => {
                const isEditing = editingPostId === post.id;
                const showDeleteConfirm = showDeleteConfirmId === post.id;

                return (
                    <div
                        key={post.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <div className="font-semibold">
                                    Author
                                    <span className="font-semibold text-blue-900 italic">
                                        {post.author_id === threadAuthorId ? " OP" : ''}
                                    </span>
                                </div>
                                <p>•</p>
                                <p>{formatDate(post.created_at, "MMM d, yyyy @ h:mm a")}</p>
                            </div>

                            {user && post.author_id === user.id && (
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setEditingPostId(post.id)}
                                        className="p-2.5 sm:p-2 text-gray-600 hover:text-primary
                                                   hover:bg-gray-100 rounded-lg transition-colors
                                                   active:bg-gray-200"
                                    >
                                        <Edit2 className="w-4 h-4"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirmId(post.id)}
                                        className="p-2.5 sm:p-2 text-gray-600 hover:text-primary
                                                   hover:bg-gray-100 rounded-lg transition-colors
                                                   active:bg-gray-200"
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
                                onUpdatePostAction={handleEditPost}
                                onCancelAction={() => setEditingPostId(null)}
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                                {post.content}
                            </p>
                        )}

                        <DeletePost
                            postId={post.id}
                            isOpen={showDeleteConfirm}
                            onConfirm={handleDeletePost}
                            onCancel={() => setShowDeleteConfirmId(null)}
                        />
                    </div>
                );
            })}
        </div>
    );
}