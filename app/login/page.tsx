'use client'
import React, { useState } from 'react';
import {signInWithEmail, signUp} from '@/lib/auth';
import MatchupDescription from '@/features/account-creation/matchup-des';
import AuthCard from '@/features/account-creation/auth-card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false)

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!email || !password) {
            setMessage("Please enter your email and password");
            return;
        }

        setLoading(true);
        try {
            const result = await signInWithEmail(email, password);
            setLoading(false);

            if (!result.success) {
                setMessage("Sign in failed due to an unknown error.");
                return;
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            setMessage("Something went wrong. Please try again later.")
        }
    }

    return (
        <div className="bg-primary font-[Poppins] absolute h-full inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-md bg-white">
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
    );

}