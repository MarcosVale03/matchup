'use client';
import {FetchTournamentFromIdResponse} from "@/server/queries/tournaments.queries";
import {formatDateTime} from "@/ui/format-time";
import {getTimeUntilStart} from "@/lib/utils/time-until-start";
import {useRouter} from "next/navigation";
import {Mail, Pencil, Globe, Trash} from "lucide-react";
import Image from "next/image";
import React, {useState} from "react";
import {deleteTournament} from "@/server/mutations/tournaments.mutations";
import {ConfirmButton} from "@/ui/confirm-button";

export type TournamentPermissions = {
    canEdit: boolean;
    canDelete: boolean;
};

export function TournamentDetails({
                                      tournament,
                                      permissions
                                  }: {
    tournament: FetchTournamentFromIdResponse;
    permissions: TournamentPermissions;
}) {
    const router = useRouter();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleEditClick = () => router.push(`/tournaments/${tournament.id}/edit`);

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            const response = await deleteTournament(tournament.id);
            if (response.success) {
                await new Promise(resolve => setTimeout(resolve, 800));
                router.push('/tournaments');
            } else {
                setIsDeleting(false);
                setDeleteError("Failed to delete the tournament. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            setDeleteError("An unexpected error occurred.");
        }
    };

    // info cell container style
    const infoCellContainerClass = `flex flex-col border-b-2 border-b-secondary 
                                    lg:border-b-0 lg:border-r-2 lg:border-r-secondary 
                                    w-full p-4 place-content-center`

    return (
        <div className="overflow-y-auto text-black">

            {/* Container for tournament name, edit/delete button, owner, and start/end time */}
            <div className="p-4 sm:p-8 pt-6 sm:pt-10">
                {/* Tournament Name and Edit */}
                <div
                    className="flex flex-col lg:flex-row items-start lg:items-center mb-2 gap-3 lg:gap-0 justify-between">

                    {/* Tournament Name */}
                    <h1 className="text-2xl lg:text-4xl text-primary font-jersey-25 break-all min-w-0 flex-1" title={tournament.name}>
                        {tournament.name}
                    </h1>

                    {/* Shows edit/delete option if user has permissions */}
                    {permissions.canEdit && (
                        <div className="flex gap-4 tracking-wide shrink-0">
                            <button
                                onClick={handleEditClick}
                                className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                            >
                                <Pencil className="size-5"/>
                                Edit
                            </button>

                            {/* Will throw an error if an event is tied to the tournament */}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                            >
                                <Trash className="size-5"/>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* organizer, start/end time*/}
                <div className="flex flex-col sm:flex-row">
                    {/* Tournament Organizer */}
                    <div className="w-full p-2 text-base md:text-lg lg:text-xl font-jersey-25">
                        <h2>
                            Organizer
                        </h2>
                        <div className="flex flex-row items-center min-w-0 ">
                            <Image
                                src="/random-pfp.png"
                                alt="pfp"
                                width={35}
                                height={35}
                                className="rounded-full mr-2"
                            />
                            <p className="truncate min-w-0 font-[Poppins] text-sm md:text-base lg:text-lg">
                                {tournament.owner.display_name}
                            </p>
                        </div>
                    </div>

                    {/* Start date */}
                    <div className="w-full p-2 text-base md:text-lg lg:text-xl font-jersey-25">
                        <h2>
                            Starts
                        </h2>
                        <div className="flex flex-row">
                            <p className="truncate min-w-0 font-[Poppins] text-sm md:text-base lg:text-lg">
                                {formatDateTime(tournament.start_time)}
                            </p>
                        </div>
                    </div>

                    {/* End date */}
                    <div className="w-full p-2 text-base md:text-lg lg:text-xl font-jersey-25">
                        <h2>
                            Ends
                        </h2>
                        <div className="flex flex-row">
                            <p className="truncate min-w-0 font-[Poppins] text-sm md:text-base lg:text-lg">
                                {formatDateTime(tournament.end_time)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info cells | visibility, contact, discord, status */}
            <div className="bg-primary text-white flex flex-col lg:flex-row tracking-wide break-words text-lg lg:text-2xl">
                {/* Visibility */}
                <div className={infoCellContainerClass}>
                    <h2 className="mb-1 text-base lg:text-lg font-jersey-25">
                        Visibility
                    </h2>
                    <div className="flex flex-row items-center">
                        <Globe size={22}/>
                        <div className="ml-2 text-sm md:text-base font-[Poppins] font-semibold tracking-normal">
                            <p>{tournament.is_public ? "PUBLIC" : "PRIVATE"}</p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className={infoCellContainerClass}>
                    <h2 className="mb-1 text-base lg:text-lg font-jersey-25">
                        Contact
                    </h2>
                    <div className="flex flex-row items-center">
                        <Mail size={22}/>
                        <div className="ml-2 text-sm md:text-base font-[Poppins] font-semibold tracking-normal">
                            {/* if not discord, show not provided */}
                            {tournament.email_contact ? (
                                <p>{tournament.email_contact}</p>
                            ) :
                                <p>Not provided</p>
                            }
                        </div>
                    </div>
                </div>

                {/* Discord */}
                <div className={infoCellContainerClass}>
                    <h2 className="mb-1 text-base lg:text-lg font-jersey-25">
                        Community
                    </h2>
                    <div className="flex flex-row items-center">
                        <Image
                            src='/Discord-Symbol-White.svg'
                            alt='Discord Symbol'
                            width={22}
                            height={22}
                            style={{width: '22px', height: '22px'}}
                        />
                        <div className="ml-2 text-sm md:text-base font-[Poppins] font-semibold tracking-normal">
                            {/* if not discord, show not provided */}
                            {tournament.discord_invite ? (
                                <a
                                    href={`https://discord.gg/${tournament.discord_invite}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    Join
                                </a>
                            ) : <p>
                                Not provided
                            </p>
                            }
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col w-full p-4 place-content-center">
                    <h2 className="mb-1 text-base lg:text-lg font-jersey-25">
                        Status
                    </h2>
                    {/* Badges */}
                    {(() => {
                        const now = new Date();
                        const started = new Date(tournament.start_time) <= now;
                        const ended = new Date(tournament.end_time) <= now;

                        const colorClass = ended
                            ? "bg-zinc-600 text-zinc-300 tracking-tight"
                            : started
                                ? "bg-zinc-800 text-white"
                                : "bg-zinc-600 text-white";

                        return (
                            <div
                                className={`flex items-center w-fit gap-2 px-2 py-1 font-[Poppins] font-semibold text-sm rounded-lg ${colorClass}`}>
                                {started && !ended && (
                                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                                        <span
                                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"/>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"/>
                                    </span>
                                )}
                                {ended ? "Ended" : started ? "LIVE" : getTimeUntilStart(new Date(tournament.start_time), new Date(tournament.end_time))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Delete modal */}
            <ConfirmButton
                isOpen={showDeleteModal}
                title={`Delete "${tournament.name}"`}
                message="This action cannot be undone. All events and registrations associated with this tournament will be permanently deleted."
                isSubmitting={isDeleting}
                error={deleteError ?? ''}
                onConfirm={handleDeleteConfirm}
                onCancelForm={() => {
                    setShowDeleteModal(false);
                    setDeleteError(null);
                }}
            />

            {/* Events */}
            {/* a lot of this is placeholder for now */}
            <div className="p-4 sm:p-6 lg:p-8 mt-2">
                <div className="pb-3 border-b-2 border-zinc-600 mb-4">
                    <h1 className="text-xl lg:text-3xl wrap-break-word font-jersey-25">
                        Tournament Events
                    </h1>
                    <h2 className="text-sm lg:text-base font-[Poppins] font-semibold text-gray-600">
                        Select an event below to view its details
                    </h2>
                </div>

                {/* All events container */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5">

                    {/* Making 4 event placeholders for now */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-md shadow-lg">

                            {/* Image container */}
                            <div
                                className="relative bg-black py-12 sm:py-16 lg:py-25 text-center text-primary rounded-t-md">
                                {/* image goes here */}
                                <p className="text-lg lg:text-2xl text-white">
                                    [Game Image]
                                </p>

                                {/* Game name in the bottom left corner of image */}
                                <div
                                    className="absolute text-white left-3 bottom-3 sm:left-5 sm:bottom-5
                                    bg-zinc-600 rounded-lg px-2 py-1 sm:p-2 text-sm lg:text-base font-jersey-25"
                                >
                                    Game Name
                                </div>
                            </div>

                            {/* Event details container */}
                            <div className="p-3 sm:p-4 bg-card-input text-black rounded-b-md">

                                {/* Event Name, Platform, Date, and Time */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <div>
                                        <p className="text-base lg:text-xl font-jersey-25">
                                            Event Name
                                        </p>
                                        <p className="text-sm lg:text-sm font-[Poppins] tracking-tight">
                                            Platform
                                        </p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="text-base lg:text-xl font-jersey-25">
                                            Date
                                        </p>
                                        <p className="text-sm lg:text-sm font-[Poppins] tracking-tight">
                                            Time
                                        </p>
                                    </div>
                                </div>

                                {/* Event Information */}
                                <div
                                    className="grid grid-cols-1 xs:grid-cols-2 mt-3 border-y-2 border-y-gray-300 py-4 gap-y-3">

                                    {/* Entry Fee */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey-25 tracking-wide">
                                            Entry Fee
                                        </h3>
                                        <p className="text-sm lg:text-md font-[Poppins] tracking-tight">
                                            $20
                                        </p>
                                    </div>

                                    {/* Team size */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey-25 tracking-wide">
                                            Team Size
                                        </h3>
                                        <p className="text-sm font-[Poppins] tracking-tight">
                                            Squads (4)
                                        </p>
                                    </div>

                                    {/* Amount of teams registered out of maximum allowed */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey-25 tracking-wide">
                                            Registered
                                        </h3>
                                        <p className="text-sm font-[Poppins] tracking-tight">
                                            16/20 Teams
                                        </p>
                                    </div>

                                    {/* Bracket type */}
                                    <div>
                                        <h3 className="text-sm lg:text-base font-jersey-25 tracking-wide">
                                            Bracket Type
                                        </h3>
                                        <p className="text-sm font-[Poppins] tracking-tight">
                                            Single Elimination
                                        </p>
                                    </div>
                                </div>

                                {/* Event Details Button */}
                                <button
                                    className="flex items-center justify-center gap-2 p-2 px-4 mt-4
                                               rounded-md shadow-sm text-sm md:text-base lg:text-lg
                                               font-jersey-25 text-white bg-primary hover:bg-secondary
                                               cursor-pointer disabled:opacity-50 transition-colors duration-200 w-full"
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