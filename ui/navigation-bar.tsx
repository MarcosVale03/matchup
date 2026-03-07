'use client'
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/app/client-layout";
import { signOut } from "@/lib/auth";
import { CircleUser, LogOut, MessageCircleMore, Menu, Plus, Trophy, X } from "lucide-react";
import { useState } from "react";

export default function NavigationBar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useProfile();
    const [menuOpen, setMenuOpen] = useState(false);

    const isAuthPage = pathname === "/signup" || pathname === "/login";

    const handleSignOut = async () => {
        const { success } = await signOut();
        if (success) {
            router.push("/");
            router.refresh();
        }
    }

    // for screens that show the buttons on the nav bar
    const generalButtonClass = `flex flex-row items-center justify-center rounded-md hover:bg-white 
                                hover:text-primary transition duration-200 p-2 gap-1`;

    // for screens that show the button on the side panel when expanded
    const sidebarButtonClass = `flex flex-row items-center gap-3 w-full px-4 py-3 rounded-md 
                                hover:bg-white hover:text-primary transition duration-200 font-semibold`;

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav className="bg-primary p-3 sticky w-full top-0 z-10 font-[Poppins] font-semibold">
                <ul className="flex justify-between items-center list-none">

                    {/* Left: Logo */}
                    <Link href='/tournaments' className="shrink-0">
                        <Image
                            src="/matchup-logo-2.png"
                            alt="Matchup Logo"
                            width={168}
                            height={52}
                            className="w-30 lg:w-36"
                            style={{ height: 'auto' }}
                            priority
                        />
                    </Link>

                    {/* Desktop: Navigation Buttons (hidden on small screens) */}
                    {!isAuthPage && (
                        <div className="hidden sm:flex flex-row gap-1 sm:gap-2 shrink-0">
                            <Link
                                href="/forums"
                                className={`${pathname === "/forums" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
                            >
                                <MessageCircleMore className="size-5"/>
                                <p>Forums</p>
                            </Link>

                            <Link
                                href="/tournaments"
                                className={`${pathname === "/tournaments" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
                            >
                                <Trophy size={18}/>
                                <p>Tournaments</p>
                            </Link>

                            {!user && (
                                <Link href="/login" className={`text-white ${generalButtonClass}`}>
                                    <CircleUser size={18}/>
                                    Log In
                                </Link>
                            )}

                            {user && (
                                <Link
                                    href="/profile"
                                    className={`${pathname === "/profile" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
                                >
                                    <CircleUser className="size-5"/>
                                    <p>{user.user_metadata?.display_name || user.email}</p>
                                </Link>
                            )}

                            {user && (
                                <button onClick={handleSignOut} className={`text-white ${generalButtonClass}`}>
                                    <LogOut className="size-5"/>
                                    <p>Sign Out</p>
                                </button>
                            )}

                            {user && (
                                <Link
                                    href="/tournaments/create"
                                    className={`${pathname === "/tournaments/create" ? "bg-white text-primary" : "text-white"} ${generalButtonClass}`}
                                >
                                    <Plus className="size-5"/>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Mobile: Hamburger button (visible only on small screens) */}
                    {!isAuthPage && (
                        <button
                            className="sm:hidden text-white p-2"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="size-6"/>
                        </button>
                    )}
                </ul>
            </nav>

            {/* Backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 sm:hidden"
                    onClick={closeMenu}
                />
            )}

            {/* Side Panel */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-primary z-30 sm:hidden shadow-2xl
                            transform transition-transform duration-300 ease-in-out
                            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Panel Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/20">
                    <span className="text-white font-semibold text-lg font-[Poppins]">
                        Menu
                    </span>
                    <button onClick={closeMenu} className="text-white p-1 hover:bg-white/10 rounded-md">
                        <X className="size-6"/>
                    </button>
                </div>

                {/* Panel Links */}
                <div className="flex flex-col gap-1 p-3">

                    {/* Forum button */}
                    <Link href="/forums" onClick={closeMenu}
                          className={`${pathname === "/forums" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
                        <MessageCircleMore className="size-5"/>
                        Forums
                    </Link>

                    {/* Tournaments button */}
                    <Link href="/tournaments" onClick={closeMenu}
                          className={`${pathname === "/tournaments" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
                        <Trophy className="size-5"/>
                        Tournaments
                    </Link>

                    {/* Login button, only available if not logged in */}
                    {!user && (
                        <Link href="/login" onClick={closeMenu} className={sidebarButtonClass}>
                            <CircleUser className="size-5"/>
                            Log In
                        </Link>
                    )}

                    {/* Profile button */}
                    {user && (
                        <Link href="/profile" onClick={closeMenu}
                              className={`${pathname === "/profile" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
                            <CircleUser className="size-5"/>
                            <span className="truncate">
                                {user.user_metadata?.display_name || user.email}
                            </span>
                        </Link>
                    )}

                    {/* Create tournament button */}
                    {user && (
                        <Link href="/tournaments/create" onClick={closeMenu}
                              className={`${pathname === "/tournaments/create" ? "bg-white text-primary" : ""} ${sidebarButtonClass}`}>
                            <Plus className="size-5"/>
                            Create Tournament
                        </Link>
                    )}

                    {/* Sign out button */}
                    {user && (
                        <button onClick={() => { handleSignOut(); closeMenu(); }} className={sidebarButtonClass}>
                            <LogOut className="size-5"/>
                            Sign Out
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}