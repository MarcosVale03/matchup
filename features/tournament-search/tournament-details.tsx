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
        <div className="overflow-y-auto text-white">

            {/* Container for tournament name, edit button, owner, and start/end time */}
            <div className="p-8 pt-4">
                {/* Tournament Name and Edit */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center mb-2 gap-3 lg:gap-0 justify-between">

                    {/* Tournament Name */}
                    <h1 className="text-3xl lg:text-5xl wrap-break-word">
                        {tournament.name}
                    </h1>

                    {/* Shows edit option if user has permissions */}
                    {permissions.canEdit && (
                        <button
                            onClick={handleEditClick}
                            className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                            rounded-md shadow-sm text-md lg:text-xl font-jersey-25 text-white bg-secondary
                            hover:bg-tertiary cursor-pointer disabled:opacity-50 transition-colors duration-200"
                        >
                            <Pencil className="size-5"/>
                            Edit Tournament
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row text-xl lg:text-3xl">
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
                            <p className="truncate min-w-0 font-jersey-25 text-lg lg:text-2xl">
                                {tournament.owner.display_name}
                            </p>
                        </div>
                    </div>

                    {/* Start date */}
                    <div className="flex flex-col w-full p-3">
                        <h2>
                            Starts
                        </h2>
                        <div className="flex flex-row">
                            <p className="truncate min-w-0 font-jersey-25 text-lg lg:text-2xl">
                                {formatDateTime(tournament.start_time)}
                            </p>
                        </div>
                    </div>

                    {/* End date */}
                    <div className="flex flex-col w-full p-3">
                        <h2>
                            Ends
                        </h2>
                        <div className="flex flex-row">
                            <p className="truncate min-w-0 font-jersey-25 text-lg lg:text-2xl">
                                {formatDateTime(tournament.end_time)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-tertiary flex flex-col lg:flex-row tracking-wide wrap-break-word text-lg lg:text-2xl">
                {/* Visibility */}
                <div
                    className="border-b-2 border-b-secondary lg:border-b-0 lg:border-r-2 lg:border-r-secondary
                    w-full p-4 lg:p-5"
                >
                    <h2 className="mb-2">
                        Visibility
                    </h2>
                    <div className="flex flex-row items-center">
                        <div className="mr-2">
                            <Globe size={30}/>
                        </div>
                        <div className="">
                            {tournament.is_public ? (
                                <p className="break-all text-base lg:text-xl font-jersey-25">
                                    PUBLIC
                                </p>
                            ) : (
                                <p className="break-all text-base lg:text-xl font-jersey-25">
                                    PRIVATE
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div
                    className="border-b-2 border-b-secondary lg:border-b-0 lg:border-r-2 lg:border-r-secondary w-full p-5">
                    <h2 className="mb-2">
                        Contact
                    </h2>
                    <div className="flex flex-row items-center">
                        <div className="mr-2">
                            <Mail size={30}/>
                        </div>
                        <div className="text-base lg:text-xl font-jersey-25">
                            <p>
                                {tournament.email_contact}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Discord */}
                <div
                    className="border-b-2 border-b-secondary lg:border-b-0 lg:border-r-2 lg:border-r-secondary w-full p-5">
                    <h2 className="mb-2">
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
                        <div className="ml-2 text-base lg:text-xl font-jersey-25">
                            {tournament.discord_invite ? (
                                <a
                                    href={`https://discord.gg/${tournament.discord_invite}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    Join
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
                    <h2 className="mb-2">
                        Status
                    </h2>
                    <p className="text-base lg:text-xl font-jersey-25">
                        LIVE
                    </p>
                </div>
            </div>

            {/* a lot of this is placeholder for now */}
            {/* Events */}
            <div className="p-4 sm:p-6 lg:p-8 mt-2">
                <div className="pb-4 border-b-2 border-b-tertiary mb-5">
                    <h1 className="text-2xl lg:text-4xl wrap-break-word">
                        Tournament Events
                    </h1>
                    <h2 className="text-base lg:text-xl font-jersey-25">
                        Select an event below to view its details
                    </h2>
                </div>

                {/* All events container */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Making 4 event placeholders for now */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-md shadow-lg">
                            <div
                                className="relative bg-black py-12 sm:py-16 lg:py-25 text-center text-primary rounded-t-md"
                            >
                                {/* image goes here */}
                                <p className="text-lg lg:text-2xl text-white">
                                    [Game Image]
                                </p>

                                {/* Game name in the bottom left corner of image */}
                                <div
                                    className="absolute text-white left-3 bottom-3 sm:left-5 sm:bottom-5
                                    bg-tertiary rounded-lg px-2 py-1 sm:p-2 text-sm lg:text-lg font-jersey-25"
                                >
                                    Game Name
                                </div>
                            </div>
                            <div className="p-4 sm:p-6 lg:p-8 bg-tertiary rounded-b-md">

                                {/* Event Name, Platform, Date, and Time */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div>
                                        <p className="text-lg lg:text-2xl">
                                            Event Name
                                        </p>
                                        <p className="text-sm lg:text-lg font-jersey-25">
                                            Platform
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-lg lg:text-2xl">
                                            Date
                                        </p>
                                        <p className="text-sm lg:text-lg font-jersey-25">
                                            Time
                                        </p>
                                    </div>
                                </div>

                                {/* Event Information */}
                                <div
                                    className="grid grid-cols-1 xs:grid-cols-2 mt-3 border-y-2 border-y-gray-300 py-4 gap-y-3">

                                    {/* Entry Fee */}
                                    <div>
                                        <h3 className="text-md lg:text-xl tracking-wide">
                                            Entry Fee
                                        </h3>
                                        <p className="text-base lg:text-lg font-jersey-25">
                                            $20
                                        </p>
                                    </div>

                                    {/* Team size */}
                                    <div>
                                        <h3 className="text-base lg:text-xl tracking-wide">
                                            Team Size
                                        </h3>
                                        <p className="text-sm lg:text-lg font-jersey-25">
                                            Squads (4)
                                        </p>
                                    </div>

                                    {/* Amount of teams registered out of maximum allowed */}
                                    <div>
                                        <h3 className="text-xl tracking-wide">
                                            Registered
                                        </h3>
                                        <p className="text-sm lg:text-lg font-jersey-25">
                                            16/20 Teams
                                        </p>
                                    </div>

                                    {/* Bracket type */}
                                    <div>
                                        <h3 className="text-xl tracking-wide">
                                            Bracket Type
                                        </h3>
                                        <p className="text-sm lg:text-lg font-jersey-25">
                                            Single Elimination
                                        </p>
                                    </div>
                                </div>

                                {/* Event Details Button */}
                                <button
                                    className="place-self-center mt-4 bg-primary w-full text-center text-white
                                    p-2.5 sm:p-3 hover:bg-secondary hover:cursor-pointer transition duration-250
                                    text-lg lg:text-2xl"
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