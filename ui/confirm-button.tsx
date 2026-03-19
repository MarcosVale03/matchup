import { AlertTriangle } from 'lucide-react';

type ConfirmButtonProps = {
    /** Whether the dialog is visible */
    isOpen: boolean;
    /** Heading text displayed at the top of the dialog (a `?` is appended automatically) */
    title: string;
    /** Body text describing the action the user is confirming */
    message: string;
    /** When `true`, both buttons are disabled to prevent duplicate submissions */
    isSubmitting?: boolean;
    /** Error message displayed at the bottom of the dialog */
    error?: string;
    /** Called when the user clicks the confirm (Delete) button */
    onConfirm: () => void;
    /** Called when the user clicks Cancel or the backdrop */
    onCancelForm: () => void;
}


export function ConfirmButton({
    isOpen,
    title,
    message,
    isSubmitting,
    error,
    onConfirm,
    onCancelForm
}: ConfirmButtonProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={!isSubmitting ? onCancelForm : undefined}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="mb-2 text-black font-semibold wrap-break-word">
                            {title}?
                        </h3>
                        <p className="text-gray-600 wrap-break-word">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6 text-black">
                    {/* Cancel Button */}
                    <button
                        onClick={onCancelForm}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50
                                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    {/* Confirm Delete Button */}
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary
                                   transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
                {/* Error message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mt-4 overscroll-none">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}