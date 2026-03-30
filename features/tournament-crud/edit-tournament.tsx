'use client';
import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {updateTournament, TournamentUpdateErrors} from '@/server/mutations/tournaments.mutations';
import {ArrowLeft, Save} from 'lucide-react';
import {FetchTournamentFromIdResponse} from "@/server/queries/tournaments.queries";
import {toDateTimeLocalInput} from '@/ui/format-time';
import {ErrorMessageForTournament} from "@/features/tournament-crud/error-message-tournament";
import Checkbox from '@/ui/checkbox';
import { getUserIdfromEmail } from '@/server/queries/profile.queries';
import { insertAdmin, updateAdmin } from '@/server/mutations/add-admin.mutation';

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
        discord: initialData.discord_invite ? `https://discord.gg/${initialData.discord_invite}` : '',
        locationAddress: 'Los Angeles, CA', // add location later
        adminEmail : '',
        adminPermissionLevel : 4,
    });

    const [fieldErrors, setFieldErrors] = useState<TournamentUpdateErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // handler for text, email, datetime-local, checkbox
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : name === 'adminPermissionLevel' ? parseInt(value, 10) : value,
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
            if (formData.adminEmail.trim()) {
            
                const user = await getUserIdfromEmail(formData.adminEmail)
                if (user.success && user.data) {
                    await insertAdmin(formData.id, user.data, formData.adminPermissionLevel);
                }
            }
            alert(`Tournament "${formData.name}" updated successfully!`);
            router.push(`/tournaments/${formData.id}`);
        } else {
            setFieldErrors(response.fieldErrors || {});
            setFormError(response.formErrors?.join(' ') || 'Validation failed.');
        }

        setIsSubmitting(false);
    };


    // general classNames used in most of the inputs on this page
    const pageLabelClass = `block text-sm text-zinc-600 rounded-md peer-focus:text-primary transition
                            duration-400 font-[Poppins] font-semibold`

    const pageInputClass = `peer block bg-white w-full rounded-xl border-2 border-white 
                            text-black text-sm lg:text-base p-2.5 focus:outline-none 
                            focus:border-primary shadow-sm transition duration-400 font-[Poppins]`

    const legendClass = "text-base lg:text-lg font-jersey-25 text-primary px-2 -mb-3"

    return (
        <div className="mt-4 mx-4 xs:mx-auto xs:max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl w-full">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-jersey-25">
                Updating Tournament: <span className="text-primary">{initialData.name}</span>
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-6"
            >
                <h2 className="text-base md:text-lg lg:text-xl font-jersey-25 mb-3 border-b border-gray-300">
                    Tournament ID: <span className="">{formData.id}</span>
                </h2>

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
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors}/>
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
                        </div>
                    </div>
                </fieldset>

                {/* Type and Location */}
                <fieldset className="p-2 px-5 border-2 border-zinc-600 rounded-2xl mb-6 w-full">
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
                        labelClassName="text-sm md:text-base lg:text-lg font-jersey-25"
                    />


                    {/* Location Address (Appears only if offline) */}
                    <div
                        className={
                            `grid transition-all duration-500 
                            ${!formData.isOnline ?
                                'grid-rows-[1fr] opacity-100' :
                                'grid-rows-[0fr] opacity-0'
                            }
                        `}
                    >
                        <div className="p-2 overflow-hidden">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Physical Address (Required)"
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
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-2xl mb-6 w-full">
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
                            checked={formData.isPublic}
                            className="h-4 w-4 accent-primary shrink-0"
                            onChange={() => setFormData({...formData, isPublic: true})}
                        />
                        <label
                            htmlFor="tournament-public"
                            className="ml-2 text-sm md:text-base lg:text-lg font-jersey-25"
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
                            className="h-4 w-4 accent-primary shrink-0"
                            onChange={() => setFormData({...formData, isPublic: false})}
                        />
                        <label
                            htmlFor="tournament-private"
                            className="ml-2 text-sm md:text-base lg:text-lg font-jersey-25"
                        >
                            Private
                        </label>
                    </div>
                </fieldset>

                {/* Contact Information */}
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-2xl mb-6 w-full">
                    <legend className={legendClass}>
                        Contact Information (At least one required)
                    </legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="mt-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText={`Email (Optional) ${initialData.email_contact ? "" : " - Was not provided"}`}
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
                                labelText={`Discord Link (Optional) ${initialData.discord_invite ? "" : " - Was not provided"}`}
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
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-2xl mb-6 w-full">
                    <legend className={legendClass}>
                        Add Tournament Admins
                    </legend>
                    {/* Admin Email */}
                    <div className="mt-2">
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText='Admin Email'
                            inputType='email'
                            inputName='adminEmail'
                            inputId='adminEmail'
                            inputValue={formData.adminEmail}
                            inputOnChange={handleChange}
                            required={false}
                            inputPlaceholder='Enter your admin email'
                            inputClassName={pageInputClass}
                        />
                    </div>
                    {/* Admin Permission Level */}         
                    <div>
                        <label htmlFor='adminPermissionLevel'>Premission Level</label>
                        <select name='adminPermissionLevel' value={formData.adminPermissionLevel} onChange={handleChange} className={pageInputClass}>
                            <option value={1}>Admin</option>
                            <option value={2}>Moderator</option>
                            <option value={3}>Bracket Manager</option>
                            <option value={4}>Reporter</option>
                        </select>
                    </div>
                </fieldset>               
                {/* Back/Submit Button */}
                <div className="pt-4 sm:pt-6 mt-4 border-t-2 border-gray-400 flex gap-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey-25
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                    >
                        <ArrowLeft className="size-5"/>
                        Back to details
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey-25
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                    >
                        <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                        <Save className="size-5"/>
                    </button>
                </div>
            </form>
        </div>
    );
}

