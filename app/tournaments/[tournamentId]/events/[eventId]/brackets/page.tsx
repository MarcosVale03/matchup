import {
    doesBracketPhaseExist,
    fetchBracketPhasesFromEventId,
    fetchPhaseGroupsFromBracketPhase
} from "@/server/queries/phases.queries";
import {notFound} from "next/navigation";
import BracketDetails from "@/features/event-brackets/BracketDetails";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";

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
        <div className="flex-1 bg-main-bg font-poppins text-black overflow-y-auto overflow-x-scroll mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <Link
                href={`/tournaments/${tournamentId}/events/${eventId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary
                           transition-colors ml-4 mt-6"
            >
                <ArrowLeft className="size-4" />
                Back to event details
            </Link>

            <BracketDetails bracketPhases={bracketPhases} currBP={bpid} phaseGroups={phaseGroups} />
        </div>
    )
}