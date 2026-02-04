'use client'
import Link from "next/link";
import { Plus } from "lucide-react";

export default function NavigationBar({ hiddenButton }: { hiddenButton: boolean }) {
    const generalButtonClass = "bg-white text-[#BD2D2D] flex flex-row justify-center rounded-lg hover:bg-gray-200 transition duration-150 p-2 drop-shadow-lg gap-1"
    return (
        <>
            {/*Navigation Bar*/}
            <nav className="bg-[#BD2D2D] p-3 w-full sticky top-0 z-10">
                <ul className="flex justify-between items-center list-none">

                    {/* Left: Logo/Banner */}
                    {/* href will have to be changed to homepage when implemented */}
                    <Link href='/tournaments'>
                        <img src="/matchup-logo-2.png" alt="Matchup Logo" className="flex-shrink-0 w-35 h-11 lg:w-42 lg:h-13 hover:cursor-pointer" />
                    </Link>

                    {/* Right: Navigation Buttons */}
                    <div className="flex flex-row gap-2">

                        {/* Create Tournament */}
                        <Link
                            href="/tournaments/create"
                            className={generalButtonClass}
                            hidden={hiddenButton}
                        >
                            <Plus size={18} className="place-self-center" />
                            <p className="hidden sm:block">Create Tournament</p>
                        </Link>

                        {/* If not signed in, will have to hide once they are logged in */}
                        <Link
                            href={"/signup"}
                            className={generalButtonClass}
                            hidden={hiddenButton}
                        >
                            Signup
                        </Link>
                    </div>
                </ul>
            </nav>
        </>
    );
}