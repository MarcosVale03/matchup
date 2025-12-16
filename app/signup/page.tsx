'use client'
import { useState } from 'react';
import { signUp } from '@/actions/auth';
import MatchupDescription from '@/features/account-creation/matchup-des';
import AuthCard from '@/features/account-creation/auth-card';
import NavigationBar from '@/ui/navigation-bar';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!email || !username || !password) {
            setMessage("All fields are required");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        const result = await signUp(username, email, password);
        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Signup failed due to an unknown error.");
            return;
        }

        setMessage(result.message ?? "Check your email for confirmation link");
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
                    username={username}
                    password={password}
                    message={message}
                    isLoading={loading}
                    authType="Signup"
                    onEmailChange={setEmail}
                    onUsernameChange={setUsername}
                    onPasswordChange={setPassword}
                    handleAuth={handleSignup}
                />   
            </div>
        </div>
    )
}