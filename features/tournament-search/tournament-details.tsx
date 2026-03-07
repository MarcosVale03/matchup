'use client';
import {FetchTournamentFromIdResponse} from "@/server/queries/tournaments.queries";
import {formatDateTime} from "@/ui/format-time";
import {useRouter} from "next/navigation";
import {Mail, Pencil, Globe, CircleUser} from "lucide-react";
import Image from "next/image";

export type TournamentPermissions = {
    canEdit: boolean;
    canDelete: boolean;
};

export default function TournamentDetails({
                                              tournament,
                                              permissions
                                          }: {
    tournament: FetchTournamentFromIdResponse;
    permissions: TournamentPermissions;
}) {
    const router = useRouter();

    const handleEditClick = () => {
        const url = `/tournaments/${tournament.id}/edit`;
        router.push(url);
    };

    return (
        <div className="overflow-y-auto text-gray-900 mx-0 sm:mx-4 lg:mx-20 border-x-0 sm:border-x-2 border-gray-200">
            <div className="p-4 sm:p-6 lg:p-8">

                <div
                    className="flex flex-col lg:flex-row items-start lg:items-center mb-5 gap-3 lg:gap-0 justify-between">
                    <h1 className="text-3xl lg:text-5xl wrap-break-word">
                        {tournament.name}
                    </h1>

                    {permissions.canEdit && (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0 border border-transparent
                            rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-primary
                            hover:bg-secondary disabled:opacity-50 transition-colors"
                        >
                            <Pencil size={19}/>
                            Edit Tournament
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row text-base sm:text-lg lg:text-xl">

                    {/* Tournament Organizer */}
                    <div className="flex flex-col w-full p-3">
                        <h2>
                            Organizer
                        </h2>
                        <div className="flex flex-row items-center min-w-0">
                            <CircleUser
                                size={30}
                                className="mr-2 shrink-0"
                            />
                            <p className="font-bold truncate min-w-0">
                                {tournament.owner.display_name}
                            </p>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col w-full p-3">
                        <h2>
                            Starts
                        </h2>
                        <div className="flex flex-row">
                            <p className="font-bold">
                                {formatDateTime(tournament.start_time)}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col w-full p-3">
                        <h2>
                            Ends
                        </h2>
                        <div className="flex flex-row">
                            <p className="font-bold">
                                {formatDateTime(tournament.end_time)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bg-primary text-white flex flex-col lg:flex-row tracking-wide text-lg
                wrap-break-word"
            >

                {/* Visibility */}
                <div
                    className="border-b-2 border-b-secondary lg:border-b-0 lg:border-r-2 lg:border-r-secondary w-full p-4 lg:p-5">
                    <h2 className="mb-2 text-lg">
                        Visibility
                    </h2>
                    <div className="flex flex-row items-center">
                        <div className="mr-2">
                            <Globe size={30}/>
                        </div>
                        <div className="">
                            {tournament.is_public ? (
                                <p className="break-all font-bold">
                                    PUBLIC
                                </p>
                            ) : (
                                <p className="break-all font-bold">
                                    PRIVATE
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div
                    className="border-b-2 border-b-secondary lg:border-b-0 lg:border-r-2 lg:border-r-secondary w-full p-5">
                    <h2 className="mb-2 text-lg">
                        Contact
                    </h2>
                    <div className="flex flex-row items-center">
                        <div className="mr-2">
                            <Mail size={30}/>
                        </div>
                        <div className="">
                            <p>
                                {tournament.email_contact}
                            </p>
                        </div>
                    </div>
                </div>


                {/* Discord */}
                <div
                    className="border-b-2 border-b-secondary lg:border-b-0 lg:border-r-2 lg:border-r-secondary w-full p-5">
                    <h2 className="mb-2 text-lg">
                        Community
                    </h2>
                    <div className="flex flex-row items-center">
                        <Image
                            src='/Discord-Symbol-White.svg'
                            alt='Discord Symbol'
                            width={35}
                            height={35}
                            style={{width: '35px', height: '35px'}}
                        />
                        <div className="ml-2">
                            {tournament.discord_invite ? (
                                <a
                                    href={`https://discord.gg/${tournament.discord_invite}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    Join Discord
                                </a>
                            ) : (
                                <p>
                                    Not provided
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Status of the tournament */}
                <div className="w-full p-5">
                    <h2 className="mb-2 text-lg">
                        Status
                    </h2>
                    <p className="font-bold">
                        LIVE
                    </p>
                </div>
            </div>

            {/* a lot of this is placeholder for now */}
            {/* Events */}
            <div className="p-4 sm:p-6 lg:p-8 mt-2">
                <div className="pb-4 border-b-2 border-b-gray-300 mb-5">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                        Tournament Events
                    </h1>
                    <h2 className="text-sm sm:text-base mt-1">
                        Select an event below to view its details
                    </h2>
                </div>

                {/* All events container */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border border-gray-300">
                            <div
                                className="relative bg-gray-800 py-12 sm:py-16 lg:py-20 text-center text-3xl sm:text-4xl lg:text-5xl text-white">
                                IMG
                                <div
                                    className="absolute text-white left-3 bottom-3 sm:left-5 sm:bottom-5 bg-gray-900 px-2 py-1 sm:p-2 font-semibold text-xs sm:text-sm"
                                >
                                    Game Name
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 lg:p-8">

                                {/* Event Name, Platform, Date, and Time */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div>
                                        <p className="text-xl sm:text-2xl font-bold">
                                            Event Name
                                        </p>
                                        <p className="text-sm">
                                            Platform
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="font-bold text-sm sm:text-base">
                                            Date
                                        </p>
                                        <p className="text-sm sm:text-base">
                                            Time
                                        </p>
                                    </div>
                                </div>

                                {/* Event Information */}
                                <div
                                    className="grid grid-cols-1 xs:grid-cols-2 mt-3 border-y-2 border-y-gray-300 py-4 gap-y-3">
                                    <div>
                                        <h3 className="text-sm sm:text-base">
                                            Entry Fee
                                        </h3>
                                        <p className="font-bold text-sm sm:text-base">
                                            $20
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm sm:text-base">
                                            Team Size
                                        </h3>
                                        <p className="font-bold text-sm sm:text-base">
                                            Squads (4)
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm sm:text-base">
                                            Registered
                                        </h3>
                                        <p className="font-bold text-sm sm:text-base">
                                            16/20 Teams
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm sm:text-base">
                                            Bracket Type
                                        </h3>
                                        <p className="font-bold text-sm sm:text-base">
                                            Single Elimination
                                        </p>
                                    </div>
                                </div>

                                {/* Event Details Button */}

                                <button
                                    className="place-self-center mt-4 bg-primary w-full text-center text-white
                                    p-2.5 sm:p-3 hover:bg-secondary hover:cursor-pointer transition duration-250
                                    text-sm sm:text-base"
                                >
                                    View Details
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}