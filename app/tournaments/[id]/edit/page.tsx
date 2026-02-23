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

    const { success, tournament } = await fetchTournamentFromId(id);

    if (!success || !tournament) {
        console.log("HELLO")
        return notFound();
    }

    return (
            <main className="bg-white flex flex-col min-h-screen">
                <NavigationBar />
                
                <div className="flex place-content-center">
                    <TournamentEditForm initialData={{
                        name: tournament.name,
                        start_time: new Date(tournament.start_time),
                        end_time: new Date(tournament.end_time),
                        slug: tournament.slug,
                        id: tournament.id,

                        is_online: false,
                        contact: {
                            email: tournament.email_contact,
                            discord: tournament.discord_invite
                        },
                        location: null,
                    }} />
                </div>

            </main>
    );
}