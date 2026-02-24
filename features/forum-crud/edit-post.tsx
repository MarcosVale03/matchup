'use client'
import { Save, X } from "lucide-react";
import React, { useState } from "react";
import { Post } from "@/lib/types/types";
import { updatePost } from "@/server/mutations/forum.mutation";
import { useRouter } from "next/navigation";

type EditPostProps = {
    post: Post;
    onCancelAction: () => void;
    onUpdatePostAction?: (updatedPost: Post) => void;
};


/*  onCancel calls setEditingPostId(null) in forum-post-list to close the edit form
*   onUpdatePost calls setEditingPostId(null) and shows a success message in forum-post-list after successful edit; 
*   it also sends the updated post back to forum-post-list to update the post content
*/
export default function EditPost({
    post,
    onCancelAction,
    onUpdatePostAction,
}: EditPostProps) {
    const router = useRouter();

    const [content, setContent] = useState(post.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await updatePost(post.id, content);

            if (!result.success) {
                setError(result.formErrors?.[0] || "Failed to update post");
                return;
            }

            onUpdatePostAction?.({ ...post, content: content.trim() });
            router.refresh(); // Refresh the page to show updated content

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-2 p-1"
        >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Editing Post
            </h2>

            {/* Error message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Textarea */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Edit your post content..."
                rows={5}
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-base sm:text-lg leading-relaxed border border-gray-300
                           rounded-lg min-h-[140px] sm:min-h-40 resize-y placeholder:text-gray-500
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                           transition-all duration-150 text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />

            {/* Cancel/Save Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-2 sm:pt-4">
                <button
                    type="button"
                    onClick={onCancelAction}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-2.5 text-sm
                               sm:text-base font-medium text-gray-700 border border-gray-300 rounded-lg
                               hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation
                               flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X className="size-5 sm:size-4" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-2.5
                               text-sm sm:text-base font-medium bg-primary text-white rounded-lg
                               hover:bg-secondary active:bg-primary/90 transition-colors disabled:opacity-50
                               disabled:cursor-not-allowed touch-manipulation flex-1 sm:flex-none shadow-sm"
                >
                    <Save className="size-5 sm:size-4" />
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    )
}