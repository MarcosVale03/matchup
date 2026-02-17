'use client'
import Link from "next/link";
import Image from "next/image";
import { CircleUser, MessageCircleMore, Plus } from "lucide-react";
import { usePathname } from "next/navigation"; 
import type { User } from "@supabase/supabase-js"

export default function NavigationBar({ hidden, user  }: {hidden?: boolean, user: User | null}) {
    const pathname = usePathname(); 
    const isAuthPage = pathname === "/signup" || pathname === "/login";

    const generalButtonClass = `flex flex-row justify-center rounded-md sm:rounded-none hover:bg-gray-200 
                                hover:text-primary transition duration-150 p-2 drop gap-1`;
    return (
        <nav className="fixed bg-primary p-3 w-full sticky top-0 z-10 border-b border-primary font-[Poppins] font-semibold">
            <ul className="flex justify-between items-center list-none">
                
                {/* Left: Logo */}
                <Link href='/tournaments'>
                    <Image 
                        src="/matchup-logo-2.png" 
                        alt="Matchup Logo" 
                        width={168}
                        height={52}
                        className="flex-shrink-0 w-35 h-11 lg:w-42 lg:h-13 hover:cursor-pointer" 
                        priority
                    />
                </Link>

                {/* Right: Navigation Buttons */}
                <div className="flex flex-row gap-1 sm:gap-2">
                    
                    {/* Create Tournament | Only available if signed in */}
                    {user && !isAuthPage && (
                        <Link href="/tournaments/create" className={`${pathname === "/tournaments/create" ? "bg-white text-primary" : ""} ${generalButtonClass}`}>
                            <Plus className="place-self-center size-5" />
                            <p className="hidden sm:block">Create Tournament</p>
                        </Link>
                    )}

                    {/* Signup if not logged in */}
                    {!user && !isAuthPage && (
                        <Link href="/signup" className={generalButtonClass}>
                            <CircleUser className="place-self-center size-5" />
                            Signup
                        </Link>
                    )}

                    {/* Forums */}
                    {!isAuthPage && (
                        <Link href="/forums" className={`${pathname === "/forums" ? "bg-white text-primary" : ""} ${generalButtonClass}`}>
                            <MessageCircleMore className="place-self-center size-5" />
                            <p className="hidden sm:block">Forums</p>
                        </Link>
                    )}
    
                </div>
            </ul>
        </nav>
    );
}