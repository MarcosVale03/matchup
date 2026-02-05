'use client'
import Link from 'next/link';
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

    const loadTournaments = useCallback(async (query: string, startAfter: Date) => {
        setIsLoading(true);
        setError(null);

        const response = await fetchTournaments(query, startAfter);

        if (response.success) {
            setDisplayedTournaments(response.data ?? []);
        } else {
            setError(response.message ?? "Error in displaying tournaments");
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

    
	const handleSearchSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
    }, []);

	return (
		<>
		<NavigationBar hidden={false} />
		<main className="bg-white flex flex-col min-h-screen justify-center items-center">

			<div className="p-4 w-6/12 mt-16">
				<h1 className="text-4xl font-bold text-center text-[#BD2D2D]" id='Title123'>
					Welcome to MatchUp
				</h1>

				<h2 className="text-center text-gray-500 mb-5">
					The Arena Awaits: Find Your Competition
				</h2>
                
			    {/* Search Bar */}
				<form onSubmit={handleSearchSubmit} className="flex w-full">
					<input
						type="search"
						value={searchQuery}
						onChange={handleInputChange}
						placeholder="Search by name..."
						className="flex-grow p-4 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#BD2D2D] transition duration-150"
					/>

                    {/* Date filter */}
                    <div className="relative">
                        <label className="text-xs text-gray-500 absolute -top-4 left-0" htmlFor="startDateFilterInput">
                            Tournaments that start after:
                        </label>
                        <input 
                            id="startDateFilterInput"
                            type="date" 
                            onChange={(e) => {
                                setStartDateFilter(e.target.value ? new Date(e.target.value) : null)
                            }}
                            className="p-4 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#BD2D2D] transition duration-150 cursor-pointer"
                        />
                    </div>
                    
				</form>
				<div className="mt-8">
			        <h2 className="text-xl font-semibold text-gray-700 sticky top-0 p-2 z-10">
				        Found {displayedTournaments.length} Tournament(s):
			        </h2>

                    {/* Search results window */}
			        <div className="max-h-[35rem] overflow-y-auto border min-h-[35rem]">
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
		</>	
	)
}
