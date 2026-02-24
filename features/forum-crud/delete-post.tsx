import { ConfirmButton } from "@/ui/confirm-button";
import { deletePost } from "@/server/mutations/forum.mutation";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function DeletePost({ 
    postId, 
    isOpen, 
    onConfirm, 
    onCancel 
}: { 
    postId: string; 
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
            const result = await deletePost(postId);

            if (!result.success) {
                setError("Failed to delete the post");
                return;
            }
            
            // If deletion was successful, hide the delete window
            onConfirm();
            router.refresh();
        } catch (err) {
            setError("Failed to delete the post. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Deletes a forum post after confirming with the user
        <ConfirmButton
            isOpen={isOpen}
            title="Delete Post"
            message="Are you sure you want to delete this post? This action cannot be undone."
            error={error || undefined}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmDelete}
            onCancelForm={handleCancel}
        />
    )
}