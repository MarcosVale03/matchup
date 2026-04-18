import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";
import TournamentEditForm from "@/features/tournament-crud/edit-tournament";

export default async function EditTournamentPage({ params }: { params: { tournamentId: string } }) {
    const { tournamentId: idStr } = await params
    const id = Number(idStr);

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    const { success, tournament } = await fetchTournamentFromId(id);

    if (!success || !tournament) {
        return notFound();
    }

    if (!user || user.id !== tournament.owner.user_id) {
        redirect('/tournaments')
    }

    return (
        <div className="bg-main-bg flex flex-col text-black font-poppins justify-center">
            <TournamentEditForm initialData={{ ...tournament }} />
        </div>
    );
}