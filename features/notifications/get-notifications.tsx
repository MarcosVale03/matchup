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

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {

        const es = new EventSource(`/notifications`);

        es.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "ping") return; // ignore heartbeats

            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
        };

        es.onerror = () => es.close();

        return () => es.close();
    }, []);

    const markAllRead = () => setUnreadCount(0);

    return { notifications, unreadCount, markAllRead };
}