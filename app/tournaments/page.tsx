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
        <main className="flex-col bg-main-bg font-[Poppins] font-semibold text-black justify-center items-center p-4 md:px-8 3xl:px-16">

            {/* Header */}
            <div className="text-center mb-6 mt-4 w-fit place-self-center">
                <h1 className="text-3xl md:text-4xl 3xl:text-5xl font-jersey-25 tracking-wide font-normal">
                    The Arena Awaits: Find Your Competition
                </h1>
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-0.5 bg-primary"/>
                    <p className="text-sm 3xl:text-base text-zinc-500 text-center min-w-0">
                        Browse upcoming tournaments and register to compete
                    </p>
                    <div className="flex-1 h-0.5 bg-primary"/>
                </div>
            </div>

            {/* Search bar and results */}
            <div className="w-full rounded-2xl 3xl:px-16">
                <SearchControls />
                <div className="flex flex-col gap-1">
                    {tournaments.length > 1 && (
                        <h2 className="text-base md:text-lg font-[Poppins]">
                            Found {tournaments.length} Tournaments:
                        </h2>
                    )}
                    {tournaments.length === 1 && (
                        <h2 className="text-base md:text-lg font-[Poppins]">
                            Found 1 Tournament:
                        </h2>
                    )}
                    <SearchResults tournaments={tournaments}/>
                </div>
            </div>
        </main>
    );
}