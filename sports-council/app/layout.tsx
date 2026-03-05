import type { Metadata } from "next";
import { Inter, Syne, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    weight: ["600", "700", "800"],
});
const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
    title: "SRM Sports Council",
    description: "Official portal for SRM Sports Council activities, clubs, and achievements.",
};

import Navbar from "@/components/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${syne.variable} ${outfit.variable}`}>
                <ScrollProgressBar />
                <Navbar />
                {children}
            </body>
        </html>
    );
}
