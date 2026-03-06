'use client'
import { CircleUser} from "lucide-react";
export default function ProfilePage() {

return (
    <main className="bg-white flex flex-col min-h-screen font-[Poppins]">
        {/* Main Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 mx-auto w-full max-w-7xl">
            {/* Profile Info Section */}
            <div className="flex tems-center justify-center md:justify-start gap-4 mb-20">
                <div className='flex flex-col'>
                    <div className='text-4xl font-bold text-primary'>Profile Settings</div>
                    <div className="flex flex-col mt-2 mb-2">
                        <label>Prefix</label>
                        <input className="border border-red-600 border-2 rounded-md" type="text"/>
                        <label>Username</label>
                        <input className="border border-red-600 border-2 rounded-md" type="text"/>
                        <label>First Name</label>
                        <input className="border border-red-600 border-2 rounded-md" type="text"/>
                        <label>Last Name</label>
                        <input className="border border-red-600 border-2 rounded-md" type="text"/>
                        <label>Location</label>
                        <input className="border border-red-600 border-2 rounded-md" type="text"/>
                    </div>
                    <div className='text-4xl font-bold text-primary'>Stats Settings</div>
                    <div className="flex flex-col mt-2 mb-2">
                    <label className="switch">
                        <input type="checkbox"/>
                        <span className="slider">Include Upcoming Tournaments you will participate in</span>
                    </label>
                    </div>
                </div>
            </div>
        </div>  
    </main>
);

}