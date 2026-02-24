'use client'

import { createClient } from "@/server/db/client"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-primary text-white font-medium hover:opacity-90 transition"
        >
            <LogOut className="mr-2 size-5" />
            Logout
        </button>
    )
}