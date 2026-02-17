'use client'
import React, { useState } from 'react';
import { X, Send } from "lucide-react";
import { insertPost } from '@/server/mutations/forum.mutation';
import { Post, Thread } from '@/lib/types/types';



export default function AddForumPost({
    thread,
    onConfirm,
    onPostAdded,
    onCancel
}: {
    thread: Thread;
    onConfirm: () => void;
    onPostAdded: (newPost: Post) => void;
    onCancel: () => void
}) {

    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Insert forum thread or post based on type
    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await insertPost(thread.id, content);

            if (!result.success) {
                setError(result.formErrors?.[0] || "Failed to create post");
                return;
            }

            // Add the new post to the list 
            // if (result.data) {
            //     onPostAdded?.(result.data);
            // }
                
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }

        setContent('');
        onConfirm();
    }

    return (
        <form
            onSubmit={handleSubmitPost}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5
                       lg:px-7 space-y-5 sm:space-y-6 mt-4"
        >
            <h2 className="text-xl font-semibold text-gray-900">
                Create a new post for {thread.title}
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
                placeholder="What's on your mind?"
                className="w-full px-4 py-2 leading-relaxed border border-gray-300
                           rounded-lg min-h-[100px] sm:min-h-[120px] resize-y 
                           placeholder:text-gray-500 focus:outline-none focus:ring-2
                           focus:ring-primary focus:border-transparent transition-all duration-150
                           text-gray-800"
            />

            {/* Cancel/Post Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-2.5 text-sm
                                           sm:text-base font-medium text-gray-700 border border-gray-300 rounded-lg
                                           hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation
                                           flex-1 sm:flex-none"
                >
                    <X className="size-5 sm:size-4" />
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-2.5 text-sm
                               sm:text-base font-medium bg-primary text-white rounded-lg hover:bg-secondary 
                               active:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
                               transition-colors touch-manipulation flex-1 sm:flex-none shadow-sm"
                    disabled={!content.trim() || isSubmitting}
                >
                    <Send size={18} className=" size-4 place-self-center" />
                    Post
                </button>
            </div>
        </form>
    );
}