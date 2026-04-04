'use client'

import React, { createContext, useContext } from "react"
import { User } from "@supabase/supabase-js"

export type AuthContextType = {
    user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ClientLayout({
                                 children,
                                 initialUser,
                             }: {
    children: React.ReactNode
    initialUser: User | null
}) {

    return (
        <AuthContext.Provider value={{ user: initialUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(AuthContext)

    if (!context)
        throw new Error("useAuth must be used within ClientLayout")

    return context
}