type AuthFieldsProps = {
    email: string;
    username?: string;
    password: string;
    isLoading: boolean
    authType: 'Signup' | 'Login';
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onUsernameChange?: (value: string) => void;
}

export default function AuthFields({ 
    email, 
    username, 
    password, 
    isLoading,
    authType,
    onEmailChange, 
    onPasswordChange, 
    onUsernameChange
}: AuthFieldsProps) {
    return (
        <div className="flex flex-col">
            <p className="text-left text-gray-500 font-sans">
                Email
            </p>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="Enter your email"
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-black"
            />
            {authType === 'Signup' && (
                <>
                    <p className="text-left text-gray-500 font-sans">
                        Username
                    </p>
                    <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => onUsernameChange?.(e.target.value)}
                    placeholder="Enter a username"
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-black"
                    />
                </>
            )}
            <p className="text-left text-gray-500 font-sans">
                Password
            </p>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder={authType === "Signup" ? "At least 8 characters" : "Password"}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-black"
            />

            <button 
                type="submit" 
                className="bg-[#BD2D2D] text-white py-3 px-5 rounded-lg hover:bg-red-800 hover:cursor-pointer "
                disabled={isLoading}
            >
                {authType === 'Signup' ? 'Create' : 'Login'}
            </button>
        </div>
    );
}