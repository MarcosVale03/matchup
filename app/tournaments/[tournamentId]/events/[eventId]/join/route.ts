import { sendNotification } from "@/features/notifications/send-notification";
import { fetchEventFromEventId } from "@/server/queries/events.queries";
import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";

export async function POST(
    req: Request,
    { params }: { params: { tournamentId: number; eventId: number } }
) {
    const { tournamentId, eventId } = await params;
    const { playerId, playerName } = await req.json();

    const tournament = await fetchTournamentFromId(tournamentId);
    const event = await fetchEventFromEventId(tournamentId, eventId);

    const organizerId = tournament.tournament?.owner.user_id;
    const tournamentName = tournament.tournament?.name;
    const eventName = event.event?.name;

    if (organizerId && organizerId !== playerId && tournamentName && eventName) {
        await sendNotification(organizerId, {
            type: "player_joined",
            tournamentId,
            tournamentName,
            eventId,
            eventName,
            playerName,
            playerId,
            timestamp: new Date().toISOString(),
        });
    }

    return Response.json({ success: true });
}
