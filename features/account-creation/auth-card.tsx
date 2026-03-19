import Link from "next/link";
import BasicInputWithLabel from "@/ui/basic-input-with-label";
import React from "react";

type AuthCardProps = {
    step?: 1 | 2;
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    prefix?: string;
    isLoading: boolean;
    formErrors: string[] | undefined;
    fieldErrors?: Record<string, string[]> | undefined;
    authType: 'Signup' | 'Login';
    handleAuth: (event: React.FormEvent<HTMLFormElement>) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange?: (value: string) => void;
    onFirstNameChange?: (value: string) => void;
    onLastNameChange?: (value: string) => void;
    onDisplayNameChange?: (value: string) => void;
    onPREChange?: (value: string) => void;
    onBack?: () => void;
}

export default function AuthCard({
                                     step = 1,
                                     email,
                                     password,
                                     confirmPassword,
                                     firstName,
                                     lastName,
                                     displayName,
                                     prefix,
                                     isLoading,
                                     formErrors,
                                     fieldErrors,
                                     authType,
                                     handleAuth,
                                     onEmailChange,
                                     onPasswordChange,
                                     onConfirmPasswordChange,
                                     onFirstNameChange,
                                     onLastNameChange,
                                     onDisplayNameChange,
                                     onPREChange,
                                     onBack
                                 }: AuthCardProps) {
    const headerMessage = authType === 'Signup' ? 'Welcome!' : 'Welcome back!';
    const subHeaderMessage = authType === 'Signup' ? 'Create a MatchUp account' : 'Sign in to your MatchUp account';
    const footer = authType === 'Signup' ? 'Already have an account?' : "Don't have an account?";
    const href = authType === 'Signup' ? '/login' : '/signup';

    const pageLabelClass = "block text-zinc-600 2xl:text-xl rounded-md peer-focus:text-primary transition duration-400";

    const pageInputClass = `peer block bg-white w-full rounded-xl border-2 border-white 
                            text-black p-2 2xl:p-4 2xl:text-xl focus:outline-none 
                            focus:border-primary shadow-md/15 transition duration-400 font-normal`;

    const errorClass = "text-errors flex text-sm 2xl:text-base mt-1";

    return (
        <div className="flex flex-col place-self-center bg-main-bg rounded-lg p-10 2xl:p-16 gap-3 2xl:gap-6 w-full">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl text-primary tracking-tight text-center font-bold">
                    {headerMessage}
                </h1>
                <h2 className="text-xs sm:text-sm 2xl:text-lg text-zinc-500 font-[Poppins] font-semibold text-center">
                    {subHeaderMessage}
                </h2>

                {/* Step indicator (signup only) */}
                {authType === 'Signup' && (
                    <div className="flex justify-center items-center gap-2 mt-3">
                        <div
                            className={`h-2 w-8 2xl:h-3 2xl:w-12 rounded-full transition-colors duration-300 ${step === 1 ? 'bg-primary' : 'bg-zinc-300'}`}/>
                        <div
                            className={`h-2 w-8 2xl:h-3 2xl:w-12 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-primary' : 'bg-zinc-300'}`}/>
                    </div>
                )}
            </div>

            <form
                onSubmit={handleAuth}
                id="auth-form-submit"
                className="space-y-2 grid grid-cols-2 gap-x-4">

                {/* Step 1: Email, Password, Confirm Password */}
                {(authType === 'Login' || step === 1) && (
                    <>
                        <div className="col-span-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Email"
                                inputType="email"
                                inputName="emailInput"
                                inputId="emailInput"
                                inputValue={email}
                                inputOnChange={(e) => onEmailChange(e.target.value)}
                                required={false}
                                inputPlaceholder="Enter your email"
                                inputClassName={pageInputClass}
                            />
                            {fieldErrors?.email && <p className={errorClass}>{fieldErrors.email[0]}</p>}
                        </div>

                        <div className="col-span-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Password"
                                inputType="password"
                                inputName="passwordInput"
                                inputId="password"
                                inputValue={password}
                                inputOnChange={(e) => onPasswordChange(e.target.value)}
                                required={false}
                                inputPlaceholder={authType === "Signup" ? "At least 8 characters" : "Enter your password"}
                                inputClassName={pageInputClass}
                            />
                            {fieldErrors?.password && <p className={errorClass}>{fieldErrors.password[0]}</p>}
                        </div>

                        {authType === 'Signup' && (
                            <div className="col-span-2">
                                <BasicInputWithLabel
                                    labelClassName={pageLabelClass}
                                    labelText="Confirm Password"
                                    inputType="password"
                                    inputName="confirmPasswordInput"
                                    inputId="confirmPassword"
                                    inputValue={confirmPassword ?? ''}
                                    inputOnChange={(e) => onConfirmPasswordChange?.(e.target.value)}
                                    required={false}
                                    inputPlaceholder="Re-enter your password"
                                    inputClassName={pageInputClass}
                                />
                                {fieldErrors?.confirmPassword &&
                                    <p className={errorClass}>{fieldErrors.confirmPassword[0]}</p>}
                            </div>
                        )}
                    </>
                )}

                {/* Step 2: Gamertag, First/Last Name, Prefix */}
                {authType === 'Signup' && step === 2 && (
                    <>
                        <div className="col-span-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Display Name"
                                inputType="text"
                                inputName="displayNameInput"
                                inputId="displayNameInput"
                                inputValue={displayName}
                                inputOnChange={(e) => onDisplayNameChange?.(e.target.value)}
                                required={false}
                                inputPlaceholder="Enter a display name"
                                inputClassName={pageInputClass}
                            />
                            {fieldErrors?.display_name && <p className={errorClass}>{fieldErrors.display_name[0]}</p>}
                        </div>

                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="First Name"
                                inputType="text"
                                inputName="fnInput"
                                inputId="firstName"
                                inputValue={firstName}
                                inputOnChange={(e) => onFirstNameChange?.(e.target.value)}
                                required={false}
                                inputPlaceholder="Enter your first name"
                                inputClassName={pageInputClass}
                            />
                            {fieldErrors?.first_name && <p className={errorClass}>{fieldErrors.first_name[0]}</p>}
                        </div>

                        <div>
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Last Name"
                                inputType="text"
                                inputName="lnInput"
                                inputId="lastName"
                                inputValue={lastName}
                                inputOnChange={(e) => onLastNameChange?.(e.target.value)}
                                required={false}
                                inputPlaceholder="Enter your last name"
                                inputClassName={pageInputClass}
                            />
                            {fieldErrors?.last_name && <p className={errorClass}>{fieldErrors.last_name[0]}</p>}
                        </div>

                        <div className="col-span-2">
                            <BasicInputWithLabel
                                labelClassName={pageLabelClass}
                                labelText="Prefix (Optional)"
                                inputType="text"
                                inputName="prefixInput"
                                inputId="prefix"
                                inputValue={prefix}
                                inputOnChange={(e) => onPREChange?.(e.target.value)}
                                required={false}
                                inputPlaceholder="Enter a prefix"
                                inputClassName={pageInputClass}
                            />
                            {fieldErrors?.prefix && <p className={errorClass}>{fieldErrors.prefix[0]}</p>}
                        </div>
                    </>
                )}
            </form>

            {/* Buttons */}
            <div className="flex gap-2">
                {authType === 'Signup' && step === 2 && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="bg-primary text-white py-2.5 sm:py-3 2xl:py-5 px-4 sm:px-5 2xl:px-8
                                    2xl:text-xl rounded-lg hover:bg-secondary hover:cursor-pointer w-full
                                    transition-colors duration-150 text-sm sm:text-base font-medium
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                )}
                <button
                    form="auth-form-submit"
                    type="submit"
                    className="bg-primary text-white py-2.5 sm:py-3 2xl:py-5 px-4 sm:px-5 2xl:px-8
                               2xl:text-xl rounded-lg hover:bg-secondary hover:cursor-pointer w-full
                               transition-colors duration-150 text-sm sm:text-base font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : authType === 'Login' ? 'Login' : step === 1 ? 'Next' : 'Create Account'}
                </button>
            </div>

            {/* Form-level errors */}
            {formErrors && formErrors.length !== 0 && (
                <div className="text-xs sm:text-sm text-center px-2 text-errors">
                    {formErrors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
            )}

            {/* Footer */}
            <p className="text-xs sm:text-sm 2xl:text-lg text-gray-500 text-center">
                {footer}{' '}
                <Link href={href} className="text-primary hover:underline font-medium">
                    {authType === 'Login' ? 'Signup' : 'Login'}
                </Link>
            </p>
        </div>
    );
}