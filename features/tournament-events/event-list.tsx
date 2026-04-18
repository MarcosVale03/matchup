import {FetchEventsFromTournamentIdResponse} from "@/server/queries/events.queries";
import {formatDate} from "date-fns";
import {useRouter} from "next/navigation";

export default function EventList({
    events
}: {
    events?: FetchEventsFromTournamentIdResponse;
}) {

    const router = useRouter();

    return (
        <div className="p-4 sm:p-6 lg:p-8 mt-2">
            <div className="pb-3 border-b border-zinc-300 mb-4">
                <h3 className="">
                    Tournament Events
                </h3>
                <h5 className="text-gray-600">
                    Select an event below to view its details
                </h5>
            </div>

            {events && events.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {events.map((event, i) => (
                        <div key={i} className="rounded-md shadow-lg">

                            {/* Image container */}
                            <div
                                className="relative bg-black py-12 sm:py-16 lg:py-25 text-center text-primary rounded-t-md">
                                {/* image goes here */}
                                <p className="text-lg lg:text-2xl text-white">
                                    [Game Image]
                                </p>

                                {/* Game name in the bottom left corner of image */}
                                <div
                                    className="absolute text-white left-3 bottom-3 sm:left-5 sm:bottom-5
                                    bg-zinc-600 rounded-lg px-2 py-1 sm:p-2 text-sm lg:text-base font-jersey"
                                >
                                    {event.video_game_name}
                                </div>
                            </div>

                            {/* Event details container */}
                            <div className="p-3 sm:p-4 bg-card-input text-black rounded-b-md">

                                {/* Event Name, Platform, Date, and Time */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div>
                                        <p className="text-lg lg:text-2xl font-jersey text-primary">
                                            {event.name}
                                        </p>
                                        <p className="text-sm text-gray-">
                                            <span className="font-jersey text-base tracking-normal font-normal">Platform: </span>{event.gaming_platform_name}
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-base lg:text-xl font-jersey">
                                            Date & Time
                                        </p>
                                        <p className="text-sm font-poppins tracking-tight">
                                            {formatDate(event.start_time, "MMM d, yyyy @ h:mm a")}
                                        </p>
                                    </div>
                                </div>

                                {/* Event Information */}
                                <div className="grid grid-cols-1 xs:grid-cols-2 mt-3 border-y-2 border-y-gray-300 py-4 gap-y-3">
                                    {/* Entry Fee */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey tracking-wide">
                                            Entry Fee
                                        </h3>
                                        <p className="text-sm lg:text-md font-poppins tracking-tight">
                                            ${event.price}
                                        </p>
                                    </div>

                                    {/* Team size */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey tracking-wide">
                                            Team Size
                                        </h3>
                                        <p className="text-sm font-poppins tracking-tight">
                                            {event.max_team_size ? event.max_team_size : "Solos"}
                                        </p>
                                    </div>

                                    {/* Amount of teams registered out of maximum allowed */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey tracking-wide">
                                            Registered
                                        </h3>
                                        <p className="text-sm font-poppins tracking-tight">
                                            16/20
                                        </p>
                                    </div>

                                    {/* Bracket type */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey tracking-wide">
                                            Registration Window
                                        </h3>
                                        <p className="text-sm font-poppins tracking-tight">
                                            Placeholder Date
                                        </p>
                                    </div>
                                </div>

                                {/* Event Details Button */}
                                <button
                                    onClick={() => router.push(`${event.tournament_id}/events/${event.id}`)}
                                    className="flex items-center justify-center gap-2 p-2 px-4 mt-4
                                           rounded-md shadow-sm text-sm md:text-base lg:text-lg
                                           font-jersey text-white bg-primary hover:bg-secondary
                                           cursor-pointer disabled:opacity-50 transition-colors duration-200 w-full"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-zinc-600 text-base md:text-lg">
                    No events have been added to this tournament.
                </div>
            )}

        </div>
    )
}