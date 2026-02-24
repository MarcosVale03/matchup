'use client';

import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/server/db/client';

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function ClientLayout({ children, initialUser, }: {
    children: ReactNode;
    initialUser: User | null;
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [loading, setLoading] = useState(!initialUser && initialUser !== null);

    useEffect(() => {
        const supabase = createClient();

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        if (!initialUser) {
            supabase.auth.getUser().then(({ data }) => {
                setUser(data.user);
                setLoading(false);
            });
        }

        return () => listener.subscription.unsubscribe();
    }, [initialUser]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within ClientLayout');
    return context;
}