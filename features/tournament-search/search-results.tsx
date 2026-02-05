import { Tournament } from "@/lib/types/types";
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
                <li key={tournament.id} className="p-4 border border-gray-200 rounded-lg shadow-sm m-2 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-lg text-gray-900">
                            {tournament.name}
                        </div>
                        <div className="text-sm text-gray-600">
                            Start time: {tournament.start_time}
                        </div>
                        <div className="text-sm text-gray-600">
                            End time: {tournament.end_time}
                        </div>
                        <div className="flex flex-row gap-1 mt-1">
                            <img src="/globe.svg" alt="Organizer PFP" className="w-5" />
                            <div className="text-sm text-gray-600">
                                Organizer Name
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
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
