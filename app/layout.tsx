import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Jersey_25, Oswald } from "next/font/google";
import NavigationBar from "@/ui/navigation-bar";
import { cookies } from "next/headers";
import { createClient } from "@/server/db/server";
import { ClientLayout } from "./client-layout";
import "./globals.css";
import React from "react";

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
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
});;

const jersey25 = Jersey_25({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-jersey-25",
    display: "swap",
})

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

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang="en" className="bg-zinc-100 h-screen">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title></title>
        </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${jersey25.variable} antialiased`}
            >
            <ClientLayout
                initialUser={user}
            >
                <NavigationBar />
                {children}
            </ClientLayout>

            </body>
        </html>
    );
}
