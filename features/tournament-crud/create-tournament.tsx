'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { insertTournament, TournamentInsertErrors } from '@/server/mutations/tournaments.mutations';
import { dateToInputString } from "@/lib/utils";
import { ArrowRight } from 'lucide-react';
import { ErrorMessageForTournament } from "@/features/tournament-crud/error-message-tournament";
import Checkbox from "@/ui/checkbox";
import { AdminInsertErrors, insertAdmin } from '@/server/mutations/add-admin.mutation';
import { getUserIdfromEmail } from '@/server/queries/profile.queries';

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
    adminEmail : string;
    adminPermissionLevel : number;
}

// Initial form state with default values
const initialFormState: FormState = {
    name: '',
    slug: '',
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isOnline: true,
    email: '',
    discord: '',
    isPublic: true,
    locationAddress: '',
    adminEmail : '',
    adminPermissionLevel : 4, // default to lowest 
};

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
        adminEmail : '',
        adminPermissionLevel : 4,
    }));
    const [fieldErrors, setFieldErrors] = useState<TournamentInsertErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [admin, setAdmin] = useState([{adminEmail : "", adminPermissionLevel : 4}])
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Placeholder for location data (we would integrate Google Maps API here)
    // For now, we only use the address input
    const mockLocationData = {
        maps_place_id: 'mock_place_id',
        address: formData.locationAddress,
        latitude: 34.0522, // Mock data for LA
        longitude: -118.2437, // Mock data for LA
    };

    // handler for admin add
    const handleAdminAdd=()=>{
        setAdmin([...admin, {adminEmail: "", adminPermissionLevel : 4}])
    }

    // handler for admin change
    const handleAdminChange=(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, i: number)=> {
        const {name, value}=e.target
        const onChangeVal = [...admin]

        if (name === 'adminPermissionLevel') {
            onChangeVal[i].adminPermissionLevel = parseInt(value, 10)
        } 
        
        if (name === 'adminEmail') {
            onChangeVal[i].adminEmail = value
        }

        setAdmin(onChangeVal)
    }

    // handler for admin delete
    const handleAdminDelete=()=> {
        const deleteVal = [...admin]
        if (admin.length > 1) {
            setAdmin(admin.slice(0,-1))
        }

    }
    

    // handler for changes in inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : name === 'adminPermissionLevel' ? parseInt(value, 10) : value,
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

            if (response.success && response.data) {

                for (const admins of admin) {
                if (admins.adminEmail.trim()) {
                    const user = await getUserIdfromEmail(admins.adminEmail)
                    console.log('email tried:', admins.adminEmail)
                    console.log('user lookup result:', JSON.stringify(user))
                    if (user.success && user.data) {
                        const result = await insertAdmin(response.data, user.data, admins.adminPermissionLevel)
                        console.log('insert result:', JSON.stringify(result))
                    } else {
                        console.log('user lookup failed or returned no data')
                    }
                } else {
                    console.log('skipped empty email at index', admin.indexOf(admins))
                }
            }     
            
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
    const pageLabelClass = "block text-zinc-600 2xl:text-xl rounded-md peer-focus:text-primary transition duration-400";


    const pageInputClass = `peer block bg-white w-full rounded-xl border-2 border-white 
                            text-black p-2 2xl:p-4 2xl:text-xl focus:outline-none 
                            focus:border-primary shadow-sm transition duration-400 font-normal`;

    const legendClass = "text-sm md:text-base lg:text-lg font-[Poppins] text-gray-700 px-2 -mb-3 tracking-tight"

    return (
        <div className="mt-4 mx-4 sm:mx-auto w-full max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-jersey-25">
                Create Tournament
            </h1>

            <h2 className="text-base mb-4 pb-1 text-gray-600 border-b border-gray-300">
                Fill in the details below to create your tournament
            </h2>

            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                {/* Error Message */}
                {formError && (
                    <div
                        role="alert"
                        className="bg-errors/20 text-sm lg:text-base px-3 py-2 rounded-xl mb-4 text-primary
                                   font-[Poppins] font-semibold"
                    >
                        {formError}
                    </div>
                )}


                {/* General Details */}
                <fieldset className="space-y-4 mb-4">
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
                                labelText="Start Date (Required)"
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
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors} />
                        </div>

                        {/* End Time */}
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="End Date (Required)"
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
                        </div>
                    </div>
                </fieldset>

                {/* Location Type */}
                <fieldset className="p-2 px-5 border-2 border-zinc-600 rounded-lg mb-6 w-full">
                    <legend className={`${legendClass} mb-0`}>
                        Location Type
                    </legend>

                    {/* isOnline Checkbox */}
                    <Checkbox
                        id="isOnline"
                        name="isOnline"
                        checked={formData.isOnline}
                        onChange={handleChange}
                        label="Online tournament"
                        boxClassName="group h-4 w-4 rounded-sm border-2 border-primary flex items-center
                                      justify-center transition-all duration-200 hover:bg-white"
                        checkedBoxClassName="bg-primary text-black"
                        iconSize={18}
                        iconClassName="group-hover:text-primary text-white"
                        labelClassName=" text-sm md:text-base tracking-tight font-semibold"
                    />


                    {/* Location Address (Appears only if offline) */}
                    <div
                        className={`grid transition-all duration-500 
                            ${!formData.isOnline ?
                                'grid-rows-[1fr] opacity-100' :
                                'grid-rows-[0fr] opacity-0'
                            }
                        `}
                        aria-hidden={formData.isOnline}
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
                                tabIndex={formData.isOnline ? -1 : 0}
                            />
                            <ErrorMessageForTournament field='location' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </fieldset>

                {/* Tournament Visibility */}
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-lg mb-6 w-full">
                    <legend className={legendClass}>
                        Tournament Visibility
                    </legend>

                    {/* Public */}
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="tournament-public"
                            name="visibility"
                            value="public"
                            checked={formData.isPublic === true}
                            className="h-4 w-4 accent-primary shrink-0"
                            onChange={() => setFormData({ ...formData, isPublic: true })}
                        />
                        <label
                            htmlFor="tournament-public"
                            className="ml-2 text-sm md:text-base tracking-tight font-semibold"
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
                            checked={formData.isPublic === false}
                            className="h-4 w-4 accent-primary shrink-0"
                            onChange={() => setFormData({ ...formData, isPublic: false })}
                        />
                        <label
                            htmlFor="tournament-private"
                            className="ml-2 text-sm md:text-base tracking-tight font-semibold"
                        >
                            Private
                        </label>
                    </div>
                </fieldset>

                {/* Contact Information */}
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-lg mb-6 w-full">
                    <legend className={legendClass}>
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
                    <ErrorMessageForTournament field='contact' fieldErrors={fieldErrors} />
                </fieldset>
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-2xl mb-6 w-full">
                    <legend className={legendClass}>
                        Tournament Admins
                    </legend>
                    {
                        admin.map((val, i) => (
                            <div key={i}>
                                {/* Admin Email */}
                                <div className="mt-2">
                                    <BasicInputWithLabel
                                        labelClassName={pageLabelClass}
                                        labelText='Admin Email'
                                        inputType='email'
                                        inputName='adminEmail'
                                        inputId='adminEmail'
                                        inputValue={val.adminEmail}
                                        inputOnChange={(e) => handleAdminChange(e, i)}
                                        required={false}
                                        inputPlaceholder='Enter your admin email'
                                        inputClassName={pageInputClass}
                                    />
                                </div>
                                {/* Admin Permission Level */}         
                                <div>
                                    <label htmlFor='adminPermissionLevel'>Premission Level</label>
                                    <select name='adminPermissionLevel' value={val.adminPermissionLevel} onChange={(e) => handleAdminChange(e, i)} className={pageInputClass}>
                                        <option value={1}>Admin</option>
                                        <option value={2}>Moderator</option>
                                        <option value={3}>Bracket Manager</option>
                                        <option value={4}>Reporter</option>
                                    </select>
                                </div>
                            </div>
                        ))  
                    }   
                    
                    {/* Add/Delete Admins Button */}
                    <div className='flex items-center gap-4 mt-3 '>  
                        <button type='button' onClick={handleAdminAdd} className='rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey-25
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors py-2.5 px-4'>+</button>
                        <button type='button' disabled={admin.length <=1} onClick={() => handleAdminDelete()} className='rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey-25
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors py-2.5 px-4'>-</button>
                    </div>
                    
                </fieldset>
                {/* Submit Button */}
                <div className="pt-4 sm:pt-6 mt-4 border-t-2 border-gray-400 flex gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey-25
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                    >
                        {isSubmitting ? 'Going to events...' : 'Create events for this tournament'}
                        <ArrowRight size={16} className='shrink-0' />
                    </button>
                </div>
            </form>
        </div>
    );
}

