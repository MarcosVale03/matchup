'use client';
import { FetchTournamentFromIdResponse, FetchTournamentParticipantsResponse } from "@/server/queries/tournaments.queries";
import { getTimeUntilStart } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {Mail, Globe, Cog, UserPlus} from "lucide-react";
import Image from "next/image";
import { FetchEventsFromTournamentIdResponse } from "@/server/queries/events.queries";
import EventList from "@/features/tournament-events/event-list";
import { formatDate } from "date-fns";

function InfoCells({ tournament }: { tournament: FetchTournamentFromIdResponse }) {

    const infoCellContainerClass = `flex flex-col border-b-2 border-b-secondary 
    lg:border-b-0 lg:border-r-2 lg:border-r-secondary 
    w-full p-4 place-content-center`

    return (
        <div className="bg-primary text-white flex flex-col lg:flex-row tracking-wide wrap-break-word text-lg lg:text-2xl">
            {/* Visibility */}
            <div className={infoCellContainerClass}>
                <h2 className="mb-1 text-base lg:text-lg font-jersey">
                    Visibility
                </h2>
                <div className="flex flex-row items-center">
                    <Globe size={22} />
                    <div className="ml-2 text-sm md:text-base font-poppins font-semibold tracking-normal">
                        <p>{tournament.is_public ? "PUBLIC" : "PRIVATE"}</p>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className={infoCellContainerClass}>
                <h2 className="mb-1 text-base lg:text-lg font-jersey">
                    Contact
                </h2>
                <div className="flex flex-row items-center">
                    <Mail size={22} />
                    <div className="ml-2 text-sm md:text-base font-poppins font-semibold tracking-normal">
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
                <h2 className="mb-1 text-base lg:text-lg font-jersey">
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
                    <div className="ml-2 text-sm md:text-base font-poppins font-semibold tracking-normal">
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
                <h2 className="mb-1 text-base lg:text-lg font-jersey">
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
                            className={`flex items-center w-fit gap-2 px-2 py-1 font-poppins font-semibold text-sm rounded-lg ${colorClass}`}>
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
    hasPermissions,
    eventsSuccess,
    participants,
    isUserParticipant,
}: {
    tournament: FetchTournamentFromIdResponse;
    events?: FetchEventsFromTournamentIdResponse;
    hasPermissions: boolean;
    eventsSuccess: boolean;
    participants: FetchTournamentParticipantsResponse;
    isUserParticipant: boolean;
}) {
    const router = useRouter();

    const handleAdminClick = () => router.push(`/admin/tournaments/${tournament.id}/`);
    const handleRegClick = () => router.push(`/tournaments/${tournament.id}/register`);

    return (
        <div className="flex flex-row text-black">
            {/* Left side, tournament information and events  */}
            <div className="w-full border-r border-gray-300">

                {/* Container for tournament name, edit/delete button, owner, and start/end time */}
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Tournament Name and Edit */}
                    <div
                        className="flex flex-col lg:flex-row items-start lg:items-center gap-3 mb-2 lg:gap-0 justify-between">

                        {/* Tournament Name */}
                        <h1 className="text-2xl lg:text-4xl font-jersey break-all min-w-0 flex-1"
                            title={tournament.name}
                        >
                            {tournament.name}
                        </h1>

                        <div className="flex gap-4 tracking-wide shrink-0">
                            {hasPermissions && <button
                                onClick={handleAdminClick}
                                className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                            >
                                <Cog className="size-5" />
                                Admin
                            </button>}
                            {!isUserParticipant && (
                                <button
                                    onClick={handleRegClick}
                                    className="flex items-center justify-center gap-2 p-2 px-4 lg:mt-0
                                           rounded-md shadow-sm text-sm md:text-lg font-jersey
                                           text-white bg-primary hover:bg-secondary cursor-pointer
                                           disabled:opacity-50 transition-colors duration-200"
                                >
                                    <UserPlus className="size-5" />
                                    Register
                                </button>
                            )}

                        </div>
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
                                    <h5 className="">
                                        Organized by
                                    </h5>
                                    <p className="truncate min-w-0 text-sm md:text-base lg:text-lg">
                                        {tournament.owner.display_name}
                                    </p>
                                </div>
                            </div>
                        </div>


                        {/* Start date */}
                        <div className="w-full p-2">
                            <h5 className="">
                                Starts
                            </h5>
                            <div className="flex flex-row">
                                <p className="truncate min-w-0 font-poppins text-sm md:text-base lg:text-lg">
                                    {formatDate(tournament.start_time, "MMM d, yyyy @ h:mm a")}
                                </p>
                            </div>
                        </div>

                        {/* End date */}
                        <div className="w-full p-2">
                            <h5 className="">
                                Ends
                            </h5>
                            <div className="flex flex-row">
                                <p className="truncate min-w-0 font-poppins text-sm md:text-base lg:text-lg">
                                    {formatDate(tournament.end_time, "MMM d, yyyy @ h:mm a")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info cells | visibility, contact, discord, status */}
                <InfoCells tournament={tournament} />

                {eventsSuccess && (
                    <EventList events={events} amountRegistered={participants.length} />
                )}
            </div>

            {/* Right side, participants list */}
            <aside className="hidden lg:block w-72 shrink-0 p-5 self-start max-h-screen overflow-y-auto">
                <div className="flex items-baseline justify-between mb-3">
                    <h1 className="text-2xl lg:text-3xl text-primary">
                        Participants
                    </h1>
                    <span className="text-sm text-gray-500 font-semibold tabular-nums">
                        {participants.length}
                    </span>
                </div>

                {participants.length === 0 ? (
                    <p className="text-sm text-gray-500">No participants yet.</p>
                ) : (
                    <ul className="flex flex-col gap-1.5 pr-1">
                        {participants.map((p) => (
                            <li
                                key={p.user_id}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50
                                           border border-gray-100 hover:bg-gray-100 transition-colors
                                           text-black"
                            >
                                <Image
                                    src="/random-pfp.png"
                                    alt=""
                                    width={32}
                                    height={32}
                                    className="rounded-full shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1 min-w-0">
                                        {p.prefix && (
                                            <span className="text-xs font-bold opacity-70 shrink-0">
                                                {p.prefix}
                                            </span>
                                        )}
                                        <p className="truncate text-sm font-semibold">
                                            {p.display_name}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {p.event_count} {p.event_count === 1 ? "event" : "events"}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>
        </div>
    );
}