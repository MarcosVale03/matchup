import {fetchTournamendIdFromSlug} from "@/server/queries/tournaments.queries";
import {notFound, redirect} from "next/navigation";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const { success, data: id } = await fetchTournamendIdFromSlug(slug)
    if (!success) {
        notFound()
    }
    redirect(`/tournaments/${id}`);
}