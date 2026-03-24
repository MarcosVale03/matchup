'use client'
import { Save, X } from "lucide-react";
import React, { useState } from "react";
import { Post } from "@/server/queries/forum.queries";
import { updatePost } from "@/server/mutations/forum.mutation";
import { useRouter } from "next/navigation";

type EditPostProps = {
    post: Post;
    onCancelAction: () => void;
    onUpdatePostAction?: (updatedPost: Post) => void;
};

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
            setError("An error occurred editing post");
            console.error(err);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-2 p-1"
        >
            <h2 className="text-lg sm:text-xl font-jersey-25">
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
                rows={3}
                disabled={isSubmitting}
                className="w-full px-4 py-2 min-h-[50px] leading-relaxed border border-gray-300
                           rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary
                           focus:border-transparent transition duration-200 font-[Poppins] bg-white"
            />

            {/* Cancel/Save Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-2 sm:pt-4">
                <button
                    type="button"
                    onClick={onCancelAction}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 py-1 px-4
                               rounded-md shadow-sm text-base md:text-lg font-jersey-25
                               text-white bg-primary hover:bg-secondary disabled:opacity-50
                               transition-colors"
                >
                    <X className="size-5 sm:size-4" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="flex items-center justify-center gap-2 py-1 px-4
                               rounded-md shadow-sm text-base md:text-lg font-jersey-25
                               text-white bg-primary hover:bg-secondary disabled:opacity-50
                               transition-colors"
                >
                    <Save className="size-5 sm:size-4" />
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    )
}