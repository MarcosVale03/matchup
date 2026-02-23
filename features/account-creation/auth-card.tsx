import Link from "next/link";
import BasicInputWithLabel from "@/ui/basic-input-with-label";

type AuthCardProps = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    gamertag?: string;
    prefix?: string;
    isLoading: boolean;
    message: string;
    authType: 'Signup' | 'Login';
    handleAuth: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onFirstNameChange?: (value: string) => void;
    onLastNameChange?: (value: string) => void;
    onGamerTagChange?: (value: string) => void;
    onPREChange?: (value: string) => void;
}

export default function AuthCard({
    email,
    password,
    firstName,
    lastName,
    gamertag,
    prefix,
    isLoading,
    message,
    authType,
    handleAuth,
    onEmailChange,
    onPasswordChange,
    onFirstNameChange,
    onLastNameChange,
    onGamerTagChange,
    onPREChange
}: AuthCardProps) {
    const headerMessage = authType === 'Signup' ? 'Welcome!' : 'Welcome back!';
    const subHeaderMessage = authType === 'Signup' ? 'Create a MatchUp account' : 'Sign in to your MatchUp account';
    const footer = authType === 'Signup' ? 'Already have an account?' : "Don't have an account?";
    const href = authType === 'Signup' ? '/login' : '/signup';


    const pageInputClass = `w-full rounded-md border border-gray-300 shadow-sm p-2 sm:p-2.5 
                        focus:border-primary focus:ring-primary text-gray-500 focus:outline-none 
                        focus:border-primary text-sm sm:text-base`;
    const pageLabelClass = "text-left text-gray-500 text-sm sm:text-base";


    return (
        <main className="flex flex-col place-content-center bg-white rounded-b-lg sm:rounded-r-lg 
                     sm:rounded-bl-none p-6 sm:p-8 md:p-10 lg:p-12 gap-3 "
        >
            <div className="space-y-1 sm:space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-primary text-center font-bold">
                    {headerMessage}
                </h1>
                <h2 className="text-xs sm:text-sm text-gray-500 font-light text-center">
                    {subHeaderMessage}
                </h2>
            </div>

            <form
                onSubmit={handleAuth}
                id="auth-form-submit"
                className="max-h-[50vh] sm:max-h-[45vh] md:max-h-[40vh] lg:max-h-[35vh] pr-1 sm:pr-2 overflow-auto space-y-2"
            >
                {/* Email */}
                <BasicInputWithLabel
                    labelClassName={pageLabelClass}
                    labelText="Email"
                    inputType="email"
                    inputName="emailInput"
                    inputId="emailInput"
                    inputValue={email}
                    inputOnChange={(e) => onEmailChange(e.target.value)}
                    required={true}
                    inputPlaceholder="Enter your email"
                    inputClassName={pageInputClass}
                />

                {/* Password */}
                <BasicInputWithLabel
                    labelClassName={pageLabelClass}
                    labelText="Password"
                    inputType="password"
                    inputName="passwordInput"
                    inputId="password"
                    inputValue={password}
                    inputOnChange={(e) => onPasswordChange(e.target.value)}
                    required={true}
                    inputPlaceholder={authType === "Signup" ? "At least 8 characters" : "Enter your password"}
                    inputClassName={pageInputClass}
                />

                {/* For signup */}
                {authType === 'Signup' && (
                    <>
                        {/* Gamertag */}
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText="Gamertag"
                            inputType="text"
                            inputName="gamertagInput"
                            inputId="gamertag"
                            inputValue={gamertag}
                            inputOnChange={(e) => onGamerTagChange?.(e.target.value)}
                            required={true}
                            inputPlaceholder={"Enter a gamertag"}
                            inputClassName={pageInputClass}
                        />

                        {/* First Name */}
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText="First Name"
                            inputType="text"
                            inputName="fnInput"
                            inputId="firstName"
                            inputValue={firstName}
                            inputOnChange={(e) => onFirstNameChange?.(e.target.value)}
                            required={true}
                            inputPlaceholder={"Enter your first name"}
                            inputClassName={pageInputClass}
                        />

                        {/* Last Name */}
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText="Last Name"
                            inputType="text"
                            inputName="lnInput"
                            inputId="lastName"
                            inputValue={lastName}
                            inputOnChange={(e) => onLastNameChange?.(e.target.value)}
                            required={true}
                            inputPlaceholder={"Enter your last name"}
                            inputClassName={pageInputClass}
                        />

                        {/* Prefix */}
                        <BasicInputWithLabel
                            labelClassName={pageLabelClass}
                            labelText="Prefix"
                            inputType="text"
                            inputName="prefixInput"
                            inputId="prefix"
                            inputValue={prefix}
                            inputOnChange={(e) => onPREChange?.(e.target.value)}
                            required={false}
                            inputPlaceholder={"Enter a prefix"}
                            inputClassName={pageInputClass}
                        />
                    </>
                )}
            </form>

            <button
                form="auth-form-submit"
                type="submit"
                className="bg-primary text-white py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg 
                       hover:bg-red-800 hover:cursor-pointer w-full 
                       transition-colors duration-150 text-sm sm:text-base font-medium
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : (authType === 'Signup' ? 'Create Account' : 'Login')}
            </button>

            {/* Error/Email confirmation message */}
            {message && (
                <p
                    className={`text-xs sm:text-sm text-center px-2 ${message === "Check your email for confirmation link"
                            ? "text-blue-500"
                            : "text-red-500"
                        }`}
                >
                    {message}
                </p>
            )}

            <p className="text-xs sm:text-sm text-gray-500 text-center">
                {footer}{' '}
                <Link href={href} className="text-primary hover:underline font-medium">
                    {authType === 'Login' ? 'Signup' : 'Login'}
                </Link>
            </p>
        </main>
    );
};