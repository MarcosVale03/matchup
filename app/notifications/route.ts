import { notificationEmitter } from "@/lib/notifcation-emitter";
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    const organizerId = user?.id
    
    if (!organizerId) {
        return new Response("Missing organizerId", { status: 400 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const send = (data: object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Send a heartbeat to keep the connection alive
            const heartbeat = setInterval(() => send({ type: "ping" }), 30000);

            // Listen for join events for this specific organizer
            const onJoin = (payload: object) => {
                send(payload);
            }
            notificationEmitter.on(`join:${organizerId}`, onJoin);

            // Cleanup when client disconnects
            req.signal.addEventListener("abort", () => {
                clearInterval(heartbeat);
                notificationEmitter.off(`join:${organizerId}`, onJoin);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}