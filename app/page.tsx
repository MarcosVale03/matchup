import Link from 'next/link';
import NavigationBar from '../ui/navigation-bar'

export default function Home() {
  return (
    // placeholder code for the home page, will probably just be the search page for now
    <main className="bg-white">
      <NavigationBar />
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-black">Matchup</h1>
        <Link href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
        <Link href="/signup" className="text-blue-600 hover:underline">
          Go to Signup
        </Link>
      </div>
    </main>
  );
}
