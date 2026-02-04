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
        <div className="bg-[#BD2D2D] min-h-screen flex flex-col">
            <NavigationBar hiddenButton={true} />
            <div className='flex-grow flex place-content-center md:pt-5 md:pl-18 md:pr-18 md:pb-18'>
                <div className="grid grid-cols-1 sm:grid-cols-2 drop-shadow-xl/30 md:max-w-4xl 2xl:max-w-[55vw]">
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
    )
}