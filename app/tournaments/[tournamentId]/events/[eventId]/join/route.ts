import { notificationEmitter } from "@/lib/notifcation-emitter";
import { fetchEventFromEventId } from "@/server/queries/events.queries";
import { fetchTournamentFromId } from "@/server/queries/tournaments.queries";

export async function POST(
    req: Request,
    { params }: { params: { tournamentId: number; eventId: number } }
) {
    const { tournamentId, eventId } = await params;
    const { playerId, playerName } = await req.json();

    // Fetch the tournament to get its organizer and event name
    const tournament = await fetchTournamentFromId(tournamentId);
    const event = await fetchEventFromEventId(tournamentId, eventId);


    const organizerId = tournament.tournament?.owner.user_id;
    const tournamentName = tournament.tournament?.name;
    const eventName = event.event?.name;

    notificationEmitter.emit(`join:${organizerId}`, {
        type: "player_joined",
        tournamentId,
        tournamentName,
        eventId,
        eventName,
        playerName,
        playerId,
        timestamp: new Date().toISOString(),
    });

    return Response.json({ success: true });
}