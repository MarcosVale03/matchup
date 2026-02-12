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
    <div className="bg-primary min-h-screen font-[Poppins] flex flex-col">
        <NavigationBar />
        <div className="flex-1 flex 2xl:items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-0">
            <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 drop-shadow-xl/30 rounded-lg overflow-hidden">
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
    </div>
);


}