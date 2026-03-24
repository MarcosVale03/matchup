'use client'

import Image from "next/image";
import {CircleUser, Calendar, MapPin, Clock, ChevronRight, Trophy, Pencil} from "lucide-react";
import {FutureTournamentsResponse, PastTournamentsResponse, User} from "@/server/queries/profile.queries";
import {MouseEventHandler} from "react";
import {useRouter} from "next/navigation";
import {formatDate} from "date-fns";

// for placements
function getOrdinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// tournament cards that appear for future and past tournaments
function EventCard({
    tournamentName,
    organizerName,
    startTime,
    endTime,
    onClickTournament,
    placement,
}: {
    tournamentName: string;
    organizerName: string;
    startTime?: string;
    endTime?: string;
    onClickTournament?: MouseEventHandler<HTMLDivElement> | undefined;
    placement?: number | null
}) {

    return (
        <div
            className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-gray-200 rounded-xl
                     hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={onClickTournament}
        >
            {/* Tournament icon / thumbnail placeholder */}
            <div
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy size={20} className="text-primary"/>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">

                {/* Tournament name */}
                <h3 className="font-jersey-25 text-primary truncate text-base sm:text-lg">
                    {tournamentName}
                </h3>

                {/* Organizer */}
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Image
                        src="/random-pfp.png"
                        alt="random pfp"
                        className="w-5 h-5 shrink-0 rounded-full"
                        width={65}
                        height={65}
                    />
                    <p className="text-xs sm:text-sm text-black font-semibold truncate">
                        {organizerName}
                    </p>
                </div>

                {/* Start time for mobile */}
                {startTime && (
                    <p className="text-xs text-gray-500 mt-0.5 sm:hidden">
                        Starts: <span className="font-semibold text-gray-700">{formatDate(startTime, "MMM d, yyyy @ h:mm a")}</span>
                    </p>
                )}

                {/* End time for mobile */}
                {endTime && (
                    <p className="text-xs text-gray-500 mt-0.5 sm:hidden">
                        Ended: <span className="font-semibold text-gray-700">{formatDate(endTime, "MMM d, yyyy @ h:mm a")}</span>
                    </p>
                )}

                {/* Placement for mobile */}
                {placement && (
                    <p className="text-xs text-gray-500 mt-0.5 sm:hidden">
                        Placed: <span className="font-semibold text-gray-700">{getOrdinal(placement)}</span>
                    </p>
                )}
            </div>

            {/* For Desktop */}
            {startTime && (
                <div className="hidden sm:block shrink-0 text-right">
                    <p className="text-sm text-gray-700">
                        Starts: <span className="font-semibold">{formatDate(startTime, "MMM d, yyyy @ h:mm a")}</span>
                    </p>
                </div>
            )}

            {/* For Desktop */}
            {endTime && !startTime && (
                <div className="hidden sm:block shrink-0 text-right text-black">
                    <p className="text-sm text-gray-500">
                        Ended: <span className="font-semibold text-gray-700">{formatDate(endTime, "MMM d, yyyy @ h:mm a")}</span>
                    </p>
                    {placement && (
                        <p className="text-sm text-gray-500">
                            Placed: <span className="font-semibold text-gray-700">{getOrdinal(placement)}</span>
                        </p>
                    )}
                </div>
            )}

            {/* Arrow hint */}
            <ChevronRight size={16} className="shrink-0 text-gray-300 group-hover:text-primary transition-colors"/>
        </div>
    );
}

export default function UserInformation({
    profile,
    futureTournaments,
    pastTournaments
}: {
    profile: User;
    futureTournaments: FutureTournamentsResponse;
    pastTournaments: PastTournamentsResponse;
}) {

    const router = useRouter();

    return (
        <main className="bg-zinc-100 flex flex-col min-h-screen font-[Poppins]">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 mx-auto w-full max-w-4xl">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">

                    {/* Header band */}
                    <div className="h-24 sm:h-40 bg-primary/20"/>

                    <div className="px-4 sm:px-8 pb-5 sm:pb-8">
                        <div className="flex flex-col -mt-10 sm:-mt-12 gap-3 sm:gap-4">
                            <div className="bg-white rounded-full flex w-fit border-2 border-white shadow-sm">
                                <CircleUser
                                    size={80}
                                    strokeWidth={1}
                                    className="text-primary sm:w-[88px] sm:h-[88px]"
                                />
                            </div>

                            <div className="flex-1 sm:pb-1">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <div className="flex gap-2 items-center min-w-0">
                                        {profile?.prefix && (
                                            <span
                                                className="text-base sm:text-lg text-primary/50 font-jersey-25 shrink-0">
                                                {profile.prefix}
                                            </span>
                                        )}
                                        <h1 className="text-2xl sm:text-4xl font-jersey-25 text-primary break-words">
                                            {profile?.display_name}
                                        </h1>
                                    </div>

                                    <button className="shrink-0 bg-primary text-white py-1.5 px-3 rounded-lg
                                        text-sm font-jersey-25 hover:bg-secondary transition-colors duration-150
                                        flex items-center gap-2">
                                        <Pencil size={14}/>
                                        Edit Profile
                                    </button>
                                </div>

                                <div
                                    className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs sm:text-sm text-gray-500">
                                    <span className="font-semibold text-gray-700">
                                        {profile?.first_name} {profile?.last_name}
                                    </span>
                                    <span className="hidden sm:inline text-gray-400">·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12}/>
                                        Joined {formatDate(profile?.time_joined, "MMM d, yyyy")}
                                    </span>
                                    <span className="hidden sm:inline text-gray-400">·</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12}/>
                                        Los Angeles, CA
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Events */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-jersey-25 text-gray-800 flex items-center gap-2">
                            <Calendar size={18}/>
                            Upcoming Events
                        </h2>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {futureTournaments.length} {futureTournaments.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {futureTournaments.length > 0 ? (
                            futureTournaments.map((tournament) => (
                                <EventCard
                                    key={tournament.id}
                                    tournamentName={tournament.name}
                                    organizerName={tournament.users?.display_name}
                                    startTime={tournament.start_time}
                                    onClickTournament={() => router.push(`/tournaments/${tournament.id}`)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                                No upcoming events — join a tournament!
                            </p>
                        )}
                    </div>
                </section>

                {/* Past Events */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-jersey-25 text-gray-800 flex items-center gap-2">
                            <Calendar size={18}/>
                            Past Events
                        </h2>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {pastTournaments?.length} {pastTournaments?.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {pastTournaments.length > 0 ? (
                            pastTournaments.map((tournament) => (
                                <EventCard
                                    key={tournament.tournament_id}
                                    tournamentName={tournament.events?.tournaments?.name ?? 'Unknown Tournament'}
                                    organizerName={tournament.events?.tournaments?.users?.display_name ?? 'Unknown'}
                                    onClickTournament={() => router.push(`/tournaments/${tournament.tournament_id}`)}
                                    endTime={tournament.events?.tournaments?.end_time}
                                    placement={tournament.placement}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                                No past events yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}