"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative min-h-screen pt-24 flex flex-col items-center justify-center overflow-hidden">
            {/* Background with Grid */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center"
            >
                <span className="inline-block px-4 py-1 mb-4 text-[10px] font-semibold tracking-[0.2em] uppercase border rounded-full border-brand-indigo/30 bg-brand-indigo/10 text-brand-indigo">
                    SRM University AP
                </span>
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-syne font-extrabold bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent px-4">
                    SRM Sports Council
                </h1>
                <p className="mt-6 text-subtle font-outfit text-base sm:text-lg max-w-2xl mx-auto opacity-70 px-6">
                    The central hub for all sports-related activities, club information, event management, and achievement showcases.
                </p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-16 z-10 glass rounded-2xl px-8 sm:px-12 py-6 flex flex-wrap justify-center gap-8 sm:gap-16"
            >
                <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-syne font-bold text-brand-blue">15+</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted">Total Teams</div>
                </div>
                <div className="hidden sm:block w-[1px] h-12 bg-white/10"></div>
                <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-syne font-bold text-brand-green">500+</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted">Total Members</div>
                </div>
            </motion.div>
        </section>
    );
}
