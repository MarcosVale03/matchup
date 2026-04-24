import { fetchMatchPerPhaseGroup } from "@/server/queries/match-setups.queries"
import AssignMatchesForm from "@/features/to-assign-matches/assign-matches"

export default async function AssignMatchesPage() {
  const result = await fetchMatchPerPhaseGroup(80, 2, 'PoolA')

  return (
    <div>
      <AssignMatchesForm matches={result.data ?? []}/>
    </div>
  )
}