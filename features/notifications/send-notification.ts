import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
    channelForUser,
    NOTIFICATION_EVENT,
    type Notification,
} from "./notification-types";

let broadcastClient: SupabaseClient | null = null;

const getBroadcastClient = async () => {
    if (broadcastClient) return broadcastClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "Supabase env vars missing (need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) — cannot send notifications"
        );
    }

    const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    await client.realtime.setAuth(key);

    broadcastClient = client;
    return broadcastClient;
};

export async function sendNotification(
    recipientUserId: string,
    notification: Notification
): Promise<void> {
    try {
        const client = await getBroadcastClient();
        const channel = client.channel(channelForUser(recipientUserId), {
            config: { private: true },
        });

        const result = await channel.httpSend(NOTIFICATION_EVENT, notification);

        if (!result.success) {
            console.error("[sendNotification] httpSend failed", result);
        }

        await client.removeChannel(channel);
    } catch (err) {
        console.error("[sendNotification] failed", err);
    }
}
