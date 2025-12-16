'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertTournament, TournamentInsertErrors } from '@/server/mutations/tournaments.mutations';

const dateToInputString = (date: Date) => date.toISOString().substring(0, 16);

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
                locationArg as any // Cast as 'any' temporarily until location type is finalized
            );

            if (response.success) {
                alert(`Tournament "${formData.name}" created successfully!`);
                // Redirect to the new tournament's detail page
                router.push("/tournaments");
            } else {
                setFieldErrors(response.fieldErrors || {});
                setFormError(response.formErrors?.join(' ') || 'Validation failed. Check the fields above.');
            }
        } catch (error: any) {
            console.error("Insertion Error:", error);
            setFormError(error.message || 'An unexpected error occurred on the server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-10">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border p-10 max-h-[90vh] overflow-y-auto">
                <h2 className="text-3xl font-bold text-[#BD2D2D] mb-6 text-center pb-3">Create New Tournament</h2>

                {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <p>{formError}</p>
                    </div>
                )}

                {/* General Details */}
                <fieldset className="space-y-4 mb-6">
                    <legend className="text-xl font-semibold mb-3 text-[#BD2D2D]">Basic Information</legend>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder='Enter tournament name'
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-gray-500"
                        />
                        {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name[0]}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (Optional, for URL)</label>
                        <input
                            type="text"
                            name="slug"
                            id="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="e.g., mytourney2025"
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-gray-500"
                        />
                        {fieldErrors.slug && <p className="text-sm text-red-500 mt-1">{fieldErrors.slug[0]}</p>}
                    </div>

                    {/* Start Time */}
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time *</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            id="startTime"
                            value={dateToInputString(formData.startTime)}
                            onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value) })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-gray-500"
                        />
                        {fieldErrors.times && <p className="text-sm text-red-500 mt-1">{fieldErrors.times[0]}</p>}
                    </div>

                    {/* End Time */}
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time *</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            id="endTime"
                            value={dateToInputString(formData.endTime)}
                            onChange={(e) => setFormData({ ...formData, endTime: new Date(e.target.value) })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-gray-500"
                        />
                    </div>
                </fieldset>

                {/* Type and Location */}
                <fieldset className="space-y-4 mb-6 p-4 border rounded-md">
                    <legend className="text-xl font-semibold mb-3 text-[#BD2D2D]">Location Type</legend>

                    {/* isOnline Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isOnline"
                            id="isOnline"
                            checked={formData.isOnline}
                            onChange={handleChange}
                            className="h-4 w-4 border-gray-300 rounded"
                        />
                        <label htmlFor="isOnline" className="ml-2 block text-sm font-medium text-gray-700">
                            Is this an Online Tournament?
                        </label>
                    </div>

                    {/* Location Address (Appears only if offline) */}
                    {!formData.isOnline && (
                        <div className="pt-2">
                            <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700">Physical Location Address *</label>
                            <input
                                type="text"
                                name="locationAddress"
                                id="locationAddress"
                                value={formData.locationAddress}
                                onChange={handleChange}
                                required={!formData.isOnline}
                                placeholder="e.g., 123 Main St, Anytown"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {fieldErrors.location && <p className="text-sm text-red-500 mt-1">{fieldErrors.location[0]}</p>}
                        </div>
                    )}
                </fieldset>

                {/* Contact Information */}
                <fieldset className="space-y-4 mb-6">
                    <legend className="text-xl font-semibold mb-3 text-[#BD2D2D]">Contact Information (At least one required)</legend>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-black"
                        />
                        {fieldErrors.contact && <p className="text-sm text-red-500 mt-1">{fieldErrors.contact[0]}</p>}
                    </div>

                    {/* Discord */}
                    <div>
                        <label htmlFor="discord" className="block text-sm font-medium text-gray-700">Discord Link (Optional)</label>
                        <input
                            type="text"
                            name="discord"
                            id="discord"
                            value={formData.discord}
                            onChange={handleChange}
                            placeholder="e.g., https://discord.gg/xxxxxxxx"
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-black"
                        />
                    </div>
                </fieldset>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#BD2D2D] hover:bg-[#992323] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2D2D] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Tournament'}
                    </button>
                </div>
            </form>
        </div>

    );
}