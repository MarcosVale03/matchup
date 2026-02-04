import { Tournament } from "@/lib/types/types";
import { formatTournamentDateTime } from "@/ui/format-time";
import Link from "next/link";


export const SearchResults = ({ tournaments }: { tournaments: Tournament[] }) => {
    // will have to limit the amount of shown results

    if (tournaments.length === 0) {
        return (
            // Display a centered message if no results are found
            <div className="p-4 text-center text-gray-500">
                No tournaments found matching your search.
            </div>
        )
    } else {
        return (
            <ul className="space-y-3">
                {tournaments.map((tournament) => (
                    <li key={tournament.id} className="flex flex-col p-2 pl-3 gap-4 border border-gray-200 rounded-lg shadow-sm m-2 sm:flex-row sm:justify-between sm:items-center sm:p-4">
                        <div>
                            <h1 className="font-bold text-lg text-[#BD2D2D] text-center sm:text-left">
                                {tournament.name}
                            </h1>

                            <div className="space-y-1 place-self-center">
                                <p className="text-sm text-gray-800 whitespace-pre">
                                    <span className="font-bold text-black">Start Time: </span> {formatTournamentDateTime(tournament.start_time)}
                                </p>
                                <p className="text-sm text-gray-800 whitespace-pre">
                                    <span className="font-bold text-black">End Time: </span>  {formatTournamentDateTime(tournament.end_time)}
                                </p>
                            </div>

                            <div className="flex flex-row gap-1 mt-1 place-self-center sm:place-self-start">
                                <img src="/globe.svg" alt="Organizer PFP" className="w-5" />
                                <p className="text-sm text-gray-800 font-bold">
                                    Organizer Name
                                </p>
                            </div>
                        </div>
                        <div className="mb-2 place-self-center sm:mb-0 flex-shrink-0">
                            <Link
                                href={`/tournaments/${tournament.id}`}
                                className="bg-[#BD2D2D] text-white p-3 rounded-lg hover:bg-red-800 hover:cursor-pointer"
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
