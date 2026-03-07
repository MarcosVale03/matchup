import { fetchTournamentsForSearch } from '@/server/queries/tournaments.queries';
import { SearchResults } from '@/features/tournament-search/search-results';
import SearchControls from '@/features/tournament-search/search-controls';

export default async function TournamentSearchPage({ searchParams }: {
    searchParams: { query?: string; startDate?: string }
}) {
    const { query = '', startDate } = await searchParams;
    const dateToSearch = startDate ? new Date(startDate) : new Date(0);

    const tournaments = await fetchTournamentsForSearch(query, dateToSearch) ?? [];

    return (
        <main className="bg-white flex-col font-[Poppins] justify-center items-center p-4 sm:p-6 lg:p-8">
            <h1 className="text-center font-bold text-primary mb-5 sm:mb-6 lg:mb-8 text-xl sm:text-2xl lg:text-4xl">
                The Arena Awaits: Find Your Competition
            </h1>

            <div className="w-full lg:px-8">
                {/* Search Bar and query logic */}
                <SearchControls />

                {/* Results */}
                <div className="flex flex-col max-h-[63vh] gap-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                        Found {tournaments.length} Tournament(s):
                    </h2>
                    <div className="overflow-y-auto">
                        <SearchResults tournaments={tournaments} />
                    </div>
                </div>
            </div>
        </main>
    );
}