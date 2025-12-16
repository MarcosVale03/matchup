import {fetchTournaments} from "@/server/queries/tournaments.queries";

export default async function Home() {
    const response = await fetchTournaments();

    if (!response.success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <main
                    className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                    <div>
                        <p>{response.message}</p>
                    </div>
                </main>
            </div>
        )
    }

    const tournaments = response.data
    const tournamentElements = tournaments != null ? tournaments.map((tournament) => {
        return <li key={tournament.id}>
            <h2>{tournament.name}</h2>
            <p>{tournament.start_time.toLocaleString()}</p>
        </li>
    }) : <li><p>Something went wrong!</p></li>

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div>
                    <ul>
                        {tournamentElements}
                    </ul>
                </div>
            </main>
        </div>
    )
}