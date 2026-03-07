'use client'
import React, { useState } from 'react';
import { signInWithEmail } from '@/lib/auth';
import MatchupDescription from '@/features/account-creation/matchup-des';
import AuthCard from '@/features/account-creation/auth-card';
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false)

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormErrors([]);

        if (!email || !password) {
            setFormErrors(["Please enter your email and password"]);
            return;
        }

        setLoading(true);
        try {
            const result = await signInWithEmail(email, password);
            setLoading(false);

            if (!result.success) {
                setFormErrors([result.error]);
                return;
            }
        } catch (err) {
            if (isRedirectError(err)) throw err;
            console.log(err);
            setFormErrors(["Something went wrong. Please try again later."])
        } finally {
            setLoading(false);
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
                    formErrors={formErrors}
                    authType='Login'
                    handleAuth={handleLogin}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                />
            </div>
        </div>
    );

}