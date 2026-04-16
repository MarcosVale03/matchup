'use client'
import React, {useState} from 'react';
import {X, Send} from "lucide-react";
import {insertPost} from '@/server/mutations/forum.mutation';
import {Toast} from "@/ui/toast/toast";
import {useRouter} from "next/navigation";

type Toast = {
    message: string | null
    show: (text: string) => void;
}


export default function AddThreadPost({ threadId, toastControl }: {threadId: string, toastControl: Toast }) {

    const router = useRouter();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddButtonsOpen, setIsAddButtonsOpen] = useState(false);


    const handlePostAdded = () => {
        setIsAddButtonsOpen(false);
        setContent('');
        toastControl.show("Post added successfully.");
    };

    // Insert forum post
    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await insertPost(threadId, content);

            if (!result.success) {
                setError(result.formErrors?.[0] || "Failed to create post");
                return;
            }

            handlePostAdded();
            router.refresh();

        } catch (err) {
            setError("An error occurred");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmitPost}
            onBlur={(e) => {
                // If focus moved outside the form, close buttons
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsAddButtonsOpen(false);
                }
            }}
        >
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
                onFocus={() => setIsAddButtonsOpen(true)}
                placeholder="Create a post"
                className="w-full px-4 py-2 min-h-[50px] leading-relaxed border border-gray-300
                           rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary
                           focus:border-transparent font-poppins bg-white"
            />

            {/* Cancel/Post Buttons */}
            {isAddButtonsOpen && (
                <div
                    className={`grid transition-all duration-300 ease-in-out ${isAddButtonsOpen
                        ? 'grid-rows-[1fr] opacity-100' :
                        'grid-rows-[0fr] opacity-0'
                    }`}>
                    <div className="overflow-hidden">

                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setIsAddButtonsOpen(false)}
                                className="flex items-center justify-center gap-2 py-1 px-4
                                   rounded-md shadow-sm text-base md:text-lg font-jersey
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                            >
                                <X className="size-5 sm:size-4"/>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 py-1 px-4
                                   rounded-md shadow-sm text-base md:text-lg font-jersey
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                                disabled={!content.trim() || isSubmitting}
                            >
                                <Send size={18} className=" size-4 place-self-center"/>
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}