import {fetchTournaments} from "@/server/queries/queries";

export default async function Home() {
    const tournaments = await fetchTournaments();

    const tournamentElements = tournaments != null ? tournaments.map((tournament) => {
        return <li key={tournament.id}>
            <h2>{tournament.name}</h2>
            <p>{tournament.description}</p>
        </li>
    }) : <></>

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
            <ul>
                {tournamentElements}
            </ul>
        </div>
      </main>
    </div>
  );
}
