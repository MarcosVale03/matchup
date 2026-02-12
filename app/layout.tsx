import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-white">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
