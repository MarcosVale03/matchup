import {fetchTournamentsForSearch} from '@/server/queries/tournaments.queries';
import {SearchResults} from '@/features/tournament-search/search-results';
import SearchControls from '@/features/tournament-search/search-controls';
import PaginationControls from '@/features/tournament-search/pagination-controls';

const PER_PAGE = 9;

export default async function TournamentSearchPage({searchParams}: {
    searchParams: { query?: string; startDate?: string; page?: string }
}) {
    const {query = '', startDate, page: pageParam = '1'} = await searchParams;
    const dateToSearch = startDate ? new Date(startDate) : new Date(0);
    const page = Math.max(1, parseInt(pageParam, 10) || 1);

    const {tournaments, totalCount} = await fetchTournamentsForSearch(query, dateToSearch, '', page - 1, PER_PAGE);
    const totalPages = Math.ceil(totalCount / PER_PAGE);

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
                    {totalCount > 1 && (
                        <h4>
                            Found {totalCount} Tournament{totalCount !== 1 ? 's' : ''}:
                        </h4>
                    )}
                    {totalCount === 1 && (
                        <h4 className="">
                            Found 1 Tournament:
                        </h4>
                    )}
                    <SearchResults tournaments={tournaments}/>
                    <PaginationControls page={page} totalPages={Math.max(1, totalPages)}/>
                </div>
            </div>
        </main>
    );
}