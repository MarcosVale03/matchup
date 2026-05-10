import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import {notFound, redirect} from "next/navigation";
import TournamentEditForm from "@/features/tournament-crud/edit-tournament";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";
import {getUser} from "@/server/queries/users.queries";
import { fetchAdminsFromTournament } from "@/server/queries/admins.queries";

export default async function EditTournamentPage({ params }: { params: Promise<{ tournamentId: string }> }) {
    const {tournamentId: idStr} = await params
    const id = Number(idStr);

    const user = await getUser();

    const {success, tournament} = await fetchTournamentFromId(id);
    const currAdmins = await fetchAdminsFromTournament(id);

    if (!success || !tournament) {
        return notFound();
    }

    const hasPermissions = await hasPermissionLevel(user.id, id, PermissionLevel.Admin)

    if (!hasPermissions) {
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
}