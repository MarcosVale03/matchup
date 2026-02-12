'use client'
import NavigationBar from '@/ui/navigation-bar';

export default function VerifyEmailPage() {
    return (
            <div className="min-h-screen flex items-center justify-center bg-[#BD2D2D]">
                <div className="flex flex-col md:flex-row max-w-6xl drop-shadow-lg">
                    <div className="flex flex-col items-center justify-center w-full p-10 bg-white font-sans rounded-2xl">
                        <h1 className="text-4xl text-[#BD2D2D] font-bold mb-4 text-center">
                            Thank you for creating an account with MatchUp
                        </h1>
                        <p className="text-md text-[#BD2D2D] text-center font-extralight">
                            Please check your email for a confirmation link.
                        </p>
                        </div>
                </div>
            </div>
        )
}