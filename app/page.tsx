import { redirect } from "next/navigation";

export default function Home() {
    redirect("/tournaments");
	return (
		<>
		<main className="bg-white flex flex-col min-h-screen justify-center items-center text-black">
            Home
		</main>
		</>	
	)
}
