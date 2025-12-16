import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound, redirect } from "next/navigation";
import TournamentEditForm from "@/features/tournament-modification/page";
import NavigationBar from "@/ui/navigation-bar";

export default async function EditTournamentPage({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);
    // if (!currentUserIsOwner(id)) {
    //     redirect('/unauthorized'); 
    // }

    const { success, data: tournament } = await fetchTournamentFromId(id);

    if (!success || !tournament) {
        console.log("HELLO")
        return notFound();
    }

    return (
        <>
        <NavigationBar hidden={true} />
        <main className="py-12 bg-white min-h-screen">
            <TournamentEditForm initialData={{
                name: tournament.name,
                start_time: tournament.start_time,
                end_time: tournament.end_time, 
                slug: tournament.slug,         
                id: tournament.id,             
                
                is_online: false, 
                contact: null, 
                location: null,
            }} />
        </main>
        </>
        
    );
}