'use client'
import { updateUser } from '@/server/mutations/profile.mutations'
import { useState } from "react"
import { User } from "@/server/queries/profile.queries";
import { useRouter } from 'next/navigation';
import { Save } from "lucide-react";

export default function ProfileSettingsPage({profile} : {profile : User}) {
    
    const router = useRouter()

    const [prefix, setPrefix] = useState(profile.prefix ?? "")
    const [displayName, setDisplayName] = useState(profile.display_name ?? "")
    const [firstName, setFirstName] = useState(profile.first_name ?? "")
    const [lastName, setLastName] = useState(profile.last_name ?? "")
    const [state, setState] = useState(profile.state ?? "")
    const [country, setCountry] = useState(profile.country ?? "")
    const [show_results, setShowResults] = useState(profile.show_results ?? true)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false)

    const handleUserEdit = async (e : React.FormEvent) => {
        e.preventDefault();

        if (!displayName.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await updateUser(prefix, displayName, firstName, lastName, state, country, show_results)

            if (!result.success) {
                setError(result.formErrors?.[0] || "Failed to update user");
                return;
            }

            router.refresh()
            setSuccess(true)
            
        } catch (err) {
            setError("An error occurred");
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    }

return (
    <main className="bg-white flex flex-col min-h-screen font-poppins">
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 mx-auto w-full max-w-7xl">
            <form onSubmit={handleUserEdit} className='bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-7 space-y-5 sm:space-y-6'>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-20">
                    <div className='flex flex-col'>
                        <div className='text-4xl font-bold text-primary'>Profile Settings</div>
                        {/* Error message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Different things the User can edit */}
                        <div className="flex flex-col mt-2 mb-2">
                            <label className="text-primary">Prefix</label>
                            <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} disabled={isSubmitting} className="border border-red-600 border-2 rounded-md text-black mb-2"/>
                            <label className="text-primary">Display Name</label>
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSubmitting} className= "border border-red-600 border-2 rounded-md text-black mb-2"/>
                            <label className="text-primary">First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isSubmitting} className="border border-red-600 border-2 rounded-md text-black mb-2"/>
                            <label className="text-primary">Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isSubmitting} className="border border-red-600 border-2 rounded-md text-black"/>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col">
                                <label className="text-primary">State</label>
                                <input type="text" value={state} onChange={(e) => setState(e.target.value)} disabled={isSubmitting} className="border border-red-600 border-2 rounded-md text-black"/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-primary">Country</label>
                                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} disabled={isSubmitting} className="border border-red-600 border-2 rounded-md text-black"/>
                            </div>
                        </div>
                        {/* Stats Setting */}
                        <div className='text-4xl font-bold text-primary mt-10'>Stats Settings</div>
                        <div className="flex flex-col mt-2 mb-2">
                        <label className="switch mt-5">
                            <input type="checkbox" checked={show_results} onChange={(e) => setShowResults(e.target.checked)} disabled={isSubmitting}/>
                            <span className="text-primary ml-2">Include Past & Future Tournaments Stats</span>
                        </label>
                        {/* Button to save changes */}
                        <button type='submit' disabled={!displayName.trim() || isSubmitting} className=' mt-8 w-fit bg-primary text-red py-2.0 sm:py-2 px-2 sm:px-4 rounded-lg 
                        hover:bg-red-800 hover:cursor-pointer 
                        transition-colors duration-150 text-sm sm:text-base font-medium
                        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed'>Save Changes</button>
                        </div>
                        {success && <p className='text-green-500'>Profile Updated Successfully</p>}

                    </div>
                    
                </div>
            </form>
        </div>  
    </main>
);

}