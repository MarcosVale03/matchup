'use client';

import React, { useState } from 'react';
import { updateTournament, TournamentUpdateErrors } from '@/server/mutations/tournaments.mutations'; 
import { useRouter } from 'next/navigation';
import {dateToInputString} from "@/lib/utils";


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

// this will definitely be changed later on
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

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setFieldErrors({});
        setFormErrors([]);
        setSuccessMessage(null);

        // Map form state to server action arguments, including the ID
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

        if (!result.success) {
            setStatus('error');
            setFieldErrors(result.fieldErrors || {});
            setFormErrors(result.formErrors || ['An unknown validation error occurred during update.']);
        } else {
            setStatus('success');
            setSuccessMessage(`Tournament ID ${formData.id} updated successfully!`);
            router.push("/tournaments")
        }
    };

    // Helper to display errors
    const ErrorMessage = ({ field }: { field: keyof TournamentUpdateErrors }) => {
        const errors = fieldErrors[field];
        return errors ? (
            <div className="text-red-500 text-sm mt-1">
                {errors.map((msg, i) => <p key={i}>* {msg}</p>)}
            </div>
        ) : null;
    };


    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border ">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Tournament: {initialData.name}</h2>
            
            {/* Global Form Errors */}
            {formErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {formErrors.map((msg, i) => <p key={i}>{msg}</p>)}
                </div>
            )}
            
            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ID (Read-only for debugging/clarity) */}
                <div>
                    <label className="block text-sm font-medium text-gray-500">Tournament ID (Read-Only)</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{formData.id}</p>
                </div>
                
                {/* Name Input */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tournament Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400"
                    />
                    <ErrorMessage field="name" />
                </div>
                
                {/* Slug Input */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Custom Slug (Optional)</label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="e.g., valorant-summer-cup"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400"
                    />
                    <ErrorMessage field="slug" />
                </div>

                {/* Times (Simplified Date/Time inputs) */}
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="datetime-local" 
                            name="startTime"
                            id="startTime"
                            value={dateToInputString(formData.startTime)} 
                            onChange={(e) => setFormData(p => ({...p, startTime: new Date(e.target.value)}))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400"
                        />
                        <ErrorMessage field="times" /> 
                    </div>
                    <div className="flex-1">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            id="endTime"
                            value={dateToInputString(formData.endTime)} 
                            onChange={(e) => setFormData(p => ({...p, endTime: new Date(e.target.value)}))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400"
                        />
                    </div>
                </div>

                {/* Location Toggle */}
                <div className="flex items-center">
                    <input
                        id="isOnline"
                        name="isOnline"
                        type="checkbox"
                        checked={formData.isOnline}
                        onChange={handleLocationToggle}
                        className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label htmlFor="isOnline" className="ml-2 block text-sm text-gray-900">
                        Is this an Online Tournament?
                    </label>
                </div>
                <ErrorMessage field="location" />

                {/* Contact Inputs */}
                <fieldset className="border p-4 rounded-md">
                    <legend className="text-base font-medium text-gray-900">Contact Information</legend>
                    <div className="mt-2 space-y-2">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="discord" className="block text-sm font-medium text-gray-700">Discord Link</label>
                            <input
                                type="text"
                                name="discord"
                                id="discord"
                                value={formData.discord}
                                onChange={handleChange}
                                placeholder="Paste the invite link"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400"
                            />
                        </div>
                    </div>
                    <ErrorMessage field="contact" />
                </fieldset>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        status === 'loading' ? 'bg-[#BD2D2D] cursor-not-allowed' : 'bg-[#BD2D2D] hover:bg-[#992323]'
                    }`}
                >
                    {status === 'loading' ? 'Saving Changes...' : 'Update Tournament'}
                </button>
            </form>
        </div>
    );
}