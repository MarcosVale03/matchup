import { CheckCircle } from "lucide-react";

export function Toast({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <CheckCircle className="w-5 h-5" />
            {message}
        </div>
    );
}