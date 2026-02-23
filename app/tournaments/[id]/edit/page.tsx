import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";
import {notFound, redirect} from "next/navigation";
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";

import TournamentEditForm from "@/features/tournament-crud/modify-tournament";

export default async function EditTournamentPage({ params }: { params: { id: string } }) {
    const { id: idStr } = await params
    const id = Number(idStr);

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();


    const { success, data: tournament } = await fetchTournamentFromId(id);

    if (!success || !tournament) {
        return notFound();
    }

    if (!user || user.id !== tournament.owner) {
        redirect('/tournaments')
    }

    return (
            <main className="bg-white flex flex-col font-[Poppins]">
                <div className="flex place-content-center">
                    <TournamentEditForm initialData={{...tournament}} />
                </div>
            </main>
    );
}