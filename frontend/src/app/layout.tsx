import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainContentWrapper from "@/components/MainContentWrapper/MainContentWrapper";
import {AuthProvider} from "@/context/AuthContext";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "MemeGen",
    description: "Meme generator app for everyone to use and enjoy",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
        <AuthProvider>
            <MainContentWrapper>
                {children}
            </MainContentWrapper>
        </AuthProvider>
        </body>
        </html>
    );
}
