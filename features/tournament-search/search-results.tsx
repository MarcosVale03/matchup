import { formatDateTime } from "@/ui/format-time";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import {FetchTournamentsForSearchResponse} from "@/server/queries/tournaments.queries";


export const SearchResults = ({ tournaments }: { tournaments: FetchTournamentsForSearchResponse }) => {
    // will have to limit the amount of shown results if too many are returned

    if (tournaments.length === 0) {
        return (
            // Display a centered message if no results are found
            <div className="p-4 text-center text-3xl">
                No tournaments found.
            </div>
        )
    } else {
        return (
                <ul className="gap-4 sm:gap-6 pb-4 sm:pb-6">
                    {tournaments.map((tournament) => (
                        <li
                            key={tournament.id}
                            className="flex flex-col p-3 gap-4 my-3 rounded-3xl shadow-md sm:my-3.5
                                   sm:flex-row sm:justify-between sm:items-center 
                                   sm:p-5 sm:hover:shadow-xl/20 transition duration-150 bg-tertiary"
                        >
                            <div className="min-w-0 w-full">
                                {/* Tournament Name */}
                                <h1 className="text-lg lg:text-2xl text-center wrap-break-word sm:text-left">
                                    {tournament.name}
                                </h1>

                                {/* Tournament Start and End Time */}
                                <div className="space-y-0.5 place-self-center sm:place-self-start text-base lg:text-lg">
                                    <p className="font-jersey-25">
                                        <span className="">Start Time: </span> {formatDateTime(tournament.start_time)}
                                    </p>
                                    <p className="font-jersey-25">
                                        <span className="">End Time:  </span>  {formatDateTime(tournament.end_time)}
                                    </p>
                                </div>

                                {/* Organizer Name */}
                                <div className="flex flex-row mt-1 place-self-center sm:place-self-start">
                                    <CircleUser className="size-7 mr-2 place-self-center" />
                                    <p className="text-base lg:text-lg">
                                        {tournament.owner.display_name}
                                    </p>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mb-2 mt-2 place-self-center sm:mb-0 shrink-0">
                                <Link
                                    href={`/tournaments/${tournament.id}`}
                                    className="bg-primary text-base lg:text-xl font-jersey-25 p-3 rounded-lg hover:bg-secondary
                                    hover:cursor-pointer transition duration-200"
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
