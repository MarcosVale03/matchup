'use client';
import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {updateTournament, TournamentUpdateErrors} from '@/server/mutations/tournaments.mutations';
import {ArrowLeft, Save} from 'lucide-react';
import {FetchTournamentFromIdResponse} from "@/server/queries/tournaments.queries";
import {toDateTimeLocalInput} from '@/ui/format-time';
import {ErrorMessageForTournament} from "@/features/tournament-crud/error-message-tournament";
import Checkbox from '@/ui/checkbox';
import { getUserIdfromEmail } from '@/server/queries/profile.queries';
import { AdminInsertErrors, deleteAdmins, insertAdmin, updateAdmin } from '@/server/mutations/add-admin.mutation';
import { AdminsFromTournamentResponse, fetchAdminsFromTournament } from '@/server/queries/admins.queries';
import { FormSection } from '@/ui/form-section';
import { SegmentedToggle } from '@/ui/segmented-toggle';

export default function TournamentEditForm({initialData, currAdmins}: { initialData: FetchTournamentFromIdResponse, currAdmins : AdminsFromTournamentResponse[]}) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        id: initialData.id,
        name: initialData.name ?? '',
        slug: initialData.slug ?? '',
        startTime: toDateTimeLocalInput(initialData.start_time),
        endTime: toDateTimeLocalInput(initialData.end_time),
        isOnline: initialData.is_online,
        isPublic: initialData.is_public,
        email: initialData.email_contact ?? '',
        discord: initialData.discord_invite ? `https://discord.gg/${initialData.discord_invite}` : '',
        locationAddress: 'Los Angeles, CA', // TODO: wire to real location column when it lands
        adminEmail : "",
        adminPermissionLevel : 4,
    });

    const [fieldErrors, setFieldErrors] = useState<TournamentUpdateErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [admin, setAdmin] = useState(
        // using filter to not display the owner (owner technically an admin through perm level 0) we only want 2-4 perms
        currAdmins.filter(admin => admin.permission_levels.id !== 0).map(admin => ({
            adminEmail : admin.email ?? '',
            adminPermissionLevel : admin.permission_levels.id
        }))
    )

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
        if (admin.length > 1) {
            setAdmin(admin.slice(0,-1))
        }

    }

    // handler for text, email, datetime-local, checkbox
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value,
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
                    // TODO: real location data from Google Maps
                    maps_place_id: 'mock_place_id',
                    address: formData.locationAddress,
                    latitude: 34.0522,
                    longitude: -118.2437,
                }
        );


        if (response.success && response.data) {

            // delete all admins that are not 0
            await deleteAdmins(response.data)

            // insert the admins, based on use state
            for (const admins of admin) {
                if (admins.adminEmail) {
                    if (admins.adminEmail.trim()) {
                        const user = await getUserIdfromEmail(admins.adminEmail)
                        if (user.success && user.data) {
                            await insertAdmin(response.data, user.data, admins.adminPermissionLevel);
                        }
                    }
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

    const pageLabelClass = "block text-zinc-600 peer-focus:text-primary transition duration-400 tracking-tight";
    const pageInputClass = `peer block bg-white w-full rounded-xl border-2 border-white
                            text-black p-2 focus:outline-none focus:border-primary shadow-sm 
                            transition duration-400 font-normal tracking-tight`;

    return (
        <div className="mt-4 mx-4 flex-1 flex flex-col sm:mx-auto w-full max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
            <h3>
                Updating Tournament: <span className="text-primary">{initialData.name}</span>
            </h3>

            <form onSubmit={handleSubmit} className="mb-6">
                <h4 className="mb-4 pb-1 text-gray-600 border-b border-gray-300">
                    Tournament ID: <span>{initialData.id}</span>
                </h4>

                {formError && (
                    <div
                        role="alert"
                        className="bg-errors/20 text-sm lg:text-base px-3 py-2 rounded-xl mb-4 text-primary
                                   font-poppins font-semibold"
                    >
                        {formError}
                    </div>
                )}

                {/* Basic Details */}
                <FormSection title="Basic Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Tournament Name - Required"
                                inputType='text'
                                inputName="name"
                                inputId="name"
                                inputValue={formData.name}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder="More than 3 characters"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='name' fieldErrors={fieldErrors} />
                        </div>

                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Slug - Optional, for URL"
                                inputType="text"
                                inputName="slug"
                                inputId="slug"
                                inputValue={formData.slug}
                                inputOnChange={handleChange}
                                required={false}
                                inputPlaceholder="More than 3 characters"
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='slug' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </FormSection>

                {/* Schedule */}
                <FormSection title="Schedule">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Start Date - Required"
                                inputType="datetime-local"
                                inputName="startTime"
                                inputId="startTime"
                                inputValue={formData.startTime}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                        </div>

                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="End Date - Required"
                                inputType="datetime-local"
                                inputName="endTime"
                                inputId="endTime"
                                inputValue={formData.endTime}
                                inputOnChange={handleChange}
                                required={true}
                                inputPlaceholder=""
                                inputClassName={pageInputClass}
                            />
                            <ErrorMessageForTournament field='times' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </FormSection>

                {/* Location */}
                <FormSection title="Location">
                    <SegmentedToggle
                        ariaLabel="Tournament location type"
                        value={formData.isOnline}
                        onChange={(v) => setFormData({ ...formData, isOnline: v })}
                        options={[
                            { value: true, label: "Online" },
                            { value: false, label: "In-Person" },
                        ]}
                    />

                    <div
                        className={`grid transition-all duration-500 mt-3
                            ${!formData.isOnline ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        aria-hidden={formData.isOnline}
                    >
                        <div className="overflow-hidden">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Physical Address - Required"
                                inputType="text"
                                inputName="locationAddress"
                                inputId="locationAddress"
                                inputValue={formData.locationAddress}
                                inputOnChange={handleChange}
                                required={!formData.isOnline}
                                inputPlaceholder="e.g., 123 Main St, Anytown"
                                inputClassName={`${pageInputClass} mb-1`}
                                tabIndex={formData.isOnline ? -1 : 0}
                            />
                            <ErrorMessageForTournament field='location' fieldErrors={fieldErrors} />
                        </div>
                    </div>
                </FormSection>

                {/* Visibility */}
                <FormSection title="Visibility">
                    <SegmentedToggle
                        ariaLabel="Tournament visibility"
                        value={formData.isPublic}
                        onChange={(v) => setFormData({ ...formData, isPublic: v })}
                        options={[
                            { value: true, label: "Public" },
                            { value: false, label: "Private" },
                        ]}
                    />
                    <p className="mt-2 text-xs text-gray-500 tracking-tight">
                        {formData.isPublic
                            ? "Anyone can find and view this tournament."
                            : "Only people you invite can view this tournament."}
                    </p>
                </FormSection>

                {/* Contact */}
                <FormSection title="Contact — at least one required">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText={`Email${initialData.email_contact ? "" : " (was not provided)"}`}
                            inputType='email'
                            inputName='email'
                            inputId='email'
                            inputValue={formData.email}
                            inputOnChange={handleChange}
                            required={false}
                            inputPlaceholder='organizer@example.com'
                            inputClassName={pageInputClass}
                        />
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText={`Discord Invite${initialData.discord_invite ? "" : " (was not provided)"}`}
                            inputType='text'
                            inputName='discord'
                            inputId='discord'
                            inputValue={formData.discord}
                            inputOnChange={handleChange}
                            required={false}
                            inputPlaceholder='https://discord.gg/xxxxxxxx'
                            inputClassName={pageInputClass}
                        />
                    </div>
                    <ErrorMessageForTournament field='contact' fieldErrors={fieldErrors} />
                </FormSection>

                {/* Submit button */}
                <div className="border-t border-gray-300 pt-3 pb-3 mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2">
                <fieldset className="p-4 px-5 border-2 border-zinc-600 rounded-2xl mb-6 w-full">
                                    <legend >
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
                {/* Back/Submit Button */}
                <div className="pt-4 sm:pt-6 mt-4 border-t-2 border-gray-400 flex gap-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                    >
                        <ArrowLeft className="size-5" />
                        Back to details
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   disabled:cursor-not-allowed transition-colors"
                    >
                        <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                        <Save className="size-5" />
                    </button>
                </div>
                </div>
            </form>
        </div>
    );
}

