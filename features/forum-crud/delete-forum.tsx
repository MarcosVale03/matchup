import { ConfirmButton } from "@/ui/confirm-button";
import { deleteThread } from "@/server/mutations/forum.mutation";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function DeleteForum({ 
    threadId, 
    isOpen, 
    onConfirm, 
    onCancel 
}: { 
    threadId: string; 
    isOpen: boolean; 
    onConfirm: () => void; 
    onCancel: () => void }) 
{
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleCancel = () => {
        setError(null);
        onCancel();
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
            
            // If deletion was successful, hide the delete window
            onConfirm();
            router.refresh(); // Refresh the page to reflect the deleted thread
        } catch (error) {
            setError("Failed to delete the thread. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Deletes a forum thread after confirming with the user
        <ConfirmButton
            isOpen={isOpen}
            title="Delete Thread"
            message="Are you sure you want to delete this thread? This action cannot be undone."
            error={error || undefined}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancel}
        />
    )
}