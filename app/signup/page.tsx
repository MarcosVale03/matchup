'use client'
import {signUp} from '@/lib/auth';
import React, {useState} from 'react';
import AuthCard from '@/features/account-creation/auth-card';
import {isRedirectError} from "next/dist/client/components/redirect-error";

export default function SignupPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [prefix, setPrefix] = useState('');
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormErrors([]);
        setFieldErrors({});

        const errors: Record<string, string[]> = {};

        if (!email) errors.email = ['Email is required'];
        if (!password) errors.password = ['Password is required'];
        if (password.length < 8) errors.password = ['Password must be at least 8 characters'];
        if (!confirmPassword) errors.confirmPassword = ['Please confirm your password'];
        if (password && confirmPassword && password !== confirmPassword) {
            errors.confirmPassword = ['Passwords do not match'];
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setStep(2);
    };

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormErrors([]);
        setFieldErrors({});
        setLoading(true);

        try {
            const result = await signUp(email, password, firstName, lastName, displayName, prefix);

            if (!result.success) {
                // If there are email/password errors, go back to step 1
                if (result.fieldErrors?.email || result.fieldErrors?.password) {
                    setStep(1);
                }
                setFieldErrors(result.fieldErrors ?? {});
                setFormErrors(result.formErrors ?? []);
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
        <div className="bg-primary font-[Poppins] h-screen sm:absolute sm:h-full sm:inset-0 flex items-center justify-center p-4 2xl:p-12">
            <div className="w-full max-w-2xl 2xl:max-w-4xl flex z-10 flex-col sm:flex-row rounded-lg overflow-hidden shadow-lg/40">
                <AuthCard
                    step={step}
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    firstName={firstName}
                    lastName={lastName}
                    displayName={displayName}
                    prefix={prefix}
                    isLoading={loading}
                    fieldErrors={fieldErrors}
                    formErrors={formErrors}
                    authType="Signup"
                    handleAuth={step === 1 ? handleNext : handleSignup}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    onFirstNameChange={setFirstName}
                    onLastNameChange={setLastName}
                    onDisplayNameChange={setDisplayName}
                    onPREChange={setPrefix}
                    onBack={() => { setStep(1); setFormErrors([]); setFieldErrors({}); }}
                />
            </div>
        </div>
    );
}