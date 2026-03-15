"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminStats() {
    const [totalTeams, setTotalTeams] = useState<number>(0);
    const [totalMembers, setTotalMembers] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch('/api/stats').then(r => r.json()).then(data => {
            setTotalTeams(data.totalTeams ?? 0);
            setTotalMembers(data.totalMembers ?? 0);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch('/api/admin/stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalTeams, totalMembers })
            });
            if (res.ok) setMessage("✅ Stats updated successfully!");
            else setMessage("❌ Failed to update.");
        } catch { setMessage("❌ Network error."); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="text-white/30 text-center py-24 font-outfit">Loading stats...</div>;

    return (
        <div className="space-y-8 max-w-lg">
            <div>
                <h1 className="text-3xl font-syne font-extrabold text-white">Site Stats</h1>
                <p className="text-white/40 font-outfit text-sm mt-1">Update the numbers displayed in the Hero section</p>
            </div>

            {message && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-outfit p-4 rounded-xl bg-white/5 border border-white/10">
                    {message}
                </motion.div>
            )}

            <div className="space-y-6 p-8 rounded-3xl bg-white/5 border border-white/10">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">Total Sports Teams</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            value={totalTeams}
                            onChange={e => setTotalTeams(Number(e.target.value))}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-4xl font-syne font-extrabold outline-none focus:border-brand-srm transition-colors"
                            min={0}
                        />
                        <span className="text-4xl">🏆</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3 font-bold">Total Registered Athletes</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="number"
                            value={totalMembers}
                            onChange={e => setTotalMembers(Number(e.target.value))}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-4xl font-syne font-extrabold outline-none focus:border-brand-srm transition-colors"
                            min={0}
                        />
                        <span className="text-4xl">👥</span>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-4 bg-brand-srm text-white font-syne font-bold rounded-2xl hover:bg-brand-srm/80 disabled:opacity-50 transition-colors shadow-lg mt-2"
                >
                    {saving ? "Updating..." : "Update Stats ✓"}
                </button>
            </div>

            <div className="p-6 rounded-2xl bg-brand-srm/5 border border-brand-srm/20">
                <p className="text-brand-srm/80 text-sm font-outfit">
                    <span className="font-bold text-brand-srm">Tip:</span> These numbers appear in the Hero section on the homepage and are publicly visible. Make sure they are accurate before saving.
                </p>
            </div>
        </div>
    );
}
