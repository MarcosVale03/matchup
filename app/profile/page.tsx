'use client'
import { CircleUser} from "lucide-react";
export default function ProfilePage() {

return (
    <main className="bg-white flex flex-col min-h-screen font-[Poppins]">
        {/* Main Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 mx-auto w-full max-w-7xl">
            {/* Profile Info Section */}
            <div className="flex items-center justify-center md:justify-start gap-4 mb-20">
                <CircleUser size={110} className="place-self-center text-primary" />
                <div className='flex flex-col'>
                    <div className='flex items-center gap-2'>
                        <span className='text-2xl text-primary/70 font-bold'>UNM</span>   
                        <div className='text-5xl font-bold text-primary'>Username</div>
                        <button className='ml-3 bg-primary text-red py-2.0 sm:py-2 px-4 sm:px-4 rounded-lg 
                       hover:bg-red-800 hover:cursor-pointer 
                       transition-colors duration-150 text-sm sm:text-base font-medium
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed'>Edit Profile</button>
                    </div>
                <p className='text-primary'>First Name Last Name</p>
                <p className='text-primary'>Joined : Date, Location : State,Country</p>
                </div>
            </div>

            {/* Profile Stats - Upcoming Events */}
            <h2 className='text-lg sm:text-xl font-semibold text-primary border-b-2 border-primary pb-2 mb-3'>
                Upcoming Events
            </h2>
            <div className='flex flex-col gap-4'>
                <div className="w-full sm:w-auto p-3 sm:p-4 text-sm sm:text-base text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition duration-150 cursor-pointer sm:min-w-[180px]">
                
                    <div className="min-w-0 w-full"> 
                        {/* Tournament Name */}
                        <h1 className="font-bold text-lg text-primary text-center break-words sm:text-left">
                            Tournament Name
                        </h1>

                        {/* Organizer Name */}
                        <div className="flex flex-row mt-1 place-self-center sm:place-self-start">
                            <img 
                                src="/globe.svg" 
                                alt="Organizer PFP" 
                                className="w-5 mr-1" 
                            />
                            <p className="text-sm text-gray-800 font-bold">
                                Organizer Name
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Profile Stats - Past Events */}
            <h2 className='text-lg sm:text-xl font-semibold text-primary border-b-2 border-primary pb-2 mb-4 pt-4'>
                Past Events
            </h2>

            <div className='flex flex-col gap-4'>
                <div className="w-full sm:w-auto p-3 sm:p-4 text-sm sm:text-base text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition duration-150 cursor-pointer sm:min-w-[180px]">
                
                    <div className="min-w-0 w-full"> 
                        {/* Tournament Name */}
                        <h1 className="font-bold text-lg text-primary text-center break-words sm:text-left">
                            Tournament Name
                        </h1>

                        {/* Organizer Name */}
                        <div className="flex flex-row mt-1 place-self-center sm:place-self-start">
                            <img 
                                src="/globe.svg" 
                                alt="Organizer PFP" 
                                className="w-5 mr-1" 
                            />
                            <p className="text-sm text-gray-800 font-bold">
                                Organizer Name
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>  
    </main>
);

}