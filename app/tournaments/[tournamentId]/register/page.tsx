import { fetchTournamentFromId } from '@/server/queries/tournaments.queries';
import { fetchEventsFromTournamentId } from '@/server/queries/events.queries';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/server/db/server';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import RegistrationForm from '@/features/tournament-registration/registration-form';

export default async function TournamentRegistrationPage({
    params,
}: {
    params: Promise<{ tournamentId: string }>;
}) {
    const { tournamentId: idStr } = await params;
    const tournamentId = Number(idStr);

    if (isNaN(tournamentId) || tournamentId <= 0) {
        notFound();
    }

    // Auth check — redirect to login if not signed in
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?redirect=/tournaments/${tournamentId}/register`);
    }

    // Fetch tournament and events in parallel
    const [{ success: tournamentSuccess, tournament }, { success: eventsSuccess, events }] =
        await Promise.all([
            fetchTournamentFromId(tournamentId),
            fetchEventsFromTournamentId(tournamentId),
        ]);

    if (!tournamentSuccess || !tournament) {
        return (
            <main className="bg-main-bg flex flex-col items-center justify-center py-10 text-black font-[Poppins]">
                <Trophy size={48} className="text-gray-300 mb-4" />
                <h1 className="text-2xl font-jersey-25 text-gray-700 mb-2">Tournament Not Found</h1>
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

    return (
        <main className="bg-main-bg font-[Poppins] font-semibold text-black min-h-screen">
            <RegistrationForm
                tournament={tournament}
                events={eventsSuccess ? (events ?? []) : []}
                userId={user.id}
            />
        </main>
    );
}
