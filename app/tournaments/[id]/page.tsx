import {fetchTournamentFromId} from "@/server/queries/tournaments.queries";
import {notFound} from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);
    const {success, data} = await fetchTournamentFromId(id)
    if (!success || !data) {
        notFound()
    }
    return (
        <div>
            <h2>{data.name}</h2>
            <p>{data.start_time.toLocaleString()}</p>
        </div>
    )
}