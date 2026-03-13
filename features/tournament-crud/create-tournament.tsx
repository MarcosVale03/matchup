'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertTournament, TournamentInsertErrors } from '@/server/mutations/tournaments.mutations';
import { dateToInputString } from "@/lib/utils";
import { ArrowRight } from 'lucide-react';
import { ErrorMessageForTournament } from "@/ui/error-message-tournament";
import Checkbox from "@/ui/checkbox";

// Initial state for the form
interface FormState {
    name: string;
    slug: string;
    startTime: Date;
    endTime: Date;
    isOnline: boolean;
    email: string;
    discord: string;
    isPublic: boolean;
    // Location is simplified for the form input
    locationAddress: string;
}

// Initial form state with default values
const initialFormState: FormState = {
    name: '',
    slug: '',
    startTime: new Date(),
    endTime: new Date(),
    isOnline: true,
    email: '',
    discord: '',
    isPublic: true,
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

    // handler for changes in inputs
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
                {email: formData.email.trim() || undefined, discord: formData.discord.trim() || undefined},
                formData.isPublic,
                slugArg,
                locationArg
            );

            if (response.success) {
                alert(`Tournament "${formData.name}" created successfully!`);
                // Redirect to the new tournament's detail page
                // will change this to push to create events page
                router.push(`/tournaments/${response.data}`);
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

    // general classNames used in most of the inputs on this page
    const pageLabelClass = "block text-base lg:text-xl bg-white text-tertiary rounded-md"
    const pageInputClass = `mt-1 block font-jersey-25 bg-white w-full rounded-xl border-2 border-tertiary 
                            text-black text-lg lg:text-2xl p-3 shadow-md focus:outline-primary`

    return (
        <div className="mt-4 w-full px-4 sm:px-6 lg:px-8 sm:mx-4 md:mx-8 lg:mx-16 font-jersey-10 text-3xl lg:text-5xl">
            <h1 className="mb-4 border-b-2 border-tertiary">
                Create a New Tournament
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                {/* Error Message */}
                {formError && (
                    <div
                        role="alert"
                        className="bg-errors border-2 border-errBorder text-xl lg:text-3xl
                        px-3 py-2 sm:px-4 sm:py-3 rounded-xl mb-4 font-jersey-25"
                    >
                        {formError}
                    </div>
                )}

                <h2 className="text-2xl lg:text-4xl mb-4">
                    Basic Information
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
                            <ErrorMessageForTournament field='name' fieldErrors={fieldErrors}/>
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
                            <ErrorMessageForTournament field='slug' fieldErrors={fieldErrors}/>
                        </div>

                        {/* Start Time */}
                        <div className="mb-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Start Date (Required)"
                                inputType="datetime-local"
                                inputName="startTimeCreate"
                                inputId="startTimeCreate"
                                inputValue={dateToInputString(formData.startTime)}
                                inputOnChange={(e) => {
                                    if (!e.target.validity.valid) return;
                                    setFormData({...formData, startTime: new Date(e.target.value)});
                                }}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={`${pageInputClass} appearance-none`}
                            />
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors}/>
                        </div>

                        {/* End Time */}
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="End Date (Required)"
                                inputType="datetime-local"
                                inputName="endTimeCreate"
                                inputId="endTimeCreate"
                                inputValue={dateToInputString(formData.endTime)}
                                inputOnChange={(e) => {
                                    if (!e.target.validity.valid) return;
                                    setFormData({...formData, endTime: new Date(e.target.value)});
                                }}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Location Type */}
                <fieldset className="p-4 sm:p-5 bg-tertiary border-2 rounded-3xl mb-6 w-full">
                    <legend className="text-2xl lg:text-4xl bg-tertiary rounded-xl px-2">
                        Location Type
                    </legend>

                    {/* isOnline Checkbox */}
                    <Checkbox
                        id="isOnline"
                        name="isOnline"
                        checked={formData.isOnline}
                        onChange={handleChange}
                        label="Online tournament?"
                        boxClassName="group h-6 w-6 rounded-md border-2 border-primary flex items-center
                        justify-center transition-all duration-200 hover:bg-white"
                        checkedBoxClassName="bg-primary text-black"
                        iconSize={18}
                        iconClassName="group-hover:text-primary text-white"
                        labelClassName="text-3xl font-jersey-25"
                    />
                    

                    {/* Location Address (Appears only if offline) */}
                    <div
                        className={`grid transition-all duration-500 
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
                            <ErrorMessageForTournament field='location' fieldErrors={fieldErrors}/>
                        </div>
                    </div>
                </fieldset>

                {/* Tournament Visibility */}
                <fieldset className="p-4 sm:p-5 bg-tertiary border-2 rounded-3xl mb-6 w-full">
                    <legend className="text-2xl lg:text-4xl bg-tertiary rounded-xl px-2 -mb-3">
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
                            onChange={() => setFormData({...formData, isPublic: true})}
                        />
                        <label
                            htmlFor="tournament-public"
                            className="ml-2 text-xl lg:text-3xl font-jersey-25"
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
                            onChange={() => setFormData({...formData, isPublic: false})}
                        />
                        <label
                            htmlFor="tournament-private"
                            className="ml-2 text-xl lg:text-3xl font-jersey-25"
                        >
                            Private
                        </label>
                    </div>
                </fieldset>

                {/* Contact Information */}
                <fieldset className="p-4 sm:p-5 bg-tertiary border-2 rounded-3xl mb-6 w-full">
                    <legend className="text-2xl lg:text-4xl bg-tertiary rounded-xl px-2 -mb-3">
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
                                inputValue={formData.discord}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder='e.g., https://discord.gg/xxxxxxxx'
                                inputClassName={pageInputClass}
                            />
                        </div>
                    </div>
                    <ErrorMessageForTournament field='contact' fieldErrors={fieldErrors}/>
                </fieldset>

                {/* Submit Button */}
                <div className="pt-4 sm:pt-6 mt-4 border-t-2 border-t-tertiary">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border
                        border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium
                        text-white bg-secondary hover:bg-tertiary focus:outline-none focus:ring-2
                        focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors
                        text-xl lg:text-3xl"
                    >
                        {isSubmitting ? 'Going to events...' : 'Create events for this tournament'}
                        <ArrowRight size={18} className='shrink-0'/>
                    </button>
                </div>
            </form>
        </div>
    );
}

