'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertTournament, TournamentInsertErrors } from '@/server/mutations/tournaments.mutations';
import { dateToInputString } from "@/lib/utils";
import { ArrowRight } from 'lucide-react';
import { ErrorMessageForTournament } from "@/features/tournament-crud/error-message-tournament";
import { FormSection } from '@/ui/form-section';
import { SegmentedToggle } from '@/ui/segmented-toggle';

interface FormState {
    name: string;
    slug: string;
    startTime: Date;
    endTime: Date;
    isOnline: boolean;
    email: string;
    discord: string;
    isPublic: boolean;
    locationAddress: string;
}

export default function TournamentInsertForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormState>(() => ({
        name: '',
        slug: '',
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isOnline: true,
        email: '',
        discord: '',
        isPublic: true,
        locationAddress: '',
    }));
    const [fieldErrors, setFieldErrors] = useState<TournamentInsertErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Placeholder until Google Maps
    const mockLocationData = {
        maps_place_id: 'mock_place_id',
        address: formData.locationAddress,
        latitude: 34.0522,
        longitude: -118.2437,
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({});
        setFormError(null);

        const locationArg = formData.isOnline ? undefined : mockLocationData;
        const slugArg = formData.slug.trim() || undefined;

        try {
            const response = await insertTournament(
                formData.name,
                formData.startTime,
                formData.endTime,
                formData.isOnline,
                { email: formData.email.trim() || undefined, discord: formData.discord.trim() || undefined },
                formData.isPublic,
                slugArg,
                locationArg
            );

            if (response.success) {
                // Send the organizer to the event-creation page next. The
                // "tournament created" toast fires after they finish adding
                // events (or skip).
                router.push(`/tournaments/${response.data}/events/create`);
            } else {
                setFieldErrors(response.fieldErrors || {});
                setFormError(response.formErrors?.join(' ') || 'Validation failed. Check the fields above.');
            }
        } catch (err) {
            setFormError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const pageLabelClass = "block text-zinc-600 peer-focus:text-primary transition duration-400 tracking-tight";
    const pageInputClass = `peer block bg-white w-full rounded-xl border-2 border-white
                            text-black p-2 focus:outline-none focus:border-primary shadow-sm 
                            transition duration-400 font-normal tracking-tight`;

    return (
        <div className="mt-4 mx-4 flex-1 flex flex-col sm:mx-auto w-full max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
            <h3>Create Tournament</h3>

            <h4 className="mb-4 pb-1 text-gray-600 border-b border-gray-300">
                Fill in the details below to create your tournament
            </h4>

            <form onSubmit={handleSubmit} className="mb-6 flex-1 flex flex-col">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Tournament Name - Required"
                                inputType='text'
                                inputName="name"
                                inputId="name"
                                inputValue={formData.name}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder="More than 3 characters"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='name' fieldErrors={fieldErrors} />
                        </div>

                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Slug - Optional, for URL"
                                inputType="text"
                                inputName="slug"
                                inputId="slug"
                                inputValue={formData.slug}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder="More than 3 characters"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='slug' fieldErrors={fieldErrors} />
                        </div>
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
                                    setFormData({ ...formData, startTime: new Date(e.target.value) });
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
                                    setFormData({ ...formData, endTime: new Date(e.target.value) });
                                }}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                                maxDateTime="9999-12-31T23:59"
                            />
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </FormSection>

                {/* Location */}
                <FormSection title="Location">
                    <SegmentedToggle
                        ariaLabel="Tournament location type"
                        value={formData.isOnline}
                        onChange={(v) => setFormData({ ...formData, isOnline: v })}
                        options={[
                            { value: true, label: "Online" },
                            { value: false, label: "In-Person" },
                        ]}
                    />

                    <div
                        className={`grid transition-all duration-500 mt-3
                            ${!formData.isOnline ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        aria-hidden={formData.isOnline}
                    >
                        <div className="overflow-hidden">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Physical Location Address - Required"
                                inputType="text"
                                inputName="locationAddress"
                                inputId="locationAddress"
                                inputValue={formData.locationAddress}
                                inputOnChange={handleChange}
                                required={!formData.isOnline}
                                inputPlaceholder="e.g., 123 Main St, Anytown"
                                inputClassName={`${pageInputClass} mb-1`}
                                tabIndex={formData.isOnline ? -1 : 0}
                            />
                            <ErrorMessageForTournament field='location' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </FormSection>

                {/* Visibility */}
                <FormSection title="Visibility">
                    <SegmentedToggle
                        ariaLabel="Tournament visibility"
                        value={formData.isPublic}
                        onChange={(v) => setFormData({ ...formData, isPublic: v })}
                        options={[
                            { value: true, label: "Public" },
                            { value: false, label: "Private" },
                        ]}
                    />
                    <p className="mt-2 text-xs text-gray-600 tracking-tight">
                        {formData.isPublic
                            ? "Anyone can find and view this tournament."
                            : "Only people you invite can view this tournament."}
                    </p>
                </FormSection>

                {/* Contact */}
                <FormSection title="Contact — at least one required">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText='Email'
                            inputType='email'
                            inputName='email'
                            inputId='email'
                            inputValue={formData.email}
                            inputOnChange={handleChange}
                            required={false}
                            inputPlaceholder='organizer@example.com'
                            inputClassName={pageInputClass}
                        />
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText='Discord Invite'
                            inputType='text'
                            inputName='discord'
                            inputId='discord'
                            inputValue={formData.discord}
                            inputOnChange={handleChange}
                            required={false}
                            inputPlaceholder='https://discord.gg/xxxxxxxx'
                            inputClassName={pageInputClass}
                        />
                    </div>
                    <ErrorMessageForTournament field='contact' fieldErrors={fieldErrors} />
                </FormSection>

                {/* Submit button */}
                <div className="border-t border-gray-300 pt-3 pb-3 mt-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Creating...' : 'Create events for this tournament'}
                        <ArrowRight size={16} className='shrink-0' />
                    </button>
                </div>
            </form>
        </div>
    );
}
