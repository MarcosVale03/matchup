'use client';
import { Tournament } from "@/lib/types/types";
import { formatTournamentDateTime } from "@/ui/format-time";
import NavigationBar from "@/ui/navigation-bar";
import Link from 'next/link';

export default function TournamentDetails({ tournament }: { tournament: Tournament }) {
    
    const handleJoinClick = () => {
        alert(`Joining tournament: ${tournament.name}`);
    };

    return (
        <>
            <NavigationBar hidden={false}/>
            <main className="bg-white flex flex-col min-h-screen justify-center items-center">
                
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        {tournament.name}
                    </h1>
                </div>
                
                {/* Details Grid */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Event Details
                    </h2>

                    <dl className="space-y-3">
                        {/* Start Time */}
                        <div className="flex justify-between items-center border-b pb-2">
                            <dt className="font-medium text-gray-600">
                                Start Time:  
                            </dt>
                            <dd className="text-gray-900">
                                {formatTournamentDateTime(tournament.start_time)}
                            </dd>
                        </div>
                        
                        {/* End Time */}
                        <div className="flex justify-between items-center border-b pb-2">
                            <dt className="font-medium text-gray-600">
                                End Time:
                            </dt>
                            <dd className="text-gray-900">
                                {formatTournamentDateTime(tournament.end_time)}
                            </dd>
                        </div>

                        {/* Homepage Link */}
                        <div className="flex justify-between items-center">
                            <dt className="font-medium text-gray-600">
                                Official Homepage
                            </dt>
                            <dd>
                                {/* <Link 
                                    href={tournament.home_page} 
                                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                                >
                                    Visit Site
                                </Link> */}
                                <p className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer">
                                    Visit Site
                                </p>
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Join Tournament Button (will probably be removed since we're adding events) */}
                <div className="mt-10 text-center">
                    <button 
                        onClick={handleJoinClick}
                        className="bg-[#BD2D2D] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-[#992323] transition duration-150 transform hover:scale-105"
                    >
                        Edit Details
                    </button>
                </div>
                
            </main>
        </>
    );
}