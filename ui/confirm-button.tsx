import { AlertTriangle } from 'lucide-react';

type ConfirmButtonProps = {
    isOpen: boolean;
    title: string;
    message: string;
    isSubmitting?: boolean;
    error?: string;
    onConfirm: () => void;
    onCancelForm: () => void;
}


export function ConfirmButton({ isOpen, title, message, isSubmitting, error, onConfirm, onCancelForm }: ConfirmButtonProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancelForm}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="mb-2 text-black font-semibold">{title}?</h3>
                        <p className="text-gray-600">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-6 text-black">
                    {/* Cancel Button */}
                    <button
                        onClick={onCancelForm}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"

                    >
                        Cancel
                    </button>
                    {/* Confirm Delete Button */}
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#a02525] transition-colors"
                    >
                        Delete
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