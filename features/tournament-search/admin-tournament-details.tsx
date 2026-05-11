'use client';
import { FetchTournamentFromIdResponse } from "@/server/queries/tournaments.queries";
import { getTimeUntilStart } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {Mail, Pencil, Globe, Trash, User, CalendarPlus, ArrowUpDown, Megaphone} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { deleteTournament } from "@/server/mutations/tournaments.mutations";
import { ConfirmButton } from "@/ui/confirm-button";
import { FetchEventsFromTournamentIdResponse } from "@/server/queries/events.queries";
import EventList from "@/features/tournament-events/admin-event-list";
import { formatDate } from "date-fns";


function InfoCells({ tournament }: { tournament: FetchTournamentFromIdResponse }) {

    const infoCellContainerClass = `flex flex-col border-b-2 border-b-secondary 
    lg:border-b-0 lg:border-r-2 lg:border-r-secondary 
    w-full p-4 place-content-center`

    return (
        <div className="bg-primary text-white flex flex-col lg:flex-row tracking-wide wrap-break-word text-lg lg:text-2xl">
            {/* Visibility */}
            <div className={infoCellContainerClass}>
                <h2 className="mb-1 text-base lg:text-lg font-jersey-25">
                    Visibility
                </h2>
                <div className="flex flex-row items-center">
                    <Globe size={22} />
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
                    <Mail size={22} />
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
                        style={{ width: '22px', height: '22px' }}
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
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                </span>
                            )}
                            {ended ? "Ended" : started ? "LIVE" : getTimeUntilStart(new Date(tournament.start_time), new Date(tournament.end_time))}
                        </div>
                    );
                })()}
            </div>
        </div>
    )
}

export function TournamentDetails({
    tournament,
    events,
    hasPermissions
}: {
    tournament: FetchTournamentFromIdResponse;
    events?: FetchEventsFromTournamentIdResponse;
    hasPermissions: boolean;
}) {
    const router = useRouter();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleEditClick = () => router.push(`/admin/tournaments/${tournament.id}/edit`);

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

    const handleViewClick = () => router.push(`/tournaments/${tournament.id}`)
    const handleAddEventClick = () => router.push(`/admin/tournaments/${tournament.id}/events/create`)
    const handleSeedingClick = () => router.push(`/admin/tournaments/${tournament.id}/seeding`)
    const handleReportingClick = () => router.push(`/admin/tournaments/${tournament.id}/reporting`)

    return (
        <div className="flex flex-row">
            {/* Left side, tournament information and events  */}
            <div className="w-full border-x-2 border-gray-300">

                {/* Container for tournament name, edit/delete button, owner, and start/end time */}
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Tournament Name and Edit */}
                    <div
                        className="flex flex-col lg:flex-row items-start lg:items-center gap-3 mb-2 lg:gap-0 justify-between">

                        {/* Tournament Name */}
                        <h1 className="text-2xl lg:text-4xl font-jersey-25 break-all min-w-0 flex-1"
                            title={tournament.name}
                        >
                            {tournament.name}
                        </h1>

                        {/* Shows edit/delete option if user has permissions */}
                        {hasPermissions && (
                            <div className="flex gap-4 tracking-wide shrink-0">
                                <button
                                    onClick={handleEditClick}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <Pencil className="size-5" />
                                    Edit
                                </button>

                                {/* Will throw an error if an event is tied to the tournament */}
                                {/*<button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <Trash className="size-5" />
                                    Delete
                                </button>*/}
                                <button
                                    onClick={() => handleAddEventClick()}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <CalendarPlus className="size-5" />
                                    Add Event
                                </button>
                                <button
                                    onClick={() => handleSeedingClick()}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <ArrowUpDown className="size-5" />
                                    Seeding
                                </button>
                                <button
                                    onClick={() => handleReportingClick()}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <Megaphone className="size-5" />
                                    Reporting
                                </button>
                                <button
                                    onClick={() => handleViewClick()}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey-25
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <User className="size-5" />
                                    View as User
                                </button>
                            </div>
                        )}
                    </div>

                    {/* organizer, start/end time*/}
                    <div className="flex flex-col sm:flex-row">

                        {/* Tournament Organizer */}
                        <div className="w-full p-2">
                            <div className="flex flex-row items-center min-w-0 ">
                                <Image
                                    src="/random-pfp.png"
                                    alt="pfp"
                                    width={50}
                                    height={50}
                                    className="rounded-full mr-2"
                                />
                                <div>
                                    <h2 className="font-jersey-25 text-lg">
                                        Organized by
                                    </h2>
                                    <p className="truncate min-w-0 text-sm md:text-base lg:text-lg">
                                        {tournament.owner.display_name}
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* Start date */}
                        <div className="w-full p-2">
                            <h2 className="font-jersey-25 text-lg">
                                Starts
                            </h2>
                            <div className="flex flex-row">
                                <p className="truncate min-w-0 font-[Poppins] text-sm md:text-base lg:text-lg">
                                    {formatDate(tournament.start_time, "MMM d, yyyy @ h:mm a")}
                                </p>
                            </div>
                        </div>

                        {/* End date */}
                        <div className="w-full p-2">
                            <h2 className="font-jersey-25 text-lg">
                                Ends
                            </h2>
                            <div className="flex flex-row">
                                <p className="truncate min-w-0 font-[Poppins] text-sm md:text-base lg:text-lg">
                                    {formatDate(tournament.end_time, "MMM d, yyyy @ h:mm a")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info cells | visibility, contact, discord, status */}
                <InfoCells tournament={tournament} />

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

                <EventList events={events} />
            </div>

            {/* RIght side, participants list */}
            <div className="p-5 mx-5">
                <h1 className="text-2xl lg:text-4xl text-primary font-jersey-25 min-w-0 flex-1">
                    Participants
                </h1>
            </div>
        </div>
    );
}