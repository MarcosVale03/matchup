import type {Metadata} from "next";
import {Poppins, Jersey_25} from "next/font/google";
import NavigationBar from "@/ui/navigation-bar";
import {cookies} from "next/headers";
import {createClient} from "@/server/db/server";
import {ClientLayout} from "./client-layout";
import "./globals.css";
import React from "react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
});

const jersey25 = Jersey_25({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-jersey",
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

    const {data: {user}} = await supabase.auth.getUser();

    return (
        <html lang="en" className="bg-main-bg">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title></title>
        </head>
        <body
            className={`${poppins.variable} ${jersey25.variable} font-sans antialiased`}
        >
        <ClientLayout initialUser={user}>
            <div className="flex flex-col min-h-screen bg-main-bg">
                <NavigationBar/>

                <main className="flex-1 flex flex-col">
                    {children}
                </main>
            </div>
        </ClientLayout>
        </body>
        </html>
    );
}
