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
        <div className="min-h-screen flex items-center justify-center bg-[#BD2D2D]">
            <NavigationBar hidden={true}/>

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl drop-shadow-xl/30">
                {/* left side of card */}
                <MatchupDescription />

                {/* right side of card */}
                <AuthCard 
                    email={email}
                    password={password}
                    message={message}
                    isLoading={loading}
                    authType='Login'
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    handleAuth={handleLogin}
                />
            </div>
        </div>
    )
}