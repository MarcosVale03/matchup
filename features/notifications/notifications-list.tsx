'use client'
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "./notification-types";

export default function NotificationsList({ notifications = [] }: { notifications: Notification[] }) {
    return (
        <ul className="text-black bg-white rounded-lg shadow-md font-poppins font-semibold text-base md:min-w-xs overflow-hidden">
            {notifications.length === 0 ? (
                <li className="p-2 text-gray-400 text-sm text-center">No notifications yet</li>
            ) : (
                notifications.map((item, index) => (
                    <li key={index}
                        className="bg-white p-3 flex gap-3 items-start last:border-none rounded-lg">

                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />

                        <div className="flex flex-col gap-1 min-w-0">
                            <NotificationBody notification={item} />

                            <p className="text-xs text-gray-400 font-light">
                                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </li>
                ))
            )}
        </ul>
    );
}

function NotificationBody({ notification }: { notification: Notification }) {
    switch (notification.type) {
        case "player_joined":
            return (
                <>
                    <p>{notification.tournamentName}</p>
                    <p className="text-sm font-medium text-gray-800 leading-snug">
                        <span>{notification.playerName}</span> joined{" "}
                        <span className="text-primary">{notification.eventName}</span>
                    </p>
                </>
            );
        case "thread_reply":
            return (
                <p className="text-sm font-medium text-gray-800 leading-snug">
                    <span>{notification.replierName}</span> replied to{" "}
                    <span className="text-primary">{notification.threadTitle}</span>
                </p>
            );
    }
}
