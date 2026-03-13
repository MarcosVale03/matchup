import { fetchTournamentsForSearch } from '@/server/queries/tournaments.queries';
import { SearchResults } from '@/features/tournament-search/search-results';
import SearchControls from '@/features/tournament-search/search-controls';

export default async function TournamentSearchPage({ searchParams }: {
    searchParams: { query?: string; start_date?: string }
}) {
    const { query = '', start_date } = await searchParams;
    const dateToSearch = start_date ? new Date(start_date) : new Date(0);

    const tournaments = await fetchTournamentsForSearch(query, dateToSearch) ?? [];

    return (
        <main className="bg-primary flex-col font-jersey-10 justify-center items-center p-4 sm:p-6 lg:pt-4 ">
            <h1 className="text-center text-3xl lg:text-5xl mb-4">
                The Arena Awaits: Find Your Competition
            </h1>

            <div className="w-full lg:px-8">
                {/* Search Bar and query logic */}
                <SearchControls />

                {/* Results */}
                <div className="flex flex-col gap-1">
                    {tournaments.length > 1 && (
                        <h2 className="text-xl lg:text-3xl">
                            Found {tournaments.length} Tournaments:
                        </h2>
                    )}

                    {tournaments.length === 1 && (
                        <h2 className="text-xl lg:text-3xl">
                            Found 1 Tournament:
                        </h2>
                    )}

                    <div className="overflow-y-auto">
                        <SearchResults tournaments={tournaments} />
                    </div>
                </div>
            </div>
        </main>
    );
}