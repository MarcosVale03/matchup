'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertEvent, EventInsertErrors } from '@/server/mutations/events.mutations';
import { dateToInputString } from "@/lib/utils";
import { X } from 'lucide-react';

const getDefaultFutureDate = (hours: number = 2) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    d.setMinutes(Math.floor(d.getMinutes() / 5) * 5);
    return d;
};

// Initial state for the form
interface FormState {
    tournament_id: number;
    event_id: number;
    name: string;
    video_game: string;
    startTime: Date;
    endTime: Date;
    teams: boolean;
    platform: string,
    price: number;
    teamSize: number;
}

const initialFormState: FormState = {
    tournament_id: 0,
    event_id: 0,
    name: '',
    video_game: '',
    startTime: new Date(),
    endTime: getDefaultFutureDate(2),
    teams: false,
    platform: '',
    price: 0,
    teamSize: 0,
};

export default function TournamentEventForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormState>(initialFormState);
    const [fieldErrors, setFieldErrors] = useState<EventInsertErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


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

        const startTimeArg = new Date(formData.startTime);
        const endTimeArg = new Date(formData.endTime);

        try {
            const response = await insertEvent(
                formData.tournament_id,
                formData.name,
                startTimeArg,
                endTimeArg,
                formData.price,
                formData.video_game,
                formData.platform,
                formData.teams,
                formData.teamSize
            );

            if (response.success) {
                alert(`Event "${formData.name}" created successfully!`);
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
    const ErrorMessage = ({ field }: { field: keyof EventInsertErrors }) => {
        const errors = fieldErrors[field];
        return errors ? (
            <div className="mt-2 flex text-sm text-red-500">
                <X size={18} />
                {errors.map((msg, i) => <p key={i}>{field !== "name" ? msg : "Tournament name should be longer than 3 characters"}</p>)}
            </div>
        ) : null;
    };

    // general classNames used in most of the inputs on this page
    const pageLabelClass = "block text-sm font-medium text-gray-700 w-full"
    const pageInputClass = "mt-1 block w-full rounded border border-gray-200 shadow-sm p-2 hover:shadow-md focus:outline-primary text-gray-500"

    return (
        <div className="mx-auto mt-6 w-full max-w-7xl px-4 font-[Poppins] sm:mt-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl">
                    Create Tournament Events
                </h1>

                <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-md sm:max-h-[70vh] sm:p-6 lg:p-8">
                    {/* Error Message */}
                    {formError && (
                        <div className="mb-4 rounded border border-red-400 bg-red-100 px-3 py-2 text-sm text-red-700 sm:px-4 sm:py-3 sm:text-base" role="alert">
                            {formError}
                        </div>
                    )}

                    <h2 className="mb-4 text-lg font-semibold text-primary sm:text-xl">
                        Event Details
                    </h2>

                    {/* General Details */}
                    <fieldset className="mb-6 space-y-4">
                        <div className="flex flex-col space-y-4 w-full">
                            {/* Event Name */}
                            <div className="md:col-span-2">
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Event Name *"
                                    inputType='text'
                                    inputName="name"
                                    inputId="name"
                                    inputValue={formData.name}
                                    inputOnChange={handleChange}
                                    required={true}
                                    inputPlaceholder="Enter event name"
                                    inputClassName={pageInputClass}
                                />
                                <ErrorMessage field='name' />
                            </div>

                            {/* Video Game */}
                            <div className="flex w-full space-x-4">
                                <div className="md:col-span-2 w-full">
                                    <BasicInputWithLabel
                                        labelClassName={pageLabelClass}
                                        labelText="Event Game *"
                                        inputType="text"
                                        inputName="slug"
                                        inputId="slug"
                                        inputValue={formData.video_game}
                                        inputOnChange={handleChange}
                                        required={true}
                                        inputPlaceholder="e.g., GGST"
                                        inputClassName={pageInputClass}
                                    />
                                </div>

                                {/* Platform (simple select option for now) */}
                                <div className="w-full">
                                    <h1 className="w-full p-2.5 text-gray-700">Platform</h1>
                                    <select className="w-full p-2.5 text-gray-700">
                                        <option>PlayStation 5</option>
                                        <option>PC</option>
                                        <option>XBox</option>
                                        <option>Switch</option>
                                    </select>
                                </div>
                                <ErrorMessage field='game_and_platform' />
                            </div>

                            {/* Price */}
                            <div>
                                <BasicInputWithLabel
                                    labelClassName='block text-sm font-medium text-gray-700'
                                    labelText='Price (Optional)'
                                    inputType='text'
                                    inputName='email'
                                    inputId='email'
                                    inputValue={formData.price}
                                    inputOnChange={handleChange}
                                    required={false}
                                    inputPlaceholder='e.g., $5'
                                    inputClassName={pageInputClass}
                                />
                            </div>

                            <div className="flex w-full space-x-4">
                                {/* Start Time */}
                                <div className="w-full">
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
                                <div className="w-full">
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
                        </div>
                    </fieldset>

                    {/* Teams */}
                    <fieldset className="mb-6 space-y-4 rounded-md border p-4 sm:p-5">
                        <h2 className="text-lg font-semibold text-primary sm:text-xl">
                            Team Event
                        </h2>

                        {/* Teams Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="teams"
                                id="teams"
                                checked={formData.teams}
                                onChange={handleChange}
                                className="h-4 w-4 shrink-0 accent-primary"
                            />
                            <label htmlFor="teams" className="ml-2 block text-sm font-medium text-gray-700">
                                Is the event played in teams?
                            </label>
                        </div>

                        {/* Team Information (if teams are enabled) */}
                        {formData.teams && (
                            <>
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Max Team Size *"
                                    inputType="text"
                                    inputName="teamSize"
                                    inputId="teamSize"
                                    inputValue={formData.teamSize}
                                    inputOnChange={handleChange}
                                    required={!formData.teams}
                                    inputPlaceholder="e.g. 5"
                                    inputClassName={pageInputClass}
                                />
                                <ErrorMessage field='location' />
                            </>
                        )}
                    </fieldset>


                    {/* Submit Button */}
                    <div className="mt-4 border-t border-t-gray-300 pt-4 sm:pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm
                                       transition-colors hover:bg-secondary focus:ring-2 focus:ring-primary focus:ring-offset-2
                                       focus:outline-none disabled:opacity-50 sm:py-3 sm:text-base"
                        >
                            <span>{isSubmitting ? 'Creating...' : 'Create Event'}</span>
                        </button>
                        </div>
                </form>
            </div>
        </div>
    );
}