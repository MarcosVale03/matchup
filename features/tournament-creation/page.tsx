'use client';

import React, { useState } from 'react';
import BasicInputWithLabel from '@/ui/basic-input-with-label';
import { useRouter } from 'next/navigation';
import { insertTournament, TournamentInsertErrors } from '@/server/mutations/tournaments.mutations';
import { dateToInputString } from "@/lib/utils";

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
            const response = await insertTournament(
                formData.name,
                startTimeArg,
                endTimeArg,
                formData.isOnline,
                { email: formData.email.trim() || undefined, discord: formData.discord.trim() || undefined },
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

    // general classNames used in most of the inputs on this page
    const pageLabelClass = "block text-sm font-medium text-gray-700"
    const pageInputClass = "mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-primary focus:ring-primary text-gray-500"

    return (
        <div className="mt-10 place-content-center">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border p-10 max-h-[90vh] max-w-[95vw] overflow-y-auto">
                {/* Error Message */}
                {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2" role="alert">
                        <p>
                            {formError}
                        </p>
                    </div>
                )}

                <h1 className="text-3xl font-bold text-gray-800 text-center p-2 mb-2">
                    Create a New Tournament
                </h1>

                {/* General Details */}
                <fieldset className="space-y-4 mb-6 place-self-center w-full md:grid md:grid-cols-2 md:gap-x-3 md:mb-0">

                    <h2 className="text-xl font-semibold text-primary col-span-2">
                        Basic Information
                    </h2>

                    {/* Name */}
                    <div>
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
                        {fieldErrors.name && <p className="text-sm text-red-500 mt-1">
                            {fieldErrors.name[0]}
                        </p>}
                    </div>


                    {/* Slug */}
                    <div>
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
                        {fieldErrors.slug && <p className="text-sm text-red-500 mt-1">
                            {fieldErrors.slug[0]}
                        </p>}
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
                        {fieldErrors.times && <p className="text-sm text-red-500 mt-1">
                            {fieldErrors.times[0]}
                        </p>}
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
                </fieldset>

                {/* Type and Location */}
                <fieldset className="space-y-4 mb-6 p-4 border rounded-md md:mb-0">
                    <h1 className="text-xl font-semibold mb-3 text-primary">
                        Location Type
                    </h1>

                    {/* isOnline Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isOnline"
                            id="isOnline"
                            checked={formData.isOnline}
                            onChange={handleChange}
                            className="h-4 w-4 accent-primary"
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
                            {fieldErrors.location && <p className="text-sm text-red-500 mt-1">
                                {fieldErrors.location[0]}
                            </p>}
                        </>
                    )}
                </fieldset>

                {/* Contact Information */}
                <fieldset className="space-y-4 p-4 my-4 border rounded md:grid md:grid-rows-1 md:grid-cols-2 md:gap-x-3 md:mb-0">
                    <h1 className="text-xl font-semibold mb-3 text-primary md:col-span-2 md:self-end">
                        Contact Information (At least one required)
                    </h1>

                    {/* Email */}
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

                    {/* Discord */}
                    <BasicInputWithLabel
                        labelClassName='block text-sm font-medium text-gray-700'
                        labelText='Discord Link (Optional)'
                        inputType='email'
                        inputName='discord'
                        inputId='discord'
                        inputValue={formData.discord}
                        inputOnChange={handleChange}
                        required={false}
                        inputPlaceholder='e.g., https://discord.gg/xxxxxxxx'
                        inputClassName={pageInputClass}
                    />
                    {fieldErrors.contact && <p className="text-sm text-red-500 mt-1">
                        {fieldErrors.contact[0]}
                    </p>}
                </fieldset>

                {/* Submit Button */}
                <div className="pt-6 mt-4 border-t">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                                   text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 
                                   focus:ring-primary disabled:opacity-50 mb-4"
                    >
                        {isSubmitting ? 'Going to events...' : 'Create events for this tournament'}
                    </button>
                </div>


            </form>
        </div>
    );
}