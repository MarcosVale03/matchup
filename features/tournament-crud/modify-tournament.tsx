'use client';
import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTournament, TournamentUpdateErrors } from '@/server/mutations/tournaments.mutations';
import { ArrowLeft, Save } from 'lucide-react';
import { FetchTournamentFromIdResponse } from "@/server/queries/tournaments.queries";
import { toDateTimeLocalInput } from '@/ui/format-time';
import { ErrorMessageForTournament } from "@/ui/error-message-tournament";
import Checkbox from '@/ui/checkbox';

export default function TournamentEditForm({ initialData }: { initialData: FetchTournamentFromIdResponse }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        id: initialData.id,
        name: initialData.name ?? '',
        slug: initialData.slug ?? '',
        startTime: toDateTimeLocalInput(initialData.start_time),
        endTime: toDateTimeLocalInput(initialData.end_time),
        isOnline: true,  // add is_online to DB later
        isPublic: initialData.is_public,
        email: initialData.email_contact ?? '',
        discord: initialData.discord_invite ?? '',
        locationAddress: 'Los Angeles, CA', // add location later
    });

    const [fieldErrors, setFieldErrors] = useState<TournamentUpdateErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // handler for text, email, datetime-local, checkbox
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // submit handler calls the updateTournament and handles success/error states
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({});
        setFormError(null);

        const response = await updateTournament(
            formData.id,
            formData.name,
            new Date(formData.startTime),
            new Date(formData.endTime),
            formData.isOnline,
            {
                email: formData.email.trim() || undefined,
                discord: formData.discord.trim() || undefined,
            },
            formData.isPublic,
            formData.slug.trim() || undefined,
            formData.isOnline
                ? undefined
                : {
                    // mock location data for now - in real app this would come from an API based on the address
                    maps_place_id: 'mock_place_id',
                    address: formData.locationAddress,
                    latitude: 34.0522,
                    longitude: -118.2437,
                }
        );

        if (response.success) {
            alert(`Tournament "${formData.name}" updated successfully!`);
            router.push(`/tournaments/${formData.id}`);
        } else {
            setFieldErrors(response.fieldErrors || {});
            setFormError(response.formErrors?.join(' ') || 'Validation failed.');
        }

        setIsSubmitting(false);
    };


    // general classNames used in most of the inputs on this page
    const pageLabelClass = "block text-sm lg:text-lg bg-white text-tertiary rounded-md"
    const pageInputClass = `mt-1 block font-jersey-25 bg-white w-full rounded-xl border-2 border-tertiary 
                            text-black text-base lg:text-xl p-3 shadow-md focus:outline-primary`

    return (
        <div className="mt-4 w-full px-4 sm:px-6 lg:px-8 mx-4 text-2xl lg:text-4xl">
            <h1 className="mb-2 border-b-2 border-tertiary font-jersey-25">
                Updating Tournament: {initialData.name}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                {/* Error Message */}
                {formError && (
                    <div
                        role="alert"
                        className="bg-errors border-2 border-errBorder text-lg lg:text-2xl
                        px-3 py-2 sm:px-4 sm:py-3 rounded-xl mb-2 font-jersey-25"
                    >
                        {formError}
                    </div>
                )}

                <h2 className="text-lg lg:text-2xl mb-4 sm:flex justify-between">
                    <p>
                        Tournament ID: <span className="">{formData.id}</span>
                    </p>
                </h2>

                {/* General Details */}
                <fieldset className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="mb-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Tournament Name (Required)"
                                inputType='text'
                                inputName="name"
                                inputId="name"
                                inputValue={formData.name}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder="Enter tournament name"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='name' fieldErrors={fieldErrors} />
                        </div>

                        {/* Slug */}
                        <div className="">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Slug (Optional, for URL)"
                                inputType="text"
                                inputName="slug"
                                inputId="slug"
                                inputValue={formData.slug}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder="e.g., mytourney2025"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='slug' fieldErrors={fieldErrors} />
                        </div>

                        {/* Start Time */}
                        <div className="mb-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Start Time (Required)"
                                inputType="datetime-local"
                                inputName="startTime"
                                inputId="startTime"
                                inputValue={formData.startTime}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors} />
                        </div>

                        {/* End Time */}
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="End Time (Required)"
                                inputType="datetime-local"
                                inputName="endTime"
                                inputId="endTime"
                                inputValue={formData.endTime}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </fieldset>

                {/* Type and Location */}
                <fieldset className="p-2 px-5 bg-tertiary border-2 rounded-2xl mb-6 w-full">
                    <legend className="text-xl lg:text-3xl bg-tertiary rounded-xl px-2">
                        Location Type
                    </legend>

                    {/* isOnline Checkbox */}
                    <Checkbox
                        id="isOnline"
                        name="isOnline"
                        checked={formData.isOnline}
                        onChange={handleChange}
                        label="Online tournament?"
                        boxClassName="group h-5 w-5 rounded-md border-2 border-primary flex items-center
                                        justify-center transition-all duration-200 hover:bg-white"
                        checkedBoxClassName="bg-primary text-black"
                        iconSize={18}
                        iconClassName="group-hover:text-primary text-white"
                        labelClassName="text-2xl font-jersey-25"
                    />


                    {/* Location Address (Appears only if offline) */}
                    <div
                        className={
                            `grid transition-all duration-500 
                            ${!formData.isOnline ?
                                'grid-rows-[1fr] mt-6 opacity-100' :
                                'grid-rows-[0fr] opacity-0'
                            }
                        `}
                    >
                        <div className="p-2 overflow-hidden">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Physical Location Address (Required)"
                                inputType="text"
                                inputName="locationAddress"
                                inputId="locationAddress"
                                inputValue={formData.locationAddress}
                                inputOnChange={handleChange}
                                required={!formData.isOnline}
                                inputPlaceholder="e.g., 123 Main St, Anytown"
                                inputClassName={`${pageInputClass}`}
                            />
                            <ErrorMessageForTournament field='location' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </fieldset>

                {/* Tournament Visibility */}
                <fieldset className="p-4 px-5 bg-tertiary border-2 rounded-2xl mb-6 w-full">
                    <legend className="text-xl lg:text-3xl bg-tertiary rounded-xl px-2 -mb-3">
                        Tournament Visibility
                    </legend>

                    {/* Public */}
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="tournament-public"
                            name="visibility"
                            value="public"
                            checked={formData.isPublic}
                            className="h-4 lg:h-4.5 w-4 lg:w-4.5 accent-primary shrink-0"
                            onChange={() => setFormData({ ...formData, isPublic: true })}
                        />
                        <label
                            htmlFor="tournament-public"
                            className="ml-2 text-lg lg:text-2xl font-jersey-25"
                        >
                            Public
                        </label>
                    </div>

                    {/* Private */}
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="tournament-private"
                            name="visibility"
                            value="private"
                            className="h-4 lg:h-4.5 w-4 lg:w-4.5 accent-primary shrink-0"
                            onChange={() => setFormData({ ...formData, isPublic: false })}
                        />
                        <label
                            htmlFor="tournament-private"
                            className="ml-2 text-lg lg:text-2xl font-jersey-25"
                        >
                            Private
                        </label>
                    </div>
                </fieldset>

                {/* Contact Information */}
                <fieldset className="p-4 px-5 bg-tertiary border-2 rounded-2xl mb-6 w-full">
                    <legend className="text-xl lg:text-3xl bg-tertiary rounded-xl px-2 -mb-3">
                        Contact Information (At least one required)
                    </legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="mt-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText='Email (Optional)'
                                inputType='email'
                                inputName='email'
                                inputId='email'
                                inputValue={formData.email}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder='Enter your email'
                                inputClassName={pageInputClass}
                            />
                        </div>

                        {/* Discord */}
                        <div className="mt-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText='Discord Link (Optional)'
                                inputType='text'
                                inputName='discord'
                                inputId='discord'
                                inputValue={`https://discord.gg/${formData.discord}`}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder='e.g., https://discord.gg/xxxxxxxx'
                                inputClassName={pageInputClass}
                            />
                        </div>
                    </div>
                    <ErrorMessageForTournament field='contact' fieldErrors={fieldErrors} />
                </fieldset>

                {/* Back/Submit Button */}
                <div className="pt-4 sm:pt-6 mt-4 border-t border-t-gray-300 flex gap-2 ">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border 
                        border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium 
                        text-white bg-primary hover:bg-secondary disabled:opacity-50 transition-colors"
                    >
                        <ArrowLeft className="size-8 sm:size-4" />
                        Back to details
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium 
                                       text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 
                                       focus:ring-primary disabled:opacity-50 transition-colors"
                    >
                        <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                        <Save className="size-6 sm:size-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}

