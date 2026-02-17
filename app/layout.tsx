import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { createClient } from "@/server/db/server";
import { cookies } from "next/headers";
import NavigationBar from "@/ui/navigation-bar";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],         
  weight: [
    "100", "200", "300",       
    "600", "700", "800", "900" 
  ],
  variable: "--font-poppins", 
  display: "swap",            
});

export const metadata: Metadata = {
    title: "Matchup Homepage",

    description: "Official Matchup Homepage",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user }} = await supabase.auth.getUser();

    return (
        <html lang="en" className="bg-white h-screen">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
            >
                <NavigationBar user={user}/>
                {children}
            </body>
        </html>
    );
}
