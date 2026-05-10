export type PlayerJoinedNotification = {
    type: "player_joined";
    tournamentId: number;
    tournamentName: string;
    eventId: number;
    eventName: string;
    playerName: string;
    playerId: string;
    timestamp: string;
};

export type ThreadReplyNotification = {
    type: "thread_reply";
    threadId: string;
    threadTitle: string;
    replierName: string;
    replierId: string;
    timestamp: string;
};

export type Notification = PlayerJoinedNotification | ThreadReplyNotification;

// Single broadcast event name for all notification types — the `type` field on
// the payload is what distinguishes them.
export const NOTIFICATION_EVENT = "notification";

// Per-user private channel. Anyone subscribing to someone else's channel just
// won't get messages because the sender targets one channel name
export const channelForUser = (userId: string) => `user:${userId}`;
