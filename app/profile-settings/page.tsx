
import { fetchUserInfo } from '@/server/queries/profile.queries'
import {createClient} from "@/server/db/server";
import { cookies } from 'next/headers'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore)
    const { data: {user} } = await supabase.auth.getUser()
    
    // ! just to avoid possible null error
    const profileInfo = await fetchUserInfo(user!.id)


return (
    <main className="bg-white flex flex-col min-h-screen font-[Poppins]">
        {/* Main Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 mx-auto w-full max-w-7xl">
            {/* Profile Info Section */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-20">
                <div className='flex flex-col'>
                    <div className='text-4xl font-bold text-primary'>Profile Settings</div>
                    <div className="flex flex-col mt-2 mb-2">
                        <label className="text-primary">Prefix</label>
                        <input className="border border-red-600 border-2 rounded-md text-black mb-2" type="text" defaultValue={profileInfo.data?.prefix ?? ""}/>
                        <label className="text-primary">Display Name</label>
                        <input className="border border-red-600 border-2 rounded-md text-black mb-2" type="text" defaultValue={profileInfo.data?.display_name ?? ""}/>
                        <label className="text-primary">First Name</label>
                        <input className="border border-red-600 border-2 rounded-md text-black mb-2" type="text" defaultValue={profileInfo.data?.first_name ?? ""}/>
                        <label className="text-primary">Last Name</label>
                        <input className="border border-red-600 border-2 rounded-md text-black" type="text" defaultValue={profileInfo.data?.last_name ?? ""}/>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col">
                            <label className="text-primary">State</label>
                            <input className="border border-red-600 border-2 rounded-md text-black" type="text" defaultValue={profileInfo.data?.state ?? ""}/>
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="text-primary">Country</label>
                            <input className="border border-red-600 border-2 rounded-md text-black" type="text" defaultValue={profileInfo.data?.country ?? ""}/>
                        </div>
                    </div>
                    <div className='text-4xl font-bold text-primary mt-10'>Stats Settings</div>
                    <div className="flex flex-col mt-2 mb-2">
                    <label className="switch mt-5">
                        <input type="checkbox"/>
                        <span className="text-primary ml-2">Include Past & Future Tournaments Stats</span>
                    </label>
                    <button className=' mt-8 w-fit bg-primary text-red py-2.0 sm:py-2 px-2 sm:px-4 rounded-lg 
                       hover:bg-red-800 hover:cursor-pointer 
                       transition-colors duration-150 text-sm sm:text-base font-medium
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed'>Save Changes</button>
                    </div>
                </div>
                
            </div>
        </div>  
    </main>
);

}