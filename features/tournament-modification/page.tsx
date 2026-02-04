'use client';

import React, { useState } from 'react';
import { updateTournament, TournamentUpdateErrors } from '@/server/mutations/tournaments.mutations';
import { useRouter } from 'next/navigation';
import { dateToInputString } from "@/lib/utils";
import BasicInputWithLabel from '@/ui/basic-input-with-label';
import { format } from 'path';
import { sleep } from '../sleep-function';


interface FormState {
    id: number;
    name: string;
    slug: string | undefined;
    startTime: Date;
    endTime: Date;
    isOnline: boolean;
    email: string | undefined;
    discord: string | undefined;
    location: any | undefined; // Placeholder for location object
}

type Tournament = {
    id: number;
    name: string;
    slug: string | null;
    start_time: Date;
    end_time: Date;
    is_online: boolean;
    contact: {
        email: string | null,
        discord: string | null,
    };

    location: any | undefined | null;
}

export default function TournamentEditForm({ initialData }: { initialData: Tournament }) {

    // defaults for now
    const id = initialData.id ?? 0;
    const name = initialData.name ?? "";
    const start_time = initialData.start_time ?? new Date();
    const end_time = initialData.end_time ?? new Date();
    const slug = initialData.slug ?? '';
    const is_online = initialData.is_online ?? false;
    const contactInfo = initialData.contact;
    const location = initialData.location ?? undefined;



    const [formData, setFormData] = useState<FormState>({
        // NON-DUMMY/PASSED VALUES
        id: id,
        name: name,
        slug: slug || '',
        startTime: start_time,
        endTime: end_time,

        // DEFAULT VALUES
        isOnline: is_online,
        email: contactInfo.email == null ? '' : contactInfo.email,        // Defaults to '' if email is missing or contact is empty
        discord: contactInfo.discord == null ? '' : contactInfo.discord,    // Defaults to '' if discord is missing or contact is empty
        location: location,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<TournamentUpdateErrors>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name as keyof TournamentUpdateErrors];
            return newErrors;
        });
        setFormErrors([]);
    };

    const handleLocationToggle = () => {
        setFormData(prev => ({
            ...prev,
            isOnline: !prev.isOnline,
            location: !prev.isOnline ? undefined : prev.location, // Clear location if switching to online
        }));
    };

    // main update logic
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true)
        setFieldErrors({});
        setFormErrors([]);
        setSuccessMessage(null);

        // Map form state to server action arguments, including the ID
        try {
            const result = await updateTournament(
                formData.id,
                formData.name,
                formData.startTime,
                formData.endTime,
                formData.isOnline,
                { email: formData.email?.trim() || undefined, discord: formData.discord?.trim() || undefined },
                formData.slug || undefined,
                formData.isOnline ? undefined : formData.location
            );

            if (result.success) {
                setSuccessMessage(`${formData.name} updated successfully!`);
                router.push("/tournaments");
            } else {
                setFieldErrors(result.fieldErrors || {});
                setFormErrors(result.formErrors || ['An unknown validation error occurred during update.']);
            }

        } catch (error: unknown) {
            setFormErrors(["An unexpected error occured"]);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to display errors for specific fields
    const ErrorMessage = ({ field }: { field: keyof TournamentUpdateErrors }) => {
        const errors = fieldErrors[field];
        return errors ? (
            <div className="text-red-500 text-sm mt-2">
                {errors.map((msg, i) => <p key={i}>* {msg}</p>)}
            </div>
        ) : null;
    };


    const pageLabelClass = "block text-sm font-medium text-gray-700"
    const pageInputClass = "mt-1 block w-full rounded-md border-gray-500 shadow-sm p-2 focus:border-[#BD2D2D] focus:ring-[#BD2D2D] text-gray-500"
    return (
        <div className="mt-10">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border p-10 max-h-[90vh] max-w-[95vw] overflow-y-auto">

                {/* Global Form Errors */}
                {formErrors.length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {formErrors.map((msg, i) => <p key={i}>{msg}</p>)}
                    </div>
                )}

                <h1 className="text-3xl font-bold text-gray-800 text-center">
                    Edit Tournament: <span className="text-[#BD2D2D]">{initialData.name}</span>
                </h1>

                <div className="mt-5 flex">
                    <p className="text-md text-gray-500 text-center">Tournament ID (Read-Only):
                        <span className="font-semibold text-black whitespace-pre"> {formData.id}</span>
                    </p>
                </div>

                {/* General Details */}
                <fieldset className="space-y-4 m-5 md:grid md:grid-rows-2 md:grid-cols-2 md:gap-x-3 md:mb-0">

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
                            inputPlaceholder={formData.name ? formData.name : "Enter a tournament name"}
                            inputClassName={pageInputClass}

                        />
                        <ErrorMessage field="name" />
                    </div>

                    <div>
                        {/* Slug */}
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText="Slug (Optional, for URL)"
                            inputType="text"
                            inputName="slug"
                            inputId="slug"
                            inputValue={formData.slug}
                            inputOnChange={handleChange}
                            required={false}
                            inputPlaceholder={formData.slug ? formData.slug : "e.g., Tourney123"}
                            inputClassName={pageInputClass}
                        />

                        <ErrorMessage field="slug" />
                    </div>

                    <div>

                        {/* Start Time */}
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

                        <ErrorMessage field="times" />
                    </div>

                    <div>
                        {/* End Time */}
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
                    <h1 className="text-xl font-semibold mb-3 text-[#BD2D2D]">
                        Location Type
                    </h1>

                    {/* isOnline Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isOnline"
                            id="isOnline"
                            checked={formData.isOnline}
                            onChange={handleLocationToggle}
                            className="h-4 w-4 accent-[#BD2D2D]"
                        />
                        <label htmlFor="isOnline" className="ml-2 block text-sm font-medium text-gray-700">
                            Online Tournament
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
                                inputValue={formData.location}
                                inputOnChange={handleChange}
                                required={!formData.isOnline}
                                inputPlaceholder={formData.location ? formData.location : "e.g., 123 Main St, Anytown"}
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessage field="location" />
                        </>
                    )}
                </fieldset>

                {/* Contact Information */}
                <fieldset className="space-y-4 p-4 my-4 border rounded md:grid md:grid-rows-1 md:grid-cols-2 md:gap-x-3 md:mb-0">
                    <h1 className="text-xl font-semibold mb-3 text-[#BD2D2D] md:col-span-2 md:self-end">
                        Contact Information (At least one is required)
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
                        inputPlaceholder={formData.email ? formData.email : "Enter your email"}
                        inputClassName={pageInputClass}
                    />

                    {/* Discord */}
                    <BasicInputWithLabel
                        labelClassName='block text-sm font-medium text-gray-700'
                        labelText='Discord Link (Optional)'
                        inputType='string'
                        inputName='discord'
                        inputId='discord'
                        inputValue={formData.discord}
                        inputOnChange={handleChange}
                        required={false}
                        inputPlaceholder={formData.discord ? formData.discord : "e.g., discord.gg/xxxxxxxx"}
                        inputClassName={pageInputClass}
                    />
                    <ErrorMessage field="contact" />
                </fieldset>

                {/* Submit Button */}
                <div className="pt-6 mt-4 border-t">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                                               text-white bg-[#BD2D2D] hover:bg-[#992323] focus:outline-none focus:ring-2 focus:ring-offset-2 
                                               focus:ring-[#BD2D2D] disabled:opacity-50 mb-4"
                    >
                        {isSubmitting ? 'Saving changes...' : "Edit this tournament"}
                    </button>
                </div>

                {/* Success message */}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
}