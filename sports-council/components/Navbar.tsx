"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Clubs", href: "/clubs" },
    { name: "Events", href: "/events" },
    { name: "Achievements", href: "/achievements" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-6 pointer-events-none">
            <div className="glass px-6 sm:px-8 py-4 rounded-full flex items-center justify-between w-full max-w-4xl pointer-events-auto">
                <Link href="/" className="font-syne font-extrabold text-xl flex items-center gap-2">
                    <span className="text-2xl">🏅</span>
                    <span className="inline">SRM Sports</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
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

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <motion.span
                        initial={false}
                        animate={isMobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                        className="block w-6 h-0.5 bg-white rounded-full origin-center"
                    />
                    <motion.span
                        initial={false}
                        animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                        className="block w-6 h-0.5 bg-white rounded-full"
                    />
                    <motion.span
                        initial={false}
                        animate={isMobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                        className="block w-6 h-0.5 bg-white rounded-full origin-center"
                    />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-24 left-6 right-6 glass p-8 rounded-[2rem] md:hidden pointer-events-auto shadow-2xl"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`text-2xl font-syne font-bold transition-colors ${isActive ? "text-brand-indigo" : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
