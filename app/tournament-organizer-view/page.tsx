import { fetchMatchPerPhaseGroup } from "@/server/queries/match-setups.queries"
import AssignMatchesForm from "@/features/to-assign-matches/assign-matches"
import { fetchMatchSetupByTournament } from "@/server/queries/match-setups.queries"

export default async function AssignMatchesPage() {
  const tournament_id = 80
  const event_id = 2
  const phase_group_identifier = 'PoolA'
  const matchesResult = await fetchMatchPerPhaseGroup(tournament_id, event_id, phase_group_identifier)
  const stationsResult = await fetchMatchSetupByTournament(tournament_id, event_id)
  

  return (
    <div className="bg-main-bg flex flex-col text-black font-[Poppins] justify-center">
      <AssignMatchesForm matches={matchesResult.data ?? []} 
                stations={stationsResult.data ?? []}
                tournament_id={tournament_id} 
                event_id={event_id} />
    </div>
  )
}
  