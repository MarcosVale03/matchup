'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {insertEvent, EventInsertErrors} from '@/server/mutations/events.mutations';
import {fetchPlatformsFromVideoGame} from '@/server/queries/video_games.queries';
import {dateToInputString} from '@/lib/utils';
import {ArrowRight, Check, Plus} from 'lucide-react';
import {FormSection} from '@/ui/form-section';
import {SegmentedToggle} from '@/ui/segmented-toggle';
import {ErrorMessageForEvent} from '@/features/tournament-events/error-message-event';
import {GameAutocomplete} from '@/features/tournament-events/game-autocomplete';

interface CreatedEvent {
    id: number;
    name: string;
    videoGame: string;
    platform: string;
}

interface FormState {
    name: string;
    startTime: Date;
    endTime: Date;
    price: string;
    videoGame: string;
    platform: string;
    teamsAllowed: boolean;
    maxTeamSize: string;
}

export default function EventInsertForm({
    tournamentId,
    tournamentName,
    tournamentStart,
    tournamentEnd,
}: {
    tournamentId: number;
    tournamentName: string;
    tournamentStart: string;
    tournamentEnd: string;
}) {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement | null>(null);

    const [formData, setFormData] = useState<FormState>(() => ({
        name: '',
        startTime: new Date(tournamentStart),
        endTime: new Date(tournamentEnd),
        price: '0',
        videoGame: '',
        platform: '',
        teamsAllowed: false,
        maxTeamSize: '',
    }));
    const [fieldErrors, setFieldErrors] = useState<EventInsertErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);

    const [platforms, setPlatforms] = useState<string[]>([]);
    const [platformsLoading, setPlatformsLoading] = useState(false);
    const platformRequestRef = useRef(0);

    const loadPlatformsFor = async (gameName: string) => {
        const requestId = ++platformRequestRef.current;
        setPlatformsLoading(true);
        try {
            const rows = await fetchPlatformsFromVideoGame(gameName);
            if (requestId !== platformRequestRef.current) return;
            setPlatforms(rows.map((r) => r.gaming_platform_name));
        } catch {
            if (requestId !== platformRequestRef.current) return;
            setPlatforms([]);
        } finally {
            if (requestId === platformRequestRef.current) {
                setPlatformsLoading(false);
            }
        }
    };

    const handleGameTyping = (name: string) => {
        platformRequestRef.current++;
        setFormData((prev) => ({...prev, videoGame: name, platform: ''}));
        setPlatforms([]);
    };

    const handleGameSelect = async (name: string) => {
        setFormData((prev) => ({...prev, videoGame: name, platform: ''}));
        await loadPlatformsFor(name);
    };

    const handleSubmit = async ({andFinish}: { andFinish: boolean }) => {
        setIsSubmitting(true);
        setFieldErrors({});
        setFormError(null);

        const priceNum = Number(formData.price);
        const teamSizeNum = formData.maxTeamSize.trim() ? Number(formData.maxTeamSize) : undefined;

        try {
            const response = await insertEvent(
                tournamentId,
                formData.name,
                formData.startTime,
                formData.endTime,
                priceNum,
                formData.videoGame.trim(),
                formData.platform.trim(),
                formData.teamsAllowed,
                teamSizeNum
            );

            if (response.success && response.data !== undefined) {
                const newEvent: CreatedEvent = {
                    id: response.data,
                    name: formData.name,
                    videoGame: formData.videoGame,
                    platform: formData.platform,
                };
                setCreatedEvents((prev) => [...prev, newEvent]);

                if (andFinish) {
                    router.push(`/tournaments/${tournamentId}?created=1`);
                    return;
                }

                // Reset fields
                setFormData((prev) => ({
                    ...prev,
                    name: '',
                    videoGame: '',
                    platform: '',
                    price: '0',
                }));
                platformRequestRef.current++;
                setPlatforms([]);
                // Return focus to the first field so the next event can be
                // typed without a click.
                document.getElementById('name')?.focus();
            } else {
                setFieldErrors(response.fieldErrors || {});
                setFormError(
                    response.formErrors?.join(' ') || 'Validation failed. Check the fields above.'
                );
            }
        } catch (err) {
            setFormError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit({andFinish: false});
    };

    const onFinishClick = () => {
        if (!formRef.current?.reportValidity()) return;
        handleSubmit({andFinish: true});
    };

    const handleDone = () => {
        router.push(`/tournaments/${tournamentId}?created=1`);
    };

    const pageLabelClass = 'block text-zinc-600 peer-focus:text-primary transition duration-400 tracking-tight';
    const pageInputClass = `peer block bg-white w-full rounded-xl border-2 border-white
                            text-black p-2 focus:outline-none focus:border-primary shadow-sm
                            transition duration-400 font-normal tracking-tight`;

    return (
        <div
            className="mt-4 mx-4 flex-1 flex flex-col sm:mx-auto w-full max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
            <h3>Create Events</h3>

            <h4 className="mb-4 pb-1 text-gray-600 border-b border-gray-300">
                Add events to <span className="text-primary">{tournamentName}</span>
            </h4>

            <div className="flex flex-col lg:flex-row lg:gap-6 lg:items-start">
                {createdEvents.length > 0 && (
                    <aside
                        aria-labelledby="created-events-heading"
                        className="order-first lg:order-last mb-4 lg:mb-0 lg:w-72 lg:shrink-0 lg:sticky lg:top-4
                                   p-4 rounded-xl bg-white border-2 border-gray-200"
                    >
                        <h5 id="created-events-heading" className="mb-2 tracking-tight">
                            Events created so far ({createdEvents.length})
                        </h5>
                        <ul className="flex flex-col gap-1.5">
                            {createdEvents.map((event) => (
                                <li
                                    key={event.id}
                                    className="flex flex-wrap items-center gap-x-2 gap-y-0.5
                                               text-sm md:text-base text-gray-700 font-poppins"
                                >
                                    <Check size={16} className="shrink-0 text-primary"/>
                                    <span className="font-jersey text-base md:text-lg text-primary">{event.name}</span>
                                    <span className="text-gray-600 tracking-tight text-xs md:text-sm">
                                        {event.videoGame} · {event.platform}
                                    </span>

                                </li>
                            ))}
                        </ul>
                    </aside>
                )}

                <form
                    ref={formRef}
                    onSubmit={onFormSubmit}
                    className="mb-6 flex-1 min-w-0 flex flex-col"
                >
                    {formError && (
                        <div
                            role="alert"
                            className="bg-errors/20 text-sm lg:text-base px-3 py-2 rounded-xl mb-4 text-primary
                                   font-poppins font-semibold"
                        >
                            {formError}
                        </div>
                    )}

                    {/* Basic Details */}
                    <FormSection title="Basic Details">
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Event Name - Required"
                                inputType="text"
                                inputName="name"
                                inputId="name"
                                inputValue={formData.name}
                                inputOnChange={(e) =>
                                    setFormData((prev) => ({...prev, name: e.target.value}))
                                }
                                required={true}
                                inputPlaceholder="e.g., Singles Open, Pro Bracket"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForEvent field="name" fieldErrors={fieldErrors}/>
                        </div>
                    </FormSection>

                    {/* Schedule */}
                    <FormSection title="Schedule">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Start Date - Required"
                                    inputType="datetime-local"
                                    inputName="startTime"
                                    inputId="startTime"
                                    inputValue={dateToInputString(formData.startTime)}
                                    inputOnChange={(e) => {
                                        if (!e.target.validity.valid) return;
                                        const next = new Date(e.target.value);
                                        setFormData((prev) => ({...prev, startTime: next}));
                                    }}
                                    required={true}
                                    inputPlaceholder=""
                                    inputClassName={`${pageInputClass} appearance-none`}
                                    maxDateTime="9999-12-31T23:59"
                                />
                            </div>

                            <div>
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="End Date - Required"
                                    inputType="datetime-local"
                                    inputName="endTime"
                                    inputId="endTime"
                                    inputValue={dateToInputString(formData.endTime)}
                                    inputOnChange={(e) => {
                                        if (!e.target.validity.valid) return;
                                        const next = new Date(e.target.value);
                                        setFormData((prev) => ({...prev, endTime: next}));
                                    }}
                                    required={true}
                                    inputPlaceholder=""
                                    inputClassName={pageInputClass}
                                    maxDateTime="9999-12-31T23:59"
                                />
                                <ErrorMessageForEvent field="times" fieldErrors={fieldErrors}/>
                            </div>
                        </div>
                    </FormSection>

                    {/* Game & Platform */}
                    <FormSection title="Game & Platform">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <GameAutocomplete
                                    value={formData.videoGame}
                                    onChange={handleGameTyping}
                                    onSelect={handleGameSelect}
                                    inputId="videoGame"
                                    labelText="Video Game - Required"
                                    labelClassName={pageLabelClass}
                                    inputClassName={pageInputClass}
                                    required
                                    placeholder="Start typing a game name…"
                                />
                                <ErrorMessageForEvent
                                    field="game_and_platform"
                                    fieldErrors={fieldErrors}
                                />
                            </div>

                            <div>
                                <div className="rounded-xl flex flex-col-reverse">
                                    <select
                                        name="platform"
                                        id="platform"
                                        value={formData.platform}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setFormData((prev) => ({...prev, platform: v}));
                                        }}
                                        required
                                        disabled={!formData.videoGame.trim() || platformsLoading}
                                        className={`${pageInputClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    >
                                        <option value="">
                                            {!formData.videoGame.trim()
                                                ? 'Select a game first'
                                                : platformsLoading
                                                    ? 'Loading platforms…'
                                                    : platforms.length === 0
                                                        ? 'No platforms found'
                                                        : 'Choose a platform'}
                                        </option>
                                        {platforms.map((p) => (
                                            <option key={p} value={p} className="hover:bg-primary cursor-pointer">
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="platform" className={pageLabelClass}>
                                        Gaming Platform - Required
                                    </label>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Entry Fee */}
                    <FormSection title="Entry Fee">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Entry Fee (USD) - Required"
                                    inputType="number"
                                    inputName="price"
                                    inputId="price"
                                    inputValue={formData.price}
                                    inputOnChange={(e) =>
                                        setFormData((prev) => ({...prev, price: e.target.value}))
                                    }
                                    required={true}
                                    inputPlaceholder="0"
                                    inputClassName={pageInputClass}
                                    min={0}
                                />
                                <ErrorMessageForEvent field="price" fieldErrors={fieldErrors}/>
                            </div>
                        </div>
                    </FormSection>

                    {/* Team Configuration */}
                    <FormSection title="Team Configuration">
                        <SegmentedToggle
                            ariaLabel="Event format"
                            value={formData.teamsAllowed}
                            onChange={(v) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    teamsAllowed: v,
                                    maxTeamSize: v ? prev.maxTeamSize : '',
                                }))
                            }
                            options={[
                                {value: false, label: 'Solo'},
                                {value: true, label: 'Teams'},
                            ]}
                        />

                        <div
                            className={`grid transition-all duration-500 mt-3
                            ${formData.teamsAllowed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            aria-hidden={!formData.teamsAllowed}
                        >
                            <div className="overflow-hidden">
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Max Team Size - Required"
                                    inputType="number"
                                    inputName="maxTeamSize"
                                    inputId="maxTeamSize"
                                    inputValue={formData.maxTeamSize}
                                    inputOnChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            maxTeamSize: e.target.value,
                                        }))
                                    }
                                    required={formData.teamsAllowed}
                                    inputPlaceholder="e.g., 5"
                                    inputClassName={`${pageInputClass} mb-1`}
                                    tabIndex={formData.teamsAllowed ? 0 : -1}
                                    min={1}
                                />
                                <ErrorMessageForEvent field="max_team_size" fieldErrors={fieldErrors}/>
                            </div>
                        </div>
                    </FormSection>

                    {/* Action buttons */}
                    <div className="border-t border-gray-300 pt-3 pb-3 mt-6 -mx-4 px-4 sm:mx-0 sm:px-0
                                flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                            type="button"
                            onClick={handleDone}
                            disabled={isSubmitting || createdEvents.length === 0}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md text-base md:text-xl font-jersey tracking-tight
                                   text-gray-600 hover:text-primary hover:bg-gray-100 disabled:opacity-40
                                   disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            <Check size={18} className="shrink-0"/>
                            Finish
                        </button>

                        <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4
                                       rounded-md text-base md:text-lg lg:text-xl font-jersey
                                       text-primary bg-white border-2 border-primary hover:bg-gray-200
                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <Plus size={18} className="shrink-0"/>
                                {isSubmitting ? 'Saving...' : 'Save & Add Another'}
                            </button>
                            <button
                                type="button"
                                onClick={onFinishClick}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4
                                       rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey
                                       text-white bg-primary hover:bg-secondary disabled:opacity-50
                                       disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {isSubmitting ? 'Saving...' : 'Save & Finish'}
                                <ArrowRight size={18} className="shrink-0"/>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
