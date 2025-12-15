export default function AuthErrorDisplay({ message }: { message: string }) {
  return (
    <>
      {message && (
        <p
          className={`mt-2 text-sm min-h-[0.5rem] text-center ${message === "Check your email for confirmation link"
              ? "text-blue-500" 
              : "text-red-500" 
          }`}
        >
          {message}
        </p>
      )}
    </>
  );
}