'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/actions/auth';
import MatchupDescription from '@/features/account-creation/matchup-des';
import AuthCard from '@/features/account-creation/auth-card';
import NavigationBar from '@/ui/navigation-bar';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!email || !password) {
            setMessage("Please enter your email and password");
            return;
        }

        setLoading(true);
        const result = await signInWithEmail(email, password);
        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Login failed due to an unknown error.");
            return;
        }

        router.replace("/tournaments");
    }

    return (
        <div className="bg-primary min-h-screen font-[Poppins] flex flex-col">
            <NavigationBar />
            <div className="flex-1 flex 2xl:items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-0">
                <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 drop-shadow-xl/30 rounded-lg overflow-hidden min-h-[73vh] 2xl:min-h-[55vh]">
                        {/* left side of card */}
                        <MatchupDescription />


                        {/* right side of card */}
                        <AuthCard
                            email={email}
                            password={password}
                            isLoading={loading}
                            message={message}
                            authType='Login'
                            handleAuth={handleLogin}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}