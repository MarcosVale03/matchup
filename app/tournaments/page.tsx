import {fetchTournamentsForSearch} from '@/server/queries/tournaments.queries';
import {SearchResults} from '@/features/tournament-search/search-results';
import SearchControls from '@/features/tournament-search/search-controls';

export default async function TournamentSearchPage({searchParams}: {
    searchParams: { query?: string; startDate?: string }
}) {
    const {query = '', startDate} = await searchParams;
    const dateToSearch = startDate ? new Date(startDate) : new Date(0);

    const tournaments = await fetchTournamentsForSearch(query, dateToSearch) ?? [];

    return (
        <main
            className="flex-col bg-main-bg font-poppins font-semibold text-black justify-center items-center p-4 md:px-8 3xl:px-16">

            {/* Header */}
            <div className="text-center mb-6 mt-4 w-fit place-self-center">
                <h2 className="">
                    The Arena Awaits: Find Your Competition
                </h2>
                <p className="text-sm 3xl:text-base text-zinc-500 text-center min-w-0">
                    Browse upcoming tournaments and register to compete
                </p>
            </div>

            {/* Search bar and results */}
            <div className="w-full rounded-2xl 3xl:px-16">
                <SearchControls/>
                <div className="flex flex-col gap-1">
                    {tournaments.length > 1 && (
                        <h4>
                            Found {tournaments.length} Tournaments:
                        </h4>
                    )}
                    {tournaments.length === 1 && (
                        <h4 className="">
                            Found 1 Tournament:
                        </h4>
                    )}
                    <SearchResults tournaments={tournaments}/>
                </div>
            </div>
        </main>
    );
}