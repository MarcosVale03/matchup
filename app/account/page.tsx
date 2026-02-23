import { cookies } from "next/headers"
import { createClient } from "@/server/db/server"
import LogoutButton from "./logout-button"

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">
                    You must be logged in
                </p>
            </div>
        )
    }

    const displayName = user.user_metadata?.display_name ?? "Unknown"
    const firstName = user.user_metadata?.first_name ?? ""
    const lastName = user.user_metadata?.last_name ?? ""
    const name = `${firstName} ${lastName}`.trim()
    const email = user.user_metadata?.email ?? ""

    return (
        <div className="bg-white font-[Poppins] absolute inset-0 h-full flex justify-center items-center">
            <div className="w-full mx-8 bg-white border border-gray-200 rounded-lg shadow-sm p-8">

                <h1 className="text-2xl font-semibold text-primary mb-6">
                    Profile
                </h1>

                <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-1 text-wrap">
                        Signed in as
                    </p>
                    <p className="text-lg font-medium text-gray-800 text-wrap">
                        {displayName}
                    </p>
                    <p className="text-lg font-medium text-gray-800 text-wrap">
                        {name}
                    </p>
                    <p className="text-lg font-medium text-gray-800">
                        {email}
                    </p>
                </div>

                <LogoutButton />
            </div>
        </div>
    )
}