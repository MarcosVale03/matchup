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
                    {/* href will have to be changed to homepage when implemented */}
                    <Link href='/tournaments'>
                        <img src="/matchup-logo-2.png" alt="Matchup Logo" className="flex-shrink-0 w-35 h-11 hover:cursor-pointer" />
                    </Link>

                    {/* Right: Create Tournament Button */}
                    <Link
                        href="/tournaments/create"
                        className="flex-shrink-0 px-4 py-2 mr-2 bg-white text-[#BD2D2D] rounded-lg hover:bg-gray-200 transition duration-150 flex items-center gap-1 drop-shadow-lg"
                        hidden={hidden}
                    >
                        <Plus size={18} />
                        Create Tournament
                    </Link>
                </ul>
            </nav>
        </div>
    );
}