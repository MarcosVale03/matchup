import {fetchBracketPhasesFromEventId} from "@/server/queries/phases.queries";
import {notFound} from "next/navigation";
import BracketDetails from "@/features/event-brackets/BracketDetails";

export default async function Page({ params, searchParams }: {
    params: Promise<{ tournamentId: string, eventId: string }>
    searchParams?: Promise<{ bpid: string }>
}) {
    const { tournamentId: tidStr, eventId: eidStr } = await params
    const tournamentId = Number(tidStr);
    const eventId = Number(eidStr);
    const sparams = await searchParams
    const bpid = Number(sparams?.bpid || 0)

    if (isNaN(tournamentId) || tournamentId <= 0 || isNaN(eventId) || eventId <= 0 || bpid < 0) {
        notFound();
    }

    const bracketPhases = await fetchBracketPhasesFromEventId(tournamentId, eventId);

    // let phaseGroups = null

    return (
        <div className="bg-main-bg font-[Poppins] text-black">
            <BracketDetails bracketPhases={bracketPhases} currBP={bpid} />
        </div>
    )
}