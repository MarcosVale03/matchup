'use client'
import NavigationBar from '@/ui/navigation-bar';
import { verifyEmail } from '@/actions/auth'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation';
export default function VerifyEmailPage() {

    const grabEmail = useSearchParams();
    const email = grabEmail.get('email') || "";
    const [token, setToken] = useState('');
    const [message, setMessage] = useState(''); 

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setMessage("");

            const result = await verifyEmail(email, token);

            if (result.success == false) {
                setMessage(result.message)
            }
    }
    

    return (
            <div className="min-h-screen flex items-center justify-center bg-[#BD2D2D]">
                <NavigationBar hidden={true}/>

                <div className="flex flex-cols-1 md:flex-cols-2 max-w-6xl drop-shadow-xl/30">
                    <div className="flex flex-col items-center justify-center w-full p-10 bg-white font-sans rounded-2xl">
                        <h1 className="text-4xl text-[#BD2D2D] font-bold mb-4 text-center">
                            Thank you for creating an account with MatchUp
                        </h1>
                        <p className="text-md text-[#BD2D2D] text-center font-extralight">
                            Please check your email for your 8 digit code!
                        </p>
                        <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                            <input
                                type='text'
                                maxLength={8}
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="mt-5 border-2 border-[#BD2D2D] text-[#BD2D2D] p-2 rounded-lg text-center text-2xl w-64 focus:ring-2 focus:ring-[#BD2D2D] outline-none font-bold placeholder:text-red-200"
                            />
                            <button type='submit' className='mt-5 bg-[#BD2D2D] text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-all'>
                                Submit
                            </button>
                        </form>
                        </div>
                </div>
            </div>
        )
}   
