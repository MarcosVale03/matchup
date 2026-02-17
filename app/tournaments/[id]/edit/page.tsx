import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound, redirect } from "next/navigation";
import TournamentEditForm from "@/features/tournament-crud/modify-tournament";

export default async function EditTournamentPage({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);
    // if (!currentUserIsOwner(id)) {
    //     redirect('/unauthorized'); 
    // }

    const { success, tournament } = await fetchTournamentFromId(id);

    if (!success || !tournament) {
        console.log("HELLO")
        return notFound();
    }

    return (
            <main className="bg-white flex flex-col font-[Poppins]">                
                <div className="flex place-content-center">
                    <TournamentEditForm initialData={{...tournament}} />
                </div>
            </main>
    );
}