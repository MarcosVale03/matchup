'use client'
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/server/db/client";
import { useProfile } from "@/app/client-layout";
import {
    channelForUser,
    NOTIFICATION_EVENT,
    type Notification,
} from "./notification-types";

// Subscribes the currently logged-in user to their personal Realtime Broadcast
// channel. Notifications arrive in-memory only — a page refresh clears them.
export function useNotifications() {
    const { user } = useProfile();
    const userId = user?.id;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const subscribedRef = useRef<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        if (subscribedRef.current === userId) return;
        subscribedRef.current = userId;

        const supabase = createClient();
        const channel = supabase.channel(channelForUser(userId), {
            config: { private: true, broadcast: { self: false } },
        });

        channel
            .on("broadcast", { event: NOTIFICATION_EVENT }, ({ payload }) => {
                const notification = payload as Notification;
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);
            })
            .subscribe();

        return () => {
            subscribedRef.current = null;
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const markAllRead = () => setUnreadCount(0);

    return { notifications, unreadCount, markAllRead };
}
