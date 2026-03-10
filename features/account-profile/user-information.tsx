'use client'

import Image from "next/image";
import { CircleUser, Calendar, MapPin, Clock, ChevronRight, Trophy, Pencil } from "lucide-react";
import { formatDateTime } from "@/ui/format-time";
import { FutureTournamentsResponse, PastTournamentsResponse, User } from "@/server/queries/profile.queries";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";

// tournament cards that appear for future and past tournaments
function EventCard({
    tournamentName,
    organizerName,
    startTime,
    endTime,
    onClickTournament,
}: {
    tournamentName: string;
    organizerName: string;
    startTime?: string;
    endTime?: string;
    onClickTournament?: MouseEventHandler<HTMLDivElement> | undefined
}) {

    return (
        <div
            className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-gray-200 rounded-xl
            hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={onClickTournament}
        >
            {/* Tournament icon / thumbnail placeholder */}
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy size={20} className="text-primary"/>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">

                {/* Tournament name */}
                <h3 className="font-bold text-primary truncate text-sm sm:text-base">
                    {tournamentName}
                </h3>

                {/* Organizer */}
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Image
                        src="/globe.svg"
                        alt="Organizer PFP"
                        className="w-4 h-4 shrink-0"
                        width={50}
                        height={50}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 font-semibold truncate">
                        {organizerName}
                    </p>
                </div>

                {/* Start time for mobile */}
                {startTime && (
                    <p className="text-xs text-gray-500 mt-0.5 sm:hidden">
                        Starts: <span className="font-semibold text-gray-700">{formatDateTime(startTime)}</span>
                    </p>
                )}

                {/* End time for mobile */}
                {endTime && (
                    <p className="text-xs text-gray-500 mt-0.5 sm:hidden">
                        Ended: <span className="font-semibold text-gray-700">{formatDateTime(endTime)}</span>
                    </p>
                )}
            </div>

            {/* For Desktop */}
            {startTime && (
                <div className="hidden sm:block shrink-0 text-right">
                    <p className="text-sm text-gray-700">
                        Starts: <span className="font-semibold">{formatDateTime(startTime)}</span>
                    </p>
                </div>
            )}

            {/* For Desktop */}
            {endTime && !startTime && (
                <div className="hidden sm:block shrink-0 text-right">
                    <p className="text-sm text-gray-700">
                        Ended: <span className="font-semibold">{formatDateTime(endTime)}</span>
                    </p>
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
        <main className="bg-white flex flex-col min-h-screen font-[Poppins]">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 mx-auto w-full max-w-4xl">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">

                    {/* Subtle header band */}
                    <div className="h-24 sm:h-40 bg-primary/20"/>

                    <div className="px-4 sm:px-8 pb-5 sm:pb-8">
                        {/* Avatar + Name Row */}
                        <div className="flex flex-col -mt-10 sm:-mt-12 gap-3 sm:gap-4">
                            <div className="bg-white rounded-full flex w-fit border border-black">
                                <CircleUser
                                    size={80}
                                    strokeWidth={1}
                                    className="text-primary sm:w-[88px] sm:h-[88px]"
                                />
                            </div>

                            <div className="flex-1 sm:pb-1">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <div className="flex gap-2 items-center min-w-0">
                                        {/* Profile tag */}
                                        {profile?.prefix && (
                                            <span className="text-base sm:text-lg text-primary/50 font-semibold shrink-0">
                                                {profile.prefix}
                                            </span>
                                        )}

                                        {/* Profile display name */}
                                        <h1 className="text-xl sm:text-3xl font-bold text-primary truncate">
                                            {profile?.display_name}
                                        </h1>
                                    </div>

                                    {/* Button to edit profile */}
                                    <button
                                        className="shrink-0 bg-primary text-white py-1.5 px-3 rounded-lg text-sm
                                        font-medium hover:bg-red-800 transition-colors duration-150
                                        disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Pencil size={14}/>
                                        Edit Profile
                                    </button>
                                </div>

                                {/* Meta info -> Name, time joined, and location (placeholder) */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs sm:text-sm text-gray-500">
                                    <span className="font-medium text-primary/80">
                                        {profile?.first_name} {profile?.last_name}
                                    </span>
                                    <span className="hidden sm:inline text-gray-800">·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12}/>
                                        Joined {formatDateTime(profile?.time_joined)}
                                    </span>
                                    <span className="hidden sm:inline text-gray-800">·</span>
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
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={18}/>
                            Upcoming Events
                        </h2>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {futureTournaments.length} {futureTournaments.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>
                    {/* Tournament card with details */}
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
                            <p className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                No upcoming events — join a tournament!
                            </p>
                        )}
                    </div>
                </section>

                {/* Past Events */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Calendar size={18}/>
                            Past Events
                        </h2>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            {pastTournaments?.length} {pastTournaments?.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>

                    {/* Tournament card with details */}
                    <div className="flex flex-col gap-3">
                        {pastTournaments.length > 0 ? (
                            pastTournaments.map((tournament) => (
                                <EventCard
                                    key={tournament.tournament_id}
                                    tournamentName={tournament.tournaments.name}
                                    organizerName={tournament.tournaments.users.display_name}
                                    // endTime={tournament.end_time}
                                    onClickTournament={() => router.push(`/tournaments/${tournament.tournament_id}`)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                No past events yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}