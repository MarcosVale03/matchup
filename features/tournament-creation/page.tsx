'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertTournament, TournamentInsertErrors } from '@/server/mutations/tournaments.mutations';
import { dateToInputString } from "@/lib/utils";
import { ArrowRight, X } from 'lucide-react';

const getDefaultFutureDate = (hours: number = 2) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    d.setMinutes(Math.floor(d.getMinutes() / 5) * 5);
    return d;
};

// Initial state for the form
interface FormState {
    name: string;
    slug: string;
    startTime: Date;
    endTime: Date;
    isOnline: boolean;
    email: string;
    discord: string;
    // Location is simplified for the form input
    locationAddress: string;
}

const initialFormState: FormState = {
    name: '',
    slug: '',
    startTime: new Date(),
    endTime: getDefaultFutureDate(2),
    isOnline: true,
    email: '',
    discord: '',
    locationAddress: '',
};

export default function TournamentInsertForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [fieldErrors, setFieldErrors] = useState<TournamentInsertErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Placeholder for location data (we would integrate Google Maps API here)
    // For now, we only use the address input
    const mockLocationData = {
        maps_place_id: 'mock_place_id',
        address: formData.locationAddress,
        latitude: 34.0522, // Mock data for LA
        longitude: -118.2437, // Mock data for LA
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

        const startTimeArg = new Date(formData.startTime);
        const endTimeArg = new Date(formData.endTime);

        try {
            /**
             * @todo Incorporate isPublic parameter into form
             */
            const response = await insertTournament(
                formData.name,
                startTimeArg,
                endTimeArg,
                formData.isOnline,
                { email: formData.email.trim() || undefined, discord: formData.discord.trim() || undefined },
                true,
                slugArg,
                locationArg
            );

            if (response.success) {
                alert(`Tournament "${formData.name}" created successfully!`);
                // Redirect to the new tournament's detail page
                // will change this to push to create events page
                router.push("/tournaments");
            } else {
                setFieldErrors(response.fieldErrors || {});
                setFormError(response.formErrors?.join(' ') || 'Validation failed. Check the fields above.');
            }
        } catch (error: unknown) {
            setFormError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to display errors for specific fields
    const ErrorMessage = ({ field }: { field: keyof TournamentInsertErrors }) => {
        const errors = fieldErrors[field];
        return errors ? (
            <div className="text-red-500 text-sm mt-2 flex">
                <X size={18} />
                {errors.map((msg, i) => <p key={i}>{field !== "name" ? msg : "Tournament name should be longer than 3 characters"}</p>)}
            </div>
        ) : null;
    };

    // general classNames used in most of the inputs on this page
    const pageLabelClass = "block text-sm font-medium text-gray-700 w-full"
    const pageInputClass = "mt-1 block w-full rounded border border-gray-200 shadow-sm p-2 hover:shadow-md focus:outline-primary text-gray-500"

    return (
        <div className="mt-6 sm:mt-10 w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl font-[Poppins]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Create a New Tournament
                </h1>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-md rounded-lg p-4 sm:p-6 lg:p-8 max-h-[calc(100vh-200px)] sm:max-h-[70vh] overflow-y-auto">
                    {/* Error Message */}
                    {formError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded mb-4 text-sm sm:text-base" role="alert">
                            {formError}
                        </div>
                    )}

                    <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">
                        Basic Information
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
                                <ErrorMessage field='name' />
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
                                <ErrorMessage field='slug' />
                            </div>

                            {/* Start Time */}
                            <div>
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Start Time *"
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
                                    inputClassName={pageInputClass}
                                />
                                <ErrorMessage field='times' />
                            </div>

                            {/* End Time */}
                            <div>
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="End Time *"
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
                                />
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
                                className="h-4 w-4 accent-primary flex-shrink-0"
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
                                <ErrorMessage field='location' />
                            </>
                        )}
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
                        <ErrorMessage field='contact' />
                    </fieldset>

                    {/* Submit Button */}
                    <div className="pt-4 sm:pt-6 mt-4 border-t border-t-gray-300">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium 
                                       text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 
                                       focus:ring-primary disabled:opacity-50 transition-colors"
                        >
                            <span>{isSubmitting ? 'Going to events...' : 'Create events for this tournament'}</span>
                            <ArrowRight size={18} className='flex-shrink-0' />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

