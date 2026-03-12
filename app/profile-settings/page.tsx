import ProfileSettings from "@/features/profile-settings/profile-settings";
import { fetchUserInfo } from '@/server/queries/profile.queries'
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileSettinsPage() {
    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const profileInfo = await fetchUserInfo(user.id)

    // if there is no profile, assume there is no user and go to login
    if (!profileInfo.success || !profileInfo.data) {
        redirect("/login");
    }

    return <ProfileSettings profile={profileInfo.data}/>
}
