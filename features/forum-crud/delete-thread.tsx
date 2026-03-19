'use client'
import { ConfirmButton } from "@/ui/confirm-button";
import { deleteThread } from "@/server/mutations/forum.mutation";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Trash2 } from "lucide-react";

export default function DeleteThread({ threadId }: {threadId: string}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // used to show the delete confirmation for the thread
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // resets error state and hides the delete confirmation window
    const handleCancel = () => {
        setError(null);
        setShowDeleteConfirm(false);
    }

    // Handler for confirming deletion
    const handleConfirmDelete = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await deleteThread(threadId);

            if (!result.success) {
                setError("Failed to delete the thread");
                return;
            }

            setShowDeleteConfirm(false);
            router.push("/forums"); // send back to forums to reflect the deleted thread
        } catch (err) {
            setError("Failed to delete the thread. Please try again.");
            console.error(err);
        }
    };

    return (
        // Deletes a forum thread after confirming with the user
        <>
            <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="Delete thread"
                className="p-2.5 sm:p-2 text-gray-600 hover:text-primary
                                   hover:bg-gray-100 rounded-lg transition-colors 
                                   active:bg-gray-200"
                
            >
                <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <ConfirmButton
                isOpen={showDeleteConfirm}
                title="Delete Thread"
                message="Are you sure you want to delete this thread? This action cannot be undone."
                error={error || undefined}
                isSubmitting={isSubmitting}
                onConfirm={handleConfirmDelete}
                onCancelForm={handleCancel}
            />
        </>
    )
}