'use client'
import React, {useState} from 'react';
import {X, Plus, Send} from "lucide-react";
import {useRouter} from 'next/navigation';
import {insertForumThread} from '@/server/mutations/forum.mutation';

// onAddAction calls handleThreadAdded in forum-thread-list to show success message after creating a thread
export default function AddForumThread({
                                           onAddAction,
                                           onCancelAction
                                       }: {
    onAddAction: () => void;
    onCancelAction: () => void;
}) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Insert forum thread or post based on type
    const handleSubmitThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await insertForumThread(title, content);
            if (!result.success) {
                setError(result.formErrors?.[0] || "Failed to create post");
                return;
            }
            router.refresh();
            onAddAction();
        } catch (err) {
            setError("An error occurred");
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmitThread}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6
                             lg:p-7 space-y-5 sm:space-y-6"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Create New Thread
                </h2>

                {/* Error message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Title input */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    autoFocus
                    className="w-full px-4 py-3.5 text-base sm:text-lg font-medium border
                               border-gray-300 rounded-lg placeholder:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-primary
                               focus:border-transparent transition-all duration-150
                               text-gray-800"
                />

                {/* Textarea */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3.5 leading-relaxed border border-gray-300 rounded-lg min-h-[140px]
                               sm:min-h-40 resize-yplaceholder:text-gray-500 focus:outline-none focus:ring-2
                               focus:ring-primary focus:border-transparent transition-all duration-150
                               text-gray-800"
                />

                {/* Cancel/Post Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-2 sm:pt-4">
                    <button
                        type="button"
                        onClick={onCancelAction}
                        className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-2.5 text-sm
                                   sm:text-base font-medium text-gray-700 border border-gray-300 rounded-lg
                                   hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation
                                   flex-1 sm:flex-none"
                    >
                        <X className="size-5 sm:size-4"/>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-2.5 text-sm
                                   sm:text-base font-medium bg-primary text-white rounded-lg
                                   hover:bg-secondary active:bg-primary/90 transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation
                                   flex-1 sm:flex-none shadow-sm"
                        disabled={!title.trim() || !content.trim() || isSubmitting}
                    >
                        <Send size={18} className=" size-4 place-self-center"/>
                        Post
                    </button>
                </div>
            </form>

        </div>
    );
}