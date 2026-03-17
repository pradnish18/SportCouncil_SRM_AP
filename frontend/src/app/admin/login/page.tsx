"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            // Store admin session in localStorage
            localStorage.setItem('adminUser', JSON.stringify(data));
            router.push('/admin');
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-brand-srm/10 via-background to-background pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] w-full max-w-md shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand-srm rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                        🔐
                    </div>
                    <h1 className="text-3xl font-syne font-bold text-white">Admin Portal</h1>
                    <p className="text-white/50 text-sm font-outfit mt-2">SRM Sports Council CMS</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-srm transition-colors font-outfit text-white placeholder:text-white/20"
                            placeholder="e.g. director_sports"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-bold ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-srm transition-colors font-outfit text-white placeholder:text-white/20"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm font-outfit text-center"
                        >
                            ⚠ {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-srm hover:bg-brand-srm/80 disabled:opacity-50 text-white font-syne font-bold rounded-2xl transition-all shadow-lg tracking-wide"
                    >
                        {loading ? "Signing in..." : "Sign In →"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
