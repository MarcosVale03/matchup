'use client'
import { useState } from 'react';
import { signUp } from '@/actions/auth';
import MatchupDescription from '@/features/account-creation/matchup-des';
import AuthCard from '@/features/account-creation/auth-card';
import NavigationBar from '@/ui/navigation-bar';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gamertag, setGamertag] = useState('');
    const [prefix, setPrefix] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        if (!email || !gamertag || !password || !firstName || !lastName || !gamertag || !prefix) {
            setMessage("All fields are required");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        const result = await signUp(email, password, firstName, lastName, gamertag, prefix);
        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Signup failed due to an unknown error.");
            return;
        }

    }

    return (
        <div className="bg-[#BD2D2D] min-h-screen">
            <NavigationBar />
            <div className='flex place-content-center md:pt-5 md:pl-18 md:pr-18 md:pb-18 overflow-y-auto'>
                <div className="grid grid-cols-1 sm:grid-cols-2 drop-shadow-xl/30 md:max-w-4xl 2xl:max-w-[55vw]">
                    {/* left side of card */}
                    <MatchupDescription />

                    {/* right side of card */}
                    <AuthCard
                        email={email}
                        password={password}
                        firstName={firstName}
                        lastName={lastName}
                        gamertag={gamertag}
                        prefix={prefix}
                        isLoading={loading}
                        message={message}
                        authType='Signup'
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
        </div>
    )
}