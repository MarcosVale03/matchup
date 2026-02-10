'use client'
import NavigationBar from '@/ui/navigation-bar'
import { useCallback, useEffect, useState } from 'react';
import { fetchTournaments } from '@/server/queries/tournaments.queries';
import { SearchResults } from '@/features/tournament-search/search-results';
import { Tournament } from '@/lib/types/types';
import { sleep } from '@/features/sleep-function';

export default function TournamentSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedTournaments, setDisplayedTournaments] = useState<Tournament[]>([]);
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // get tournaments from DB
    const loadTournaments = useCallback(async (query: string, startAfter: Date) => {
        setIsLoading(true);
        setError(null);

        const response = await fetchTournaments(query, startAfter);

        if (response.success) {
            setDisplayedTournaments(response.data ?? []);
        } else {
            setError(response.message ?? "Error in searching tournaments");
            setDisplayedTournaments([]);
        }

        await sleep(300);
        setIsLoading(false);
    }, []);

    const dateToSearch = startDateFilter ?? new Date(0);
    useEffect(() => {
        const handler = setTimeout(() => {
            loadTournaments(searchQuery, dateToSearch);
        }, 500);

        return () => {
            clearTimeout(handler);
        }
    }, [searchQuery, loadTournaments, startDateFilter]);


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // prevents a reload of the page
    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
    }, []);

    return (
        <main className="bg-white flex flex-col min-h-screen font-[Poppins]">
            <NavigationBar />

            <div className="m-5 place-self-center w-full max-w-[85vw] drop sm:max-w-[60vw] 2xl:max-w[95vw]">
                <h1 className="text-center font-bold text-primary mb-5 text-xl sm:text-2xl">
                    The Arena Awaits: Find Your Competition
                </h1>

                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row bg-white">
                    {/* Search Bar */}
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Search by name..."
                        className="grow place-self-center p-4 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary 
                                   transition duration-150 sm:rounded-r-none"
                    />

                    {/* Date filter */}
                    <input
                        id="startDateFilterInput"
                        type="date"
                        max="9999-12-31"
                        onChange={(e) => {
                            setStartDateFilter(e.target.value ? new Date(e.target.value) : null)
                        }}
                        className="place-self-center p-4 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary 
                                   transition duration-150 cursor-pointer sm:rounded-l-none"
                    />
                </form>


                {/* Search results window */}
                <div className="mt-8 flex flex-col gap-2">

                    <h2 className="text-xl font-semibold text-gray-700">
                        Found {displayedTournaments.length} Tournament(s):
                    </h2>

                    <div className="min-h-[35rem] max-h-[35rem] 2xl:max-h-[80rem] overflow-y-auto">
                        {isLoading && (
                            <div className="p-4 text-center text-gray-500">
                                Loading...
                            </div>
                        )}

                        {error && (
                            <div className="text-center mt-8 text-red-600">
                                Error: {error}
                            </div>
                        )}

                        {!isLoading && !error && (
                            <SearchResults tournaments={displayedTournaments} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
