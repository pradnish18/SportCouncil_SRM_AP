"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Clubs", href: "/clubs" },
    { name: "Events", href: "/events" },
    { name: "Achievements", href: "/achievements" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
            <div className="glass px-8 py-4 rounded-full flex items-center gap-8 pointer-events-auto">
                <Link href="/" className="font-syne font-extrabold text-xl mr-4 flex items-center gap-2">
                    <span className="text-2xl">🏅</span>
                    <span className="hidden sm:inline">SRM Sports</span>
                </Link>
                <div className="flex items-center gap-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative font-outfit text-sm font-medium transition-colors ${isActive ? "text-white" : "text-muted hover:text-white"
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-indigo"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
