"use client";

import { motion } from "framer-motion";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-12 rounded-[2.5rem] w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="text-4xl mb-4 text-brand-blue">🔐</div>
                    <h1 className="text-3xl font-syne font-bold">Admin Portal</h1>
                    <p className="text-muted text-sm font-outfit mt-2">SRM Sports Council CMS</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold ml-1">Username</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-blue transition-colors font-outfit"
                            placeholder="e.g. director_sports"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-blue transition-colors font-outfit"
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="w-full py-4 bg-brand-blue hover:bg-brand-blue/80 text-white font-syne font-bold rounded-2xl transition-all shadow-lg shadow-brand-blue/20">
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
