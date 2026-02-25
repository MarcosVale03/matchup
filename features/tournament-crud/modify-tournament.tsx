'use client';
import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTournament, TournamentUpdateErrors } from '@/server/mutations/tournaments.mutations';
import { ArrowLeft, Save } from 'lucide-react';
import { FetchTournamentFromIdResponse } from "@/server/queries/tournaments.queries";
import { toDateTimeLocalInput } from '@/ui/format-time';
import { ErrorMessage } from "@/ui/error-message";

export default function TournamentEditForm({initialData}: { initialData: FetchTournamentFromIdResponse }) {
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
        const {name, value, type, checked} = e.target;
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
    const pageLabelClass = "block text-sm font-medium text-gray-700 w-full"
    const pageInputClass = "mt-1 block w-full rounded border border-gray-200 shadow-sm p-2 hover:shadow-md focus:outline-primary text-gray-500"

    return (
        <div className="mt-6 sm:mt-10 w-full px-4 sm:px-6 lg:px-8 sm:mx-8 md:mx-16 font-[Poppins]">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 border-b border-gray-300 pb-2">
                Updating Tournament: <span className="text-primary">{formData.name}</span>
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                {/* Error Message */}
                {formError && (
                    <div
                        role="alert"
                        className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 
                                   rounded mb-4 text-sm sm:text-base"
                    >
                        {formError}
                    </div>
                )}

                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:flex justify-between">
                    <p>
                        Tournament ID: <span className="text-primary">{formData.id}</span>
                    </p>
                </h2>

                {/* General Details */}
                <fieldset className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Name *"
                                inputType='text'
                                inputName="name"
                                inputId="name"
                                inputValue={formData.name}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder="Enter tournament name"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessage field='name' fieldErrors={fieldErrors}/>
                        </div>

                        {/* Slug */}
                        <div className="md:col-span-2">
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
                            <ErrorMessage field='slug' fieldErrors={fieldErrors}/>
                        </div>

                        {/* Start Time */}
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Start Time *"
                                inputType="datetime-local"
                                inputName="startTime"
                                inputId="startTime"
                                inputValue={formData.startTime}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessage field='times' fieldErrors={fieldErrors}/>
                        </div>

                        {/* End Time */}
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="End Time *"
                                inputType="datetime-local"
                                inputName="endTime"
                                inputId="endTime"
                                inputValue={formData.endTime}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessage field='times' fieldErrors={fieldErrors}/>
                        </div>
                    </div>
                </fieldset>

                {/* Type and Location */}
                <fieldset className="space-y-4 p-4 sm:p-5 border rounded-md mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-primary">
                        Location Type
                    </h2>

                    {/* isOnline Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isOnline"
                            id="isOnline"
                            checked={formData.isOnline}
                            onChange={handleChange}
                            className="h-4 w-4 accent-primary shrink-0"
                        />
                        <label htmlFor="isOnline" className="ml-2 block text-sm font-medium text-gray-700">
                            Online tournament?
                        </label>
                    </div>

                    {/* Location Address (Appears only if offline) */}
                    {!formData.isOnline && (
                        <>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Physical Location Address *"
                                inputType="text"
                                inputName="locationAddress"
                                inputId="locationAddress"
                                inputValue={formData.locationAddress}
                                inputOnChange={handleChange}
                                required={!formData.isOnline}
                                inputPlaceholder="e.g., 123 Main St, Anytown"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessage field='location' fieldErrors={fieldErrors}/>
                        </>
                    )}
                </fieldset>

                {/* Tournament Visibility */}
                <fieldset className="space-y-4 p-4 sm:p-5 border rounded-md mb-6 w-full">
                    <h2 className="text-lg sm:text-xl font-semibold text-primary">
                        Tournament Visibility
                    </h2>

                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="tournament-private"
                            name="visibility"
                            value="private"
                            className="h-4 w-4 accent-primary shrink-0"
                            onChange={handleChange}
                            onClick={() => setFormData({...formData, isPublic: false})}
                        />
                        <label
                            htmlFor="tournament-private"
                            className="ml-2 text-sm font-medium text-gray-700"
                        >
                            Private
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="tournament-public"
                            name="visibility"
                            value="public"
                            className="h-4 w-4 accent-primary shrink-0"
                            onChange={handleChange}
                            onClick={() => setFormData({...formData, isPublic: true})}
                        />
                        <label
                            htmlFor="tournament-public"
                            className="ml-2 text-sm font-medium text-gray-700"
                        >
                            Public
                        </label>
                    </div>
                </fieldset>

                {/* Contact Information */}
                <fieldset className="space-y-4 p-4 sm:p-5 border rounded-md mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
                        Contact Information (At least one required)
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div>
                            <BasicInputWithLabel
                                labelClassName='block text-sm font-medium text-gray-700'
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
                        <div>
                            <BasicInputWithLabel
                                labelClassName='block text-sm font-medium text-gray-700'
                                labelText='Discord Link (Optional)'
                                inputType='text'
                                inputName='discord'
                                inputId='discord'
                                inputValue={formData.discord}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder='e.g., https://discord.gg/xxxxxxxx'
                                inputClassName={pageInputClass}
                            />
                        </div>
                    </div>
                    <ErrorMessage field='contact' fieldErrors={fieldErrors}/>
                </fieldset>

                {/* Back/Submit Button */}
                <div className="pt-4 sm:pt-6 mt-4 border-t border-t-gray-300 flex gap-2 ">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium 
                                       text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 
                                       focus:ring-primary disabled:opacity-50 transition-colors"
                    >
                        <ArrowLeft className="size-8 sm:size-4"/>
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
                        <Save className="size-6 sm:size-4"/>
                    </button>
                </div>
            </form>
        </div>
    );
}

