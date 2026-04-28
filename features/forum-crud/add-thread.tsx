'use client'
import React, {useState} from 'react';
import {Send} from "lucide-react";
import {useRouter} from 'next/navigation';
import {insertForumThread} from '@/server/mutations/forum.mutation';

// onAddAction calls handleThreadAdded in forum-thread-list to show success message after creating a thread
export default function AddForumThread({
                                           onAddAction,
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
        <div className="mb-4">
            <form
                onSubmit={handleSubmitThread}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5"
            >
                <h2 className="text-xl sm:text-2xl font-jersey font-normal">
                    Create New Thread
                </h2>

                {/* Error message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Title input */}
                <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    autoFocus
                    className="block bg-white w-full rounded-lg border border-gray-300
                             text-black text-sm lg:text-base p-2.5 pb-0 focus:outline-none
                             focus:ring-2 focus:ring-primary focus:border-transparent transition
                             duration-200 font-poppins"
                />

                {/* Content */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="block bg-white w-full rounded-xl border border-gray-300
                             text-black text-sm lg:text-base p-2.5 focus:outline-none
                             focus:ring-2 focus:ring-primary focus:border-transparent
                              transition duration-200 font-poppins min-h-[140px]
                              sm:min-h-40 resize-y leading-relaxed"
                />

                {/* Post Button */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-2">
                    <button
                        type="submit"
                        className="w-full flex flex-row xs:w-auto text-center bg-primary text-sm md:text-base
                                   font-jersey font-normal tracking-wide p-2 px-6 rounded-lg hover:bg-secondary
                                   text-white hover:cursor-pointer transition duration-200 gap-2 place-self-center
                                   disabled:bg-primary/70 disabled:cursor-not-allowed place-content-center"
                        disabled={!title.trim() || !content.trim() || isSubmitting}
                    >
                        <Send size={18} className="size-5 sm:size-4 place-self-center"/>
                        Post
                    </button>
                </div>
            </form>

        </div>
    );
}