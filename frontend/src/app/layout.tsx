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
    title: { default: "SRM Sports Council — AP", template: "%s | SRM Sports Council" },
    description: "Official portal for SRM University AP Sports Council. Explore clubs, events, achievements, and join our athletic community.",
    keywords: ["SRM University", "Sports Council", "AP", "Athletics", "Clubs", "Events"],
};

import Navbar from "@/components/layout/Navbar";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${syne.variable} ${outfit.variable}`}>
                <ThemeProvider>
                    {/* Skip to main content — WCAG 2.4.1 Bypass Blocks */}
                    <a href="#main-content" className="skip-to-main">
                        Skip to main content
                    </a>
                    <ScrollProgressBar />
                    <Navbar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

