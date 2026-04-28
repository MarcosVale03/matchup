import Link from "next/link";
import {FetchTournamentsForSearchResponse} from "@/server/queries/tournaments.queries";
import {getTimeUntilStart} from "@/lib/utils";
import React from "react";
import {formatDate} from "date-fns";
import Image from "next/image";

export const SearchResults = ({
    tournaments
}: {
    tournaments: FetchTournamentsForSearchResponse
}) => {
    // will have to limit the amount of shown results if too many are returned

    if (tournaments.length === 0) {
        return (
            // Display a centered message if no results are found
            <div className="p-4 text-center text-zinc-600 text-base md:text-lg">
                No tournaments found.
            </div>
        )
    } else {
        return (
            <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {tournaments.map((tournament) => (
                    <li
                        key={tournament.id}
                        className="relative flex flex-col rounded-2xl shadow-sm
                            p-4 bg-white hover:shadow-md transition duration-200"
                    >
                        <div className="min-w-0 w-full">
                            <div className="flex flex-col gap-2">
                                {/* Badges for upcoming, in progress, or ended */}
                                {(() => {
                                    const now = new Date();
                                    const started = new Date(tournament.start_time) <= now;
                                    const ended = new Date(tournament.end_time) <= now;

                                    const colorClass = ended
                                        ? "bg-zinc-100 text-zinc-500"      // Ended
                                        : "bg-zinc-600 text-white"         // Upcoming / Started

                                    return (
                                        <div
                                            className={`shrink-0 w-fit flex items-center gap-1.5 text-xs px-2 rounded-md ${colorClass}`}>
                                            {started && !ended && (
                                                <div className="relative flex h-2.5 w-2.5 shrink-0">
                                                    <p className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
                                                    <p className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"/>
                                                </div>
                                            )}
                                            {getTimeUntilStart(new Date(tournament.start_time), new Date(tournament.end_time))}
                                        </div>
                                    );
                                })()}

                                {/* Tournament Name */}
                                <h4
                                    className="text-primary truncate text-left min-w-0">
                                    {tournament.name}
                                </h4>
                            </div>

                            {/* Tournament Start and End Time */}
                            <div className="place-self-start">
                                <p className="font-jersey text-base lg:text-lg font-normal">
                                   Starts: <span className="font-poppins text-xs md:text-sm">{formatDate(tournament.start_time, "MMM d, yyyy @ h:mm a")}</span>
                                </p>
                                <p className="font-jersey text-base lg:text-lg font-normal -mt-1">
                                    Ends: <span className="font-poppins text-xs md:text-sm">{formatDate(tournament.end_time, "MMM d, yyyy @ h:mm a")}</span>
                                </p>
                            </div>

                            {/* Organizer Name */}
                            <div className="flex flex-row mt-1 place-self-start gap-1">
                                <Image
                                    src="/random-pfp.png"
                                    alt="random-pfp"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <p className="text-sm md:text-base font-poppins font-normal place-self-center">
                                    {tournament.owner.display_name}
                                </p>
                            </div>
                        </div>

                        {/* View Details Button */}
                        <div className="mb-2 mt-2 xs:mb-0 shrink-0">
                            <Link
                                href={`/tournaments/${tournament.id}`}
                                className="block w-full xs:w-auto text-center bg-primary text-sm md:text-base
                                           font-jersey font-normal tracking-wide p-2 px-6 rounded-lg
                                           hover:bg-secondary text-white hover:cursor-pointer transition duration-200"
                            >
                                View Details
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }
};
