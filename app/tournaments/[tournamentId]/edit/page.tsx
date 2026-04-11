import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import {notFound, redirect} from "next/navigation";
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";
import TournamentEditForm from "@/features/tournament-crud/edit-tournament";
import { fetchAdminsFromTournament } from "@/server/queries/admins.queries";

export default async function EditTournamentPage({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params
    const id = Number(idStr);
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    const { success, tournament } = await fetchTournamentFromId(id);
    const currAdmins = await fetchAdminsFromTournament(id);

    if (!success || !tournament) {
        return notFound();
    }

    // get admins
    const admins = await fetchAdminsFromTournament(id)
    let adminPermLevel

    for (const admin of admins) {
        if (user?.id === admin.users.user_id) {
            adminPermLevel = admin.permission_levels.id
            break
        }
    }
    const adminCheck = adminPermLevel !== undefined && adminPermLevel <= 1

    if (!user || user.id !== tournament.owner.user_id && !adminCheck) {
        redirect('/tournaments')
    }
        
    return (
            <main className="bg-main-bg flex flex-col text-black font-[Poppins]">
                <div className="flex">
                    <TournamentEditForm initialData={{...tournament}} currAdmins={currAdmins}/>
                </div>
            </main>
    );
}