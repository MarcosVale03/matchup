'use client'
import { Notification } from "./get-notifications";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsList({ notifications = [] }: { notifications: Notification[] }) {
    return (
        <ul className="text-black bg-white rounded-lg shadow-md font-[Poppins] font-semibold text-base md:min-w-xs overflow-hidden">
            {notifications.length === 0 ? (
                <li className="p-2 text-gray-400 text-sm text-center">No notifications yet</li>
            ) : (
                notifications.map((item, index) => (
                    <li key={index}
                        className="bg-white p-3 flex gap-3 items-start last:border-none rounded-lg">

                        {/* Unread dot */}
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />

                        <div className="flex flex-col gap-1 min-w-0">

                            {/* Torunament name */}
                            <p>
                                {item.tournamentName}
                            </p>

                            {/* Player and event name */}
                            <p className="text-sm font-medium text-gray-800 leading-snug">
                                <span>{item.playerName}</span> joined{" "}
                                <span className="text-primary">{item.eventName}</span>
                            </p>

                            {/* Timestamp */}
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