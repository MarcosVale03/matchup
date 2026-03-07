'use client'

import { CircleUser, Calendar, MapPin, Clock, ChevronRight, Trophy, Pencil } from "lucide-react";
import { formatDateTime } from "@/ui/format-time";
import Image from "next/image";
import { FutureTournamentsResponse, PastTournamentsResponse, User } from "@/server/queries/profile.queries";

function EventCard({
    tournamentName,
    organizerName,
    startTime

}: {
    tournamentName: string;
    organizerName: string;
    startTime?: string;
}) {
    return (
        <div className="group flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl
                        hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer">
            {/* Tournament icon / thumbnail placeholder */}
            <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy size={22} className="text-primary"/>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <h3 className="font-bold text-primary truncate">
                    {tournamentName}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <Image
                        src="/globe.svg"
                        alt="Organizer PFP"
                        className="w-4 h-4"
                        width={50}
                        height={50}
                    />
                    <p className="text-sm text-gray-500 font-semibold truncate">
                        {organizerName}
                    </p>
                </div>
            </div>
            {startTime && (
                <div className="shrink-0 text-right">
                    <p className="text-sm text-gray-700">
                        Starts: <span className="font-semibold">{formatDateTime(startTime)}</span>
                    </p>
                </div>
            )}

            {/* Arrow hint */}
            <ChevronRight size={18} className="shrink-0 text-gray-300 group-hover:text-primary transition-colors"/>
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

    return (
        <main className="bg-white flex flex-col min-h-screen font-[Poppins]">
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 mx-auto w-full max-w-4xl">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">

                    {/* Subtle header band */}
                    <div className="h-24 sm:h-40 bg-primary/20"/>

                    <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                        {/* Avatar + Name Row */}
                        <div className="flex flex-col -mt-12 gap-4">
                            <div className="bg-white rounded-full flex w-fit border border-black">
                                <CircleUser
                                    size={88}
                                    strokeWidth={1}
                                    className="text-primary"
                                />
                            </div>

                            <div className="flex-1 sm:pb-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                    <div className="flex gap-2">
                                        {profile?.prefix && (
                                            <span
                                                className="text-lg text-primary/50 font-semibold shrink-0 place-self-center">
                                                {profile.prefix}
                                            </span>
                                        )}
                                        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                                            {profile?.display_name}
                                        </h1>
                                    </div>
                                    <button
                                        className="shrink-0 self-start sm:self-auto bg-primary text-white
                                        py-1.5 px-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors
                                        duration-150 disabled:cursor-not-allowed flex gap-2"
                                    >
                                        <Pencil size={15} className="place-self-center"/>
                                        Edit Profile
                                    </button>
                                </div>

                                {/* Meta info */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 text-sm text-gray-500">
                                    <span className="font-medium text-primary/80">
                                        {profile?.first_name} {profile?.last_name}
                                    </span>
                                    <span className="hidden sm:inline text-gray-800">·</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={13}/>
                                        Joined {formatDateTime(profile?.time_joined)}
                                    </span>
                                    <span className="hidden sm:inline text-gray-800">·</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={13}/>
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
                    <div className="flex flex-col gap-3">
                        {futureTournaments.length > 0 ? (
                            futureTournaments.map((tournament) => (
                                <EventCard
                                    key={tournament.id}
                                    tournamentName={tournament.name}
                                    organizerName={tournament.users?.display_name}
                                    startTime={tournament.start_time}
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
                            {pastTournaments.length} {pastTournaments.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {pastTournaments.length > 0 ? (
                            pastTournaments.map((tournament) => (
                                <EventCard
                                    key={tournament.tournament_id}
                                    tournamentName={tournament.tournaments.name}
                                    organizerName={tournament.tournaments.users?.display_name}
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