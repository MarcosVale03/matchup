'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from 'date-fns';
import { CheckSquare, Trophy, Gamepad2, Monitor, CalendarDays, DollarSign, Users, ChevronRight } from 'lucide-react';
import { registerUserForTournament } from '@/server/mutations/registration.mutations';
import { FetchTournamentFromIdResponse } from '@/server/queries/tournaments.queries';
import { FetchEventsFromTournamentIdResponse } from '@/server/queries/events.queries';
import Checkbox from '@/ui/checkbox';

type RegistrationFormProps = {
    tournament: FetchTournamentFromIdResponse;
    events: FetchEventsFromTournamentIdResponse;
    userId: string;
};

export default function RegistrationForm({ tournament, events, userId }: RegistrationFormProps) {
    const router = useRouter();
    const [selectedEventIds, setSelectedEventIds] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const toggleEvent = (eventId: number) => {
        setSelectedEventIds(prev => {
            const next = new Set(prev);
            if (next.has(eventId)) {
                next.delete(eventId);
            } else {
                next.add(eventId);
            }
            return next;
        });
    };

    const totalCost = events
        .filter(e => selectedEventIds.has(e.id))
        .reduce((sum, e) => sum + e.price, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors([]);

        if (selectedEventIds.size === 0) {
            setFormErrors(['Please select at least one event to register for.']);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await registerUserForTournament(
                tournament.id,
                Array.from(selectedEventIds),
                userId
            );

            if (result.success) {
                setSuccess(true);
            } else {
                setFormErrors(result.formErrors ?? ['Registration failed. Please try again.']);
            }
        } catch {
            setFormErrors(['An unexpected error occurred. Please try again.']);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-white rounded-3xl shadow-sm p-10 max-w-md w-full">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-jersey-25 text-primary mb-2">
                        You&apos;re Registered!
                    </h2>
                    <p className="text-zinc-500 text-sm font-[Poppins] mb-6">
                        You&apos;ve successfully registered for <span className="font-semibold text-black">{tournament.name}</span>.
                        Check your profile to view your upcoming tournaments.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => router.push(`/tournaments/${tournament.id}`)}
                            className="bg-primary text-white px-5 py-2 rounded-md font-jersey-25 text-base
                                       hover:bg-secondary transition-colors duration-150"
                        >
                            View Tournament
                        </button>
                        <button
                            onClick={() => router.push('/profile')}
                            className="border-2 border-primary text-primary px-5 py-2 rounded-md font-jersey-25 text-base
                                       hover:bg-primary hover:text-white transition-colors duration-150"
                        >
                            Go to Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center p-4 md:px-8 3xl:px-16">
            {/* Tournament Header */}
            <div className="text-center mb-6 mt-4 w-fit place-self-center px-4">
                <h1 className="text-3xl md:text-4xl 3xl:text-5xl font-jersey-25 tracking-wide font-normal">
                    {tournament.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-0.5 bg-primary" />
                    <p className="text-sm 3xl:text-base text-zinc-500 text-center min-w-0 flex items-center gap-3 flex-wrap justify-center">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 shrink-0" />
                            {formatDate(tournament.start_time, 'MMM d, yyyy')} – {formatDate(tournament.end_time, 'MMM d, yyyy')}
                        </span>
                        <span className="text-zinc-300">·</span>
                        <span className="flex items-center gap-1.5">
                            <Monitor className="size-3.5 shrink-0" />
                            {tournament.is_online ? 'Online' : tournament.locations?.address ?? 'In-Person'}
                        </span>
                        <span className="text-zinc-300">·</span>
                        <span className="flex items-center gap-1.5">
                            <Trophy className="size-3.5 shrink-0" />
                            {events.length} {events.length === 1 ? 'Event' : 'Events'}
                        </span>
                    </p>
                    <div className="flex-1 h-0.5 bg-primary" />
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">

                {/* Left — Event Selection */}
                <div className="flex-1 min-w-0">
                    <div className="pb-3 border-b border-zinc-300 mb-4">
                        <h2 className="text-xl lg:text-3xl font-jersey-25">Select Events</h2>
                        <p className="text-sm text-zinc-500 font-[Poppins]">
                            Choose which events you want to compete in
                        </p>
                    </div>

                    {events.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500 font-[Poppins]">
                            No events have been added to this tournament yet.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {events.map(event => {
                                const isSelected = selectedEventIds.has(event.id);
                                return (
                                    <button
                                        key={event.id}
                                        type="button"
                                        onClick={() => toggleEvent(event.id)}
                                        className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden
                                            ${isSelected
                                                ? 'border-primary shadow-md'
                                                : 'border-transparent shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        {/* Game image banner */}
                                        <div className="relative bg-zinc-800 py-10 sm:py-12 text-center">
                                            <p className="text-sm text-zinc-400 font-[Poppins]">[Game Image]</p>
                                            <div className="absolute left-3 bottom-3 bg-zinc-600 rounded-lg px-2 py-1 text-sm font-jersey-25 text-white">
                                                {event.video_game_name}
                                            </div>
                                            {/* Selected indicator */}
                                            <div className={`absolute right-3 top-3 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                                <div className="bg-primary rounded-full p-1">
                                                    <CheckSquare className="size-4 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event details */}
                                        <div className="bg-white p-3 sm:p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                <div>
                                                    <p className="text-lg lg:text-2xl font-jersey-25 text-primary">
                                                        {event.name}
                                                    </p>
                                                    <p className="text-sm text-zinc-500">
                                                        <span className="font-jersey-25 text-base tracking-normal font-normal">Platform: </span>
                                                        {event.gaming_platform_name}
                                                    </p>
                                                </div>
                                                <div className="sm:text-right shrink-0">
                                                    <p className="text-base lg:text-xl font-jersey-25">Date & Time</p>
                                                    <p className="text-sm font-[Poppins] tracking-tight">
                                                        {formatDate(event.start_time, 'MMM d, yyyy @ h:mm a')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 xs:grid-cols-3 mt-3 border-t-2 border-zinc-200 pt-3 gap-y-3">
                                                <div>
                                                    <p className="text-sm font-jersey-25 tracking-wide">Entry Fee</p>
                                                    <p className="text-sm font-[Poppins] tracking-tight flex items-center gap-1">
                                                        <DollarSign className="size-3.5" />
                                                        {event.price === 0 ? 'Free' : `${event.price.toFixed(2)}`}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-jersey-25 tracking-wide">Format</p>
                                                    <p className="text-sm font-[Poppins] tracking-tight flex items-center gap-1">
                                                        <Users className="size-3.5" />
                                                        {event.teams_allowed
                                                            ? `Teams (${event.max_team_size ? `up to ${event.max_team_size}` : 'any size'})`
                                                            : 'Solo'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-jersey-25 tracking-wide">Game</p>
                                                    <p className="text-sm font-[Poppins] tracking-tight flex items-center gap-1">
                                                        <Gamepad2 className="size-3.5" />
                                                        {event.video_game_name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Checkbox row */}
                                            <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                                                <Checkbox
                                                    id={`event-${event.id}`}
                                                    name={`event-${event.id}`}
                                                    checked={isSelected}
                                                    onChange={() => toggleEvent(event.id)}
                                                    label={isSelected ? 'Selected' : 'Select this event'}
                                                    labelClassName="text-sm font-[Poppins] font-semibold text-zinc-600"
                                                />
                                                <span className={`text-sm font-jersey-25 transition-colors duration-150 ${isSelected ? 'text-primary' : 'text-zinc-400'}`}>
                                                    {isSelected ? 'Registered' : 'Click to select'}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right — Registration Summary */}
                <div className="lg:w-72 xl:w-80 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-4">
                        <h3 className="text-xl font-jersey-25 mb-3 pb-2 border-b border-zinc-200">
                            Registration Summary
                        </h3>

                        {selectedEventIds.size === 0 ? (
                            <p className="text-sm text-zinc-400 font-[Poppins] py-3">
                                No events selected yet.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-2 mb-4">
                                {events
                                    .filter(e => selectedEventIds.has(e.id))
                                    .map(e => (
                                        <li key={e.id} className="flex justify-between items-start gap-2 text-sm font-[Poppins]">
                                            <span className="text-zinc-700 min-w-0 break-words">{e.name}</span>
                                            <span className="shrink-0 font-semibold">
                                                {e.price === 0 ? 'Free' : `$${e.price.toFixed(2)}`}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        )}

                        <div className="border-t border-zinc-200 pt-3 mb-4">
                            <div className="flex justify-between items-center font-[Poppins] font-semibold">
                                <span className="text-zinc-600 text-sm">Total</span>
                                <span className="text-lg font-jersey-25">
                                    {totalCost === 0 ? 'Free' : `$${totalCost.toFixed(2)}`}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">
                                {selectedEventIds.size} of {events.length} {events.length === 1 ? 'event' : 'events'} selected
                            </p>
                        </div>

                        {/* Form errors */}
                        {formErrors.length > 0 && (
                            <div className="mb-4 rounded-lg bg-errors/10 border border-errors px-3 py-2">
                                {formErrors.map((err, i) => (
                                    <p key={i} className="text-errors text-sm font-[Poppins]">{err}</p>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || selectedEventIds.size === 0}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white
                                       px-4 py-2.5 rounded-md font-jersey-25 text-lg
                                       hover:bg-secondary transition-colors duration-150
                                       disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registering...' : 'Register Now'}
                            {!isSubmitting && <ChevronRight className="size-4" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push(`/tournaments/${tournament.id}`)}
                            className="w-full mt-2 text-center text-sm font-[Poppins] text-zinc-400 hover:text-zinc-600 transition-colors duration-150 py-1"
                        >
                            Back to tournament
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
