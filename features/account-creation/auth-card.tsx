import Link from "next/link";
import AuthFields from "./auth-fields";
import AuthErrorDisplay from "./auth-error-display";

type AuthCardProps = {
    email: string;
    username?: string;
    password: string;
    message: string;
    isLoading: boolean;
    authType: 'Signup' | 'Login';
    handleAuth: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onEmailChange: (value: string) => void;
    onUsernameChange?: (username: string) => void;
    onPasswordChange: (password: string) => void;
};


export default function AuthCard({
    email,
    username,
    password,
    message,
    isLoading,
    authType,
    handleAuth,
    onEmailChange,
    onUsernameChange,
    onPasswordChange,
}: AuthCardProps) {
    const headerMessage = authType === 'Signup' ? 'Welcome!' : 'Welcome back!';
    const subHeaderMessage = authType === 'Signup' ? 'Create a MatchUp account' : 'Sign in to your MatchUp account';
    const footer = authType === 'Signup' ? 'Already have an account?' : "Don't have an account?";
    const href = authType === 'Signup' ? '/login' : '/signup';

    return (
        <main className="flex items-center justify-center bg-white rounded-r-2xl">
            <div className="flex flex-col items-center border border-gray-300 rounded-xl drop-shadow-lg p-20 m-10 bg-white max-w-sm">

                <h1 className="text-4xl font-bold mb-1 text-[#BD2D2D] text-center">
                    {headerMessage}
                </h1>
                <h2 className="mb-2 text-sm text-gray-500 ">
                    {subHeaderMessage}
                </h2>

                <form onSubmit={handleAuth} className="w-full">
                    {authType === 'Signup' ? (
                        <AuthFields
                            email={email}
                            username={username}
                            password={password}
                            isLoading={isLoading}
                            authType="Signup"
                            onEmailChange={onEmailChange}
                            onUsernameChange={onUsernameChange}
                            onPasswordChange={onPasswordChange}
                        />
                    ) : (
                        <AuthFields
                            email={email}
                            password={password}
                            isLoading={isLoading}
                            authType="Login"
                            onEmailChange={onEmailChange}
                            onPasswordChange={onPasswordChange}
                        />
                    )}
                </form>

                <AuthErrorDisplay message={message} />

                <p className="mt-4 text-sm text-gray-500">
                    {footer}{' '}
                    <Link href={href} className="text-[#BD2D2D] hover:underline">
                        {authType === 'Login' ? 'Signup' : 'Login'}
                    </Link>
                </p>
            </div>
        </main>
    );
};