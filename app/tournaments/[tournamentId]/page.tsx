import {fetchTournamentFromId} from "@/server/queries/tournaments.queries";
import {notFound} from "next/navigation";
import {TournamentDetails} from "@/features/tournament-search/tournament-details";
import {Trophy} from "lucide-react";
import Link from "next/link";
import {fetchEventsFromTournamentId} from "@/server/queries/events.queries";
import {getUser} from "@/server/queries/users.queries";
import {hasPermissionLevel} from "@/server/queries/admins.queries";
import {PermissionLevel} from "@/lib/types/types";
import {FetchEventsFromTournamentIdResponse} from "@/server/queries/events.queries";
import { fetchAdminsFromTournament } from "@/server/queries/admins.queries";


export default async function TournamentDetailsPage({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id) || id <= 0) {
        notFound();
    }

    const { success: tournamentSuccess, tournament } = await fetchTournamentFromId(id);
    const { events } = await fetchEventsFromTournamentId(id);


    if (!tournamentSuccess || !tournament) {
        return (
            <main className="bg-main-bg flex flex-col items-center justify-center py-10 text-black font-[Poppins]">
                <Trophy size={48} className="text-gray-300 mb-4" />
                <h1 className="text-2xl font-jersey-25 text-gray-700 mb-2">
                    Tournament Does Not Exist
                </h1>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    This tournament may have been deleted or the link is invalid.
                </p>
                <Link
                    href="/tournaments"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-base font-jersey-25
                                hover:bg-secondary transition-colors duration-150"
                >
                    Back to Tournaments
                </Link>
            </main>
        );
    }

    // getting the permissions for editing and deleting
    const user = await getUser();

    const permissions = await hasPermissionLevel(user.id, id, PermissionLevel.Reporter)
    // get admins
    const admins = await fetchAdminsFromTournament(id)
    let adminPermLevel

    for (const admin of admins) {
        if (user?.id === admin.users.user_id) {
            adminPermLevel = admin.permission_levels.id
            break
        }
    }

    return (
        <main className="bg-main-bg flex flex-col font-[Poppins] text-black">
            <TournamentDetails
                tournament={tournament}
                hasPermissions={permissions}
                events={events}
            />
        </main>
    );
}