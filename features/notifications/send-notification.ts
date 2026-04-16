import "server-only";
import { createClient } from "@supabase/supabase-js";
import {
    channelForUser,
    NOTIFICATION_EVENT,
    type Notification,
} from "./notification-types";

let broadcastClient: ReturnType<typeof createClient> | null = null;

const getBroadcastClient = () => {
    if (broadcastClient) return broadcastClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
        throw new Error("Supabase env vars missing — cannot send notifications");
    }

    broadcastClient = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return broadcastClient;
};

export async function sendNotification(
    recipientUserId: string,
    notification: Notification
): Promise<void> {
    try {
        const client = getBroadcastClient();
        const channel = client.channel(channelForUser(recipientUserId), {
            config: { private: true },
        });

        await channel.send({
            type: "broadcast",
            event: NOTIFICATION_EVENT,
            payload: notification,
        });

        await client.removeChannel(channel);
    } catch (err) {
        console.error("[sendNotification] failed", err);
    }
}
