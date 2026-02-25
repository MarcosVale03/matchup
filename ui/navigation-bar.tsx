'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/client-layout";
import { CircleUser, MessageCircleMore, Plus, Trophy } from "lucide-react";

export default function NavigationBar() {
    const pathname = usePathname();

    const { user, loading } = useAuth();

    const isAuthPage = pathname === "/signup" || pathname === "/login";

    const generalButtonClass = `flex flex-row justify-center rounded-md sm:rounded-md hover:bg-gray-200 
                                hover:text-primary transition duration-150 p-2 drop gap-1`;

    const skeletonButton = (
        <div className="h-9 w-28 sm:w-36 bg-white/20 animate-pulse rounded-md"/>
    )

    return (
        <nav className="bg-primary p-3 sticky w-full top-0 z-10 border-b border-primary font-[Poppins] font-semibold">
            <ul className="flex justify-between items-center list-none">

                {/* Left: Logo */}
                <Link href='/tournaments'>
                    <Image
                        src="/matchup-logo-2.png"
                        alt="Matchup Logo"
                        width={168}
                        height={52}
                        className="shrink-0 w-35 h-11 lg:w-42 lg:h-13 hover:cursor-pointer"
                        priority
                    />
                </Link>

                {/* Right: Navigation Buttons */}
                <div className="flex flex-row gap-1 sm:gap-2">
                    {loading ? (
                        // ── Loading state ──
                        <div className="flex gap-2">
                            {/* placeholder buttons */}
                            {skeletonButton}
                            {skeletonButton}
                            {skeletonButton}
                            {skeletonButton}
                        </div>
                    ) : (
                        <>
                            {/* Forums */}
                            {!isAuthPage && (
                                <Link
                                    href="/forums"
                                    className={`${pathname === "/forums" ? "bg-white text-primary" : ""} ${generalButtonClass}`}
                                >
                                    <MessageCircleMore className="place-self-center size-5"/>
                                    <p className="hidden sm:block">
                                        Forums
                                    </p>
                                </Link>
                            )}

                            {/* Tournaments | Available to anyone */}
                            {!loading && !isAuthPage && (
                            <Link href="/tournaments" className={generalButtonClass}>
                                <Trophy size={18} className="place-self-center" />
                                <p className="hidden sm:block">Tournaments</p>
                            </Link>
                            )}

                            {/* Log In if not logged in */}
                            {!user && !isAuthPage && (
                                <Link href="/login" className={generalButtonClass}>
                                    <CircleUser size={18} className="place-self-center" />
                                    Log In
                                </Link>
                            )}

                            {/* Profile */}
                            {user && !isAuthPage && (
                                <Link
                                    href="/profile"
                                    className={`${pathname === "/profile" ? "bg-white text-primary" : ""} ${generalButtonClass}`}
                                >
                                    <CircleUser className="place-self-center size-5"/>
                                    <p className="hidden sm:block">
                                        {
                                            user.user_metadata?.display_name ||
                                            user.email
                                        }
                                    </p>
                                </Link>
                            )}

                            {/* Sign Out | Only available if signed in */}
                            {!loading && user && !isAuthPage && (
                                <Link href="/signout" className={generalButtonClass}>
                                    <p className="hidden sm:block">Sign Out</p>
                                </Link>
                            )}

                            {/* Create Tournament | Only available if signed in */}
                            {user && !isAuthPage && (
                                <Link
                                    href="/tournaments/create"
                                    className={
                                        `${pathname === "/tournaments/create" ? "bg-white text-primary" : ""} 
                                         ${generalButtonClass}`}
                                >
                                    <Plus className="place-self-center size-5"/>
                                    <p className="hidden sm:block"></p>
                                </Link>
                            )}

                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
}