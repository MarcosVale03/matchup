import UserInformation from "@/features/account-profile/user-information";
import { fetchUserInfo, fetchFutureTournaments, fetchPastTournaments } from "@/server/queries/profile.queries";
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch everything in parallel
    const [profileResult, futureResult, pastResult] = await Promise.all([
        fetchUserInfo(user.id),
        fetchFutureTournaments(user.id),
        fetchPastTournaments(user.id),
    ]);

    // if there is no profile, assume there is no user and go to login
    if (!profileResult.success || !profileResult.data) {
        redirect("/login");
    }

    return (
        <UserInformation
            profile={profileResult.data}
            futureTournaments={futureResult.success ? (futureResult.data ?? []) : []}
            pastTournaments={pastResult.success ? (pastResult.data ?? []) : []}
        />
    );
}