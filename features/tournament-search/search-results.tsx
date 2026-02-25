import { formatDateTime } from "@/ui/format-time";
import Image from "next/image";
import Link from "next/link";
import {FetchTournamentsForSearchResponse} from "@/server/queries/tournaments.queries";


export const SearchResults = ({ tournaments }: { tournaments: FetchTournamentsForSearchResponse[] }) => {
    // will have to limit the amount of shown results if too many are returned

    if (tournaments.length === 0) {
        return (
            // Display a centered message if no results are found
            <div className="p-4 text-center text-gray-500">
                No tournaments found matching your search.
            </div>
        )
    } else {
        return (
                <ul className="gap-4 sm:gap-6 pb-4 sm:pb-6 mr-2">
                    {tournaments.map((tournament) => (
                        <li
                            key={tournament.id}
                            className="flex flex-col p-3 gap-4 my-3 border
                                   border-gray-200 rounded-3xl shadow-md sm:my-3.5
                                   sm:ml-0 sm:flex-row sm:justify-between sm:items-center 
                                   sm:p-4 sm:hover:shadow-md/20 transition duration-150"
                        >
                            <div className="min-w-0 w-full">
                                {/* Tournament Name */}
                                <h1 className="font-bold text-lg text-primary text-center wrap-break-word sm:text-left">
                                    {tournament.name}
                                </h1>

                                {/* Tournament Start and End Time */}
                                <div className="space-y-1 place-self-center sm:place-self-start">
                                    <p className="text-sm text-gray-800 whitespace-pre">
                                        <span className="font-bold text-black">Start Time: </span> {formatDateTime(tournament.start_time)}
                                    </p>
                                    <p className="text-sm text-gray-800 whitespace-pre">
                                        <span className="font-bold text-black">End Time:  </span>  {formatDateTime(tournament.end_time)}
                                    </p>
                                </div>

                                {/* Organizer Name */}
                                <div className="flex flex-row mt-1 place-self-center sm:place-self-start">
                                    <Image
                                        src="/globe.svg"
                                        alt="Organizer PFP"
                                        width={20}
                                        height={20}
                                        className="mr-1"
                                    />
                                    <p className="text-sm text-gray-800 font-bold">
                                        Owner: {tournament.owner.display_name}
                                    </p>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mb-2 mt-2 place-self-center sm:mb-0 shrink-0">
                                <Link
                                    href={`/tournaments/${tournament.id}`}
                                    className="bg-primary text-white p-3 rounded-lg hover:bg-red-800 hover:cursor-pointer"
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
