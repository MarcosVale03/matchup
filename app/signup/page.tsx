'use client'
import { signUp } from '@/lib/auth';
import React, { useState } from 'react';
import MatchupDescription from '@/features/account-creation/matchup-des';
import AuthCard from '@/features/account-creation/auth-card';
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gamertag, setGamertag] = useState('');
    const [prefix, setPrefix] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormErrors([]);
        setFieldErrors({});

        if (!email || !gamertag || !password || !firstName || !lastName || !prefix) {
            setFormErrors(["All fields are required"]);
            return;
        }

        if (password.length < 8) {
            setFormErrors(["Password must be at least 8 characters long"]);
            return;
        }

        setLoading(true);
        try {
            const result = await signUp(email, password, firstName, lastName, gamertag, prefix);
            setLoading(false);

            if (!result.success) {
                setFieldErrors(result.fieldErrors ?? {});
                setFormErrors(result.formErrors ?? [])
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
        <div className="bg-primary font-[Poppins] absolute h-full inset-0 flex items-center justify-center p-4
                          overflow-auto">
            <div className="max-w-5xl flex flex-col sm:flex-row rounded-lg overflow-hidden shadow-md
                            mt-50 xs:mt-30 sm:mt-20">

                {/* Left side of card*/}
                <MatchupDescription />

                {/* Right side of card */}
                    <AuthCard
                        email={email}
                        password={password}
                        firstName={firstName}
                        lastName={lastName}
                        gamertag={gamertag}
                        prefix={prefix}
                        isLoading={loading}
                        fieldErrors={fieldErrors}
                        formErrors={formErrors}
                        authType="Signup"
                        handleAuth={handleSignup}
                        onEmailChange={setEmail}
                        onPasswordChange={setPassword}
                        onFirstNameChange={setFirstName}
                        onLastNameChange={setLastName}
                        onGamerTagChange={setGamertag}
                        onPREChange={setPrefix}
                    />
            </div>
        </div>
    );
}