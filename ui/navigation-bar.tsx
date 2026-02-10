'use client'
import Link from "next/link";
import { CircleUser, MessageCircle, MessageCircleMore, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; 
import { createClient } from "@/server/db/client";

const supabase = createClient();

export default function NavigationBar({hidden}: {hidden?: boolean}) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname(); 

    // getting the user session
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const isAuthPage = pathname === "/signup" || pathname === "/login";

    const generalButtonClass = "text-white flex flex-row justify-center rounded-md sm:rounded-none hover:bg-gray-200 hover:text-primary transition duration-150 p-2 drop-shadow-lg/70 gap-1";
    return (
        <nav className="bg-primary p-3 w-full sticky top-0 z-10 border-b border-primary font-[Poppins] font-semibold">
            <ul className="flex justify-between items-center list-none">
                
                {/* Left: Logo */}
                <Link href='/tournaments'>
                    <img src="/matchup-logo-2.png" alt="Matchup Logo" className="flex-shrink-0 w-35 h-11 lg:w-42 lg:h-13 hover:cursor-pointer" />
                </Link>

                {/* Right: Navigation Buttons */}
                <div className="flex flex-row">
                    
                    {/* Create Tournament | Only available if signed in */}
                    {!loading && user && !isAuthPage && (
                        <Link href="/tournaments/create" className={generalButtonClass} hidden={hidden}>
                            <Plus size={18} className="place-self-center" />
                            <p className="hidden sm:block">Create Tournament</p>
                        </Link>
                    )}

                    {/* Signup if not logged in */}
                    {!loading && !user && !isAuthPage && (
                        <Link href="/signup" className={generalButtonClass}>
                            <CircleUser size={18} className="place-self-center" />
                            Signup
                        </Link>
                    )}

                    {/* Forums | just goes to the search page for the moment */}
                    {!loading && !isAuthPage && (
                        <Link href="/tournaments" className={generalButtonClass}>
                            <MessageCircleMore size={18} className="place-self-center" />
                            <p className="hidden sm:block">Forums</p>
                        </Link>
                    )}
    
                </div>
            </ul>
        </nav>
    );
}