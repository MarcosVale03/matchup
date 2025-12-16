'use client'
import Link from "next/link";
import { Plus } from "lucide-react";

export default function NavigationBar({ hidden }: { hidden: boolean }) {
    return (
        <div className="fixed top-0 left-0 w-full">
            {/*Navigation Bar*/}
            <nav className="bg-[#BD2D2D] p-3">
                <ul className="flex justify-between items-center w-full list-none p-0">

                    {/* Left: Logo/Banner */}
                    <li className="flex-shrink-0">
                        <Link href='/'>
                            <img src="/matchup-logo-2.png" alt="Matchup Logo" className="w-35 h-11 hover:cursor-pointer" />
                        </Link>
                    </li>

                    {/* Right: Create Tournament Button */}
                    <li className="flex-shrink-0" hidden={hidden}>
                        <Link
                            href="/login"
                            className="px-4 py-2 mr-2 bg-white text-[#BD2D2D] rounded-lg hover:bg-gray-200 transition duration-150 flex items-center gap-1 drop-shadow-lg"
                        >
                            <Plus size={18} />
                            Create Tournament
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}