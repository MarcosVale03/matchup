'use client'
import React, { useCallback, useEffect, useState } from 'react';
import { fetchTournamentsForSearch, FetchTournamentsForSearchResponse } from '@/server/queries/tournaments.queries';
import { SearchResults } from '@/features/tournament-search/search-results';
import { sleep } from '@/features/sleep-function';
import SearchBar from '@/ui/search-bar';

export default function TournamentSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedTournaments, setDisplayedTournaments] = useState<FetchTournamentsForSearchResponse>([]);
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // get tournaments from DB
    const loadTournaments = useCallback(async (query: string, startAfter: Date) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchTournamentsForSearch(query, startAfter);
            setDisplayedTournaments(response ?? []);
        } catch (err) {
            console.error(err);
            setError("Something went wrong, please try again later.");
            setDisplayedTournaments([]);
        }

        await sleep(300);
        setIsLoading(false);
    }, []);

    // Load tournaments on initial render and whenever searchQuery or startDateFilter changes
    useEffect(() => {

        const handler = setTimeout(async () => {
            const dateToSearch = startDateFilter ?? new Date(0);

            try {
                await loadTournaments(searchQuery, dateToSearch);
            } catch (err) {
                setError("Failed to load tournaments");
                console.error(err);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery, loadTournaments, startDateFilter]);


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // prevents a reload of the page
    const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
    }, []);

    return (
        <main className="bg-white flex-col font-[Poppins] justify-center items-center p-4 sm:p-6 lg:p-8">
            <h1 className="text-center font-bold text-primary mb-5 sm:mb-6 lg:mb-8 text-xl sm:text-2xl lg:text-4xl">
                The Arena Awaits: Find Your Competition
            </h1>

            <div className="w-full lg:px-8">

                {/* Search form */}
                <form onSubmit={handleSearchSubmit}
                      className="flex flex-col gap-3 sm:flex-row sm:gap-0 bg-white mb-6 sm:mb-8">

                    <SearchBar
                        searchQuery={searchQuery}
                        handleInputChange={handleInputChange}
                        searchPlaceholder="Search tournaments by name..."
                        inputClassName="w-full p-3 pl-10 sm:p-4 sm:pl-10 text-sm sm:text-base text-gray-800 border-2
                                        border-gray-300 rounded-lg focus:outline-none focus:border-primary
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
                        className="w-full sm:w-auto p-3 sm:p-4 text-sm sm:text-base text-gray-800 border-2 border-gray-300 
                                   rounded-lg focus:outline-none focus:border-primary transition duration-150 cursor-pointer 
                                   sm:rounded-l-none sm:min-w-[180px]"
                    />
                </form>

                {/* Search results window */}
                <div className="flex flex-col max-h-[63vh] gap-1 ">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                        Found {displayedTournaments.length} Tournament(s):
                    </h2>

                    <div className="overflow-y-auto">
                        {isLoading && (
                            <div className="p-6 sm:p-8 text-center text-gray-500">
                                Loading...
                            </div>
                        )}

                        {error && (
                            <div className="text-center mt-6 sm:mt-8 text-red-600 px-4">
                                Error: {error}
                            </div>
                        )}

                        {!isLoading && !error && (
                            <SearchResults tournaments={displayedTournaments}/>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}