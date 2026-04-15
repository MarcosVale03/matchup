import {
    doesBracketPhaseExist,
    fetchBracketPhasesFromEventId,
    fetchPhaseGroupsFromBracketPhase
} from "@/server/queries/phases.queries";
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

    if (bpid !== 0 && !(await doesBracketPhaseExist(tournamentId, eventId, bpid))) {
        notFound();
    }

    const bracketPhases = await fetchBracketPhasesFromEventId(tournamentId, eventId);

    const phaseGroups = bpid === 0 ?
        await Promise.all(bracketPhases.map(async (bp) => {return {
            bp: bp,
            pg: await fetchPhaseGroupsFromBracketPhase(tournamentId, eventId, bp.id, 8)
        }}))
        : [{
            bp: bracketPhases[bpid - 1],
            pg: await fetchPhaseGroupsFromBracketPhase(tournamentId, eventId, bpid)
        }]

    return (
        <div className="bg-main-bg font-[Poppins] text-black">
            <BracketDetails bracketPhases={bracketPhases} currBP={bpid} phaseGroups={phaseGroups} />
        </div>
    )
}