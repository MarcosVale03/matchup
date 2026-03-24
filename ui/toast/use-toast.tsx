import { useState, useCallback } from "react";

export function useToast(duration = 3000) {
    const [message, setMessage] = useState<string | null>(null);

    const show = useCallback((text: string) => {
        setMessage(text);
        setTimeout(() => setMessage(null), duration);
    }, [duration]);

    return { message, show };
}