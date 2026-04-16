'use client'
import { useEffect, useState } from "react";

export type Notification = {
    type: string;
    tournamentId: number;
    tournamentName: string;
    eventId: number;
    eventName: string;
    playerName: string;
    playerId: string;
    timestamp: string;
};

// Connects to the SSE endpoint and maintains a live notification feed.
// Notifications persist in state for the session but are not saved anywhere —
// a page refresh clears them.
export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // EventSource auto-reconnects on network drops, but we close
        // permanently on error below — may want to revisit for resilience
        const es = new EventSource(`/notifications`);

        es.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "ping") return;

            // Prepend so newest notifications appear first
            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
        };

        es.onerror = () => es.close();

        return () => es.close();
    }, []);

    // Resets the badge count without clearing the notification list
    const markAllRead = () => setUnreadCount(0);

    return { notifications, unreadCount, markAllRead };
}
